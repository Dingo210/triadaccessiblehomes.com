export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getStripe } from '@/lib/stripe';
import Stripe from 'stripe';

// `current_period_end` moved from the Subscription object onto its items in the
// Basil-era API versions. The webhook endpoint is unpinned and follows the
// account's default version, so read the item value first and fall back to the
// legacy top-level field.
function getPeriodEnd(subscription: Stripe.Subscription): Date | null {
  const subAny = subscription as any;
  const epoch = subAny?.items?.data?.[0]?.current_period_end ?? subAny?.current_period_end;
  return typeof epoch === 'number' ? new Date(epoch * 1000) : null;
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const rawBody = await request.text();
  const sig = request.headers.get('stripe-signature') ?? '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err?.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const businessId = session?.metadata?.businessId ?? session?.client_reference_id;
        if (businessId) {
          const subscriptionId = typeof session?.subscription === 'string'
            ? session.subscription
            : (session?.subscription as any)?.id ?? '';

          const now = new Date();
          const featuredUntil = new Date(now);
          featuredUntil.setMonth(featuredUntil.getMonth() + 1);

          await prisma.business.update({
            where: { id: businessId },
            data: {
              featured: true,
              featuredUntil,
              stripeSubscriptionId: subscriptionId,
              stripeCustomerId: typeof session?.customer === 'string'
                ? session.customer
                : (session?.customer as any)?.id ?? '',
            },
          });
          console.log(`Business ${businessId} is now featured.`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const business = await prisma.business.findFirst({
          where: { stripeSubscriptionId: subscription?.id ?? '' },
        });
        if (business) {
          const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';
          const periodEnd = getPeriodEnd(subscription);

          await prisma.business.update({
            where: { id: business.id },
            data: {
              featured: isActive,
              featuredUntil: periodEnd,
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const business = await prisma.business.findFirst({
          where: { stripeSubscriptionId: subscription?.id ?? '' },
        });
        if (business) {
          await prisma.business.update({
            where: { id: business.id },
            data: {
              featured: false,
              featuredUntil: null,
              stripeSubscriptionId: null,
            },
          });
          console.log(`Business ${business.id} featured status removed.`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err: any) {
    console.error('Webhook handler error:', err);
  }

  return NextResponse.json({ received: true });
}
