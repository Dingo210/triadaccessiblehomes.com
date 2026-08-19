import {
  Home, Accessibility, Bath, ChefHat, Hammer, Wrench, Heart, ArrowUpDown,
  type LucideIcon
} from 'lucide-react';

export interface CategoryConfig {
  name: string;
  slug: string;
  icon: LucideIcon;
  imageUrl: string;
  keywords: string[];
}

export const CATEGORIES: CategoryConfig[] = [
  {
    name: 'Home Modifications',
    slug: 'home-modifications',
    icon: Home,
    imageUrl: 'https://www.homesafety.net/wp-content/uploads/2018/12/ramp-rental.jpg',
    keywords: ['home modifications', 'medical equipment', 'ramps', 'grab bars'],
  },
  {
    name: 'Mobility & Accessibility',
    slug: 'mobility-accessibility',
    icon: Accessibility,
    imageUrl: 'https://i.ytimg.com/vi/wrsq2pCU-Zw/maxresdefault.jpg',
    keywords: ['mobility', 'accessibility products', 'scooters'],
  },
  {
    name: 'Stair & Platform Lifts',
    slug: 'stair-platform-lifts',
    icon: ArrowUpDown,
    imageUrl: 'https://home.mobilityworks.com/wp-content/uploads/2020/11/vertical-platform-lifts-bruno-residential-porch.jpg',
    keywords: ['stair lifts', 'stairlift', 'platform lifts', 'wheelchair lifts', 'chair lift'],
  },
  {
    name: 'Bathroom Remodeling',
    slug: 'bathroom-remodeling',
    icon: Bath,
    imageUrl: 'https://www.thespruce.com/thmb/PPCuIoDml-auAiQzmAb9vWgly-I=/4000x0/filters:no_upscale():max_bytes(150000):strip_icc()/SPR-walk-in-shower-ideas-7108802-5f89528832234934a4b8387f08135ecd.jpg',
    keywords: ['bathroom', 'accessible bathroom', 'walk-in tub', 'roll-in shower', 'bath remodel'],
  },
  {
    name: 'Kitchen & Bath Remodeling',
    slug: 'kitchen-bath-remodeling',
    icon: ChefHat,
    imageUrl: 'https://images.pexels.com/photos/1838065/pexels-photo-1838065.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    keywords: ['kitchen', 'kitchen/bath', 'kitchen remodel'],
  },
  {
    name: 'General Contractors',
    slug: 'general-contractors',
    icon: Hammer,
    imageUrl: 'https://www.uacgeneralcontractors.com/assets/img/general-contractors.jpg',
    keywords: ['general contractor', 'remodeling contractor', 'renovation', 'home renovation'],
  },
  {
    name: 'Handyman Services',
    slug: 'handyman-services',
    icon: Wrench,
    imageUrl: 'https://images.pexels.com/photos/5691544/pexels-photo-5691544.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    keywords: ['handyman', 'small modifications', 'minor', 'fixes'],
  },
  {
    name: 'Aging in Place',
    slug: 'aging-in-place',
    icon: Heart,
    imageUrl: 'https://bethanyvillagehomehealthcare.org/wp-content/uploads/2025/10/10-Aging-in-Place-Home-Modifications-to-Make-Life-Easier-hero.jpg',
    keywords: ['aging-in-place', 'aging in place', 'ada', 'accessible remodeling', 'caps'],
  },
];

export function getCategoryForBusiness(categoryText: string): CategoryConfig {
  const lower = categoryText.toLowerCase();
  for (const cat of CATEGORIES) {
    for (const kw of cat.keywords) {
      if (lower.includes(kw)) return cat;
    }
  }
  // Default to general contractors
  return CATEGORIES[5];
}

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
