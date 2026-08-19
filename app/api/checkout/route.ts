export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getStripe } from '@/lib/stripe';

// Lazily create or find the Stripe product+price for Featured Listing
async function getOrCreatePrice(): Promise<string> {
  const stripe = getStripe();

  // Search for existing product by metadata
  const products = await stripe.products.search({
    query: "metadata['app']:'accesshome_featured'",
  });

  let productId: string;

  if ((products?.data?.length ?? 0) > 0) {
    productId = products.data[0].id;
  } else {
    const product = await stripe.products.create({
      name: 'Featured Listing — AccessHome Directory',
      description: 'Monthly featured listing in the AccessHome Directory. Your business will be highlighted at the top of category pages and on the homepage.',
      metadata: { app: 'accesshome_featured' },
    });
    productId = product.id;
  }

  // Find existing price
  const prices = await stripe.prices.list({
    product: productId,
    active: true,
    type: 'recurring',
    limit: 1,
  });

  if ((prices?.data?.length ?? 0) > 0) {
    return prices.data[0].id;
  }

  // Create price
  const price = await stripe.prices.create({
    product: productId,
    unit_amount: 4000, // $40.00
    currency: 'usd',
    recurring: { interval: 'month' },
  });

  return price.id;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const businessId = body?.businessId;

    if (!businessId) {
      return NextResponse.json({ error: 'Missing businessId' }, { status: 400 });
    }

    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    if (business.featured) {
      return NextResponse.json({ error: 'Business is already featured' }, { status: 400 });
    }

    const stripe = getStripe();
    const priceId = await getOrCreatePrice();
    const origin = request.headers.get('origin') ?? 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/listing/${businessId}?featured=success`,
      cancel_url: `${origin}/listing/${businessId}?featured=cancelled`,
      metadata: { businessId },
      client_reference_id: businessId,
    });

    return NextResponse.json({ url: session?.url ?? '' });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Internal error' },
      { status: 500 }
    );
  }
}
