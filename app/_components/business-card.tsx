'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, Star, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface BusinessCardProps {
  id: string;
  name: string;
  category: string;
  description: string;
  phone: string;
  photoUrl: string;
  featured: boolean;
}

export function BusinessCard({ id, name, category, description, phone, photoUrl, featured }: BusinessCardProps) {
  return (
    <Link href={`/listing/${id}`}>
      <Card className="group overflow-hidden transition-all duration-normal hover:shadow-lg hover:-translate-y-1 h-full">
        <div className="relative aspect-video bg-muted">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={`Photo of ${name}`}
              fill
              className="object-cover transition-transform duration-slow group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={(e: any) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No image
            </div>
          )}
          {featured && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-amber-500 text-white border-0 gap-1">
                <Star className="h-3 w-3 fill-current" />
                Featured
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <Badge variant="secondary" className="mb-2 text-xs">{category}</Badge>
          <h3 className="font-display font-semibold text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
          {phone && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              <span suppressHydrationWarning>{phone}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-sm text-primary font-medium mt-3">
            View Details <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
