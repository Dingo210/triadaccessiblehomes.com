import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface BusinessSeed {
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  phone: string;
  website: string;
  photoUrl: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function mapCategorySlug(category: string): string {
  const lower = category.toLowerCase();
  if (lower.includes('home modifications') || lower.includes('medical equipment')) return 'home-modifications';
  if (lower.includes('mobility') && lower.includes('accessibility') && !lower.includes('aging')) return 'mobility-accessibility';
  if (lower.includes('stair lift') || lower.includes('stairlift') || lower.includes('platform lift') || lower.includes('wheelchair') && lower.includes('lift')) return 'stair-platform-lifts';
  if (lower.includes('accessible bathroom') || (lower.includes('bathroom') && lower.includes('accessibility'))) return 'bathroom-remodeling';
  if (lower.includes('kitchen')) return 'kitchen-bath-remodeling';
  if (lower.includes('general contractor') || lower.includes('remodeling contractor') || lower.includes('home renovation') || lower.includes('home renovation')) return 'general-contractors';
  if (lower.includes('handyman')) return 'handyman-services';
  if (lower.includes('aging') || lower.includes('ada') || lower.includes('accessible remodeling')) return 'aging-in-place';
  return 'general-contractors';
}

const categoryImages: Record<string, string> = {
  'home-modifications': 'https://www.homesafety.net/wp-content/uploads/2018/12/ramp-rental.jpg',
  'mobility-accessibility': 'https://i.ytimg.com/vi/wrsq2pCU-Zw/maxresdefault.jpg',
  'stair-platform-lifts': 'https://home.mobilityworks.com/wp-content/uploads/2020/11/vertical-platform-lifts-bruno-residential-porch.jpg',
  'bathroom-remodeling': 'https://www.thespruce.com/thmb/PPCuIoDml-auAiQzmAb9vWgly-I=/4000x0/filters:no_upscale():max_bytes(150000):strip_icc()/SPR-walk-in-shower-ideas-7108802-5f89528832234934a4b8387f08135ecd.jpg',
  'kitchen-bath-remodeling': 'https://images.pexels.com/photos/1838065/pexels-photo-1838065.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
  'general-contractors': 'https://www.uacgeneralcontractors.com/assets/img/general-contractors.jpg',
  'handyman-services': 'https://images.pexels.com/photos/5691544/pexels-photo-5691544.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
  'aging-in-place': 'https://bethanyvillagehomehealthcare.org/wp-content/uploads/2025/10/10-Aging-in-Place-Home-Modifications-to-Make-Life-Easier-hero.jpg',
};

const businesses: BusinessSeed[] = [
  {
    name: 'MedSource Inc.',
    category: 'Home modifications / medical equipment',
    categorySlug: 'home-modifications',
    description: 'Lexington-based firm installing ramps, grab bars, walk-in tubs, and stair/platform lifts across the Triad.',
    phone: '(336) 242-1119',
    website: 'https://medsourceinc.org/home-modification-services/',
    photoUrl: categoryImages['home-modifications'],
  },
  {
    name: 'EZ Mobility Solutions',
    category: 'Mobility & accessibility products',
    categorySlug: 'mobility-accessibility',
    description: 'Stairlifts, ramps, platform lifts, and TubcuT tub-to-shower conversions with in-home consultations.',
    phone: '(540) 912-0259',
    website: 'https://ezmobilitysolutions.com/coverage-areas/north-carolina/winston-salem/',
    photoUrl: categoryImages['mobility-accessibility'],
  },
  {
    name: 'Lifeway Mobility (Charlotte/W-S)',
    category: 'Stair lifts & wheelchair ramps',
    categorySlug: 'stair-platform-lifts',
    description: 'Sells, rents, and services stair lifts, ramps, and transfer aids with free in-home assessments.',
    phone: '(704) 266-1599',
    website: 'https://www.lifewaymobility.com/charlotte-nc/cs-stair-lifts-winston-salem/',
    photoUrl: categoryImages['stair-platform-lifts'],
  },
  {
    name: 'Safe Living Solutions, LLC',
    category: 'Accessible remodeling & lifts',
    categorySlug: 'aging-in-place',
    description: 'High Point contractor doing accessible bathroom/kitchen remodels plus lift and ramp installation.',
    phone: '(336) 781-3303',
    website: 'https://www.safelivingsolutionsllc.com/service-area/north-carolina/piedmont-triad-nc/',
    photoUrl: categoryImages['aging-in-place'],
  },
  {
    name: 'Access, Mobility, Repair & Rental',
    category: 'Aging-in-place consulting & mobility',
    categorySlug: 'aging-in-place',
    description: 'Veteran-owned CAPS provider selling/installing ramps, lifts, and scooters plus in-home evaluations.',
    phone: '(336) 608-8810',
    website: 'https://www.greenhavenrealty.com/blog/aging-in-place-home-modifications/',
    photoUrl: categoryImages['aging-in-place'],
  },
  {
    name: 'Gen-Con Group',
    category: 'ADA / aging-in-place remodeling',
    categorySlug: 'aging-in-place',
    description: 'Residential remodeler specializing in wheelchair lifts, stairlifts, and zero-entry showers.',
    phone: '(336) 542-5201',
    website: 'https://builtbygencongroup.com/handicap-remodeling-ada-aging-in-place/',
    photoUrl: categoryImages['aging-in-place'],
  },
  {
    name: 'Re-Bath Greensboro',
    category: 'Accessible bathroom remodeling',
    categorySlug: 'bathroom-remodeling',
    description: 'Accessible bathroom remodels with walk-in tubs, roll-in showers, grab bars, and slip-resistant floors.',
    phone: '(336) 542-5201',
    website: 'https://www.rebath.com/location/greensboro/',
    photoUrl: categoryImages['bathroom-remodeling'],
  },
  {
    name: 'West Shore Home (Winston-Salem)',
    category: 'Bathroom remodeling / accessibility',
    categorySlug: 'bathroom-remodeling',
    description: 'Tub-to-shower conversions and aging-in-place bath modifications, typically completed in days.',
    phone: '(717) 697-4033',
    website: 'https://westshorehome.com/locations/winston-salem-nc/',
    photoUrl: categoryImages['bathroom-remodeling'],
  },
  {
    name: 'HousePro Home Improvement',
    category: 'Remodeling & handyman',
    categorySlug: 'handyman-services',
    description: 'Bath/kitchen remodeler offering aging-in-place and handicap-accessible bathroom solutions across the Triad.',
    phone: '',
    website: 'https://houseprohomeimprovement.com/',
    photoUrl: categoryImages['handyman-services'],
  },
  {
    name: 'Accent Renovations',
    category: 'Remodeling contractor',
    categorySlug: 'general-contractors',
    description: 'Winston-Salem bathroom and home remodeler serving Kernersville and Clemmons.',
    phone: '(336) 996-8453',
    website: 'https://accentnc.com/',
    photoUrl: categoryImages['general-contractors'],
  },
  {
    name: 'Universal Accessibility',
    category: 'Wheelchair & stair lifts',
    categorySlug: 'stair-platform-lifts',
    description: 'Supplier of stair lifts, vertical wheelchair lifts, ramps, and vehicle lifts serving Winston-Salem.',
    phone: '(800) 470-8940',
    website: 'https://www.universal-accessibility.com/wheelchair-lifts-winston-salem-nc.htm',
    photoUrl: categoryImages['stair-platform-lifts'],
  },
  {
    name: 'Local Stairlift Wizards (Winston-Salem)',
    category: 'Stairlift sales & installation',
    categorySlug: 'stair-platform-lifts',
    description: 'Local stairlift sales, installation, rentals, and reconditioned unit options.',
    phone: '(833) 449-0024',
    website: 'https://localstairliftwizards.com/nc/stairlift-sales-installation-winston-salem/',
    photoUrl: categoryImages['stair-platform-lifts'],
  },
  {
    name: 'The Kitchen Center of Winston-Salem, Inc.',
    category: 'Kitchen/bath remodeling',
    categorySlug: 'kitchen-bath-remodeling',
    description: 'A+ BBB-rated remodeler handling accessible kitchen and bathroom renovations.',
    phone: '(336) 725-2343',
    website: 'https://www.bbb.org/us/nc/winston-salem/category/remodel-contractors',
    photoUrl: categoryImages['kitchen-bath-remodeling'],
  },
  {
    name: 'A-1 Renovation, Inc.',
    category: 'General contractor / bath remodel',
    categorySlug: 'general-contractors',
    description: 'Forsyth/Guilford general contractor doing bathroom remodels and accessibility upgrades.',
    phone: '(336) 893-5901',
    website: 'https://www.bbb.org/us/nc/winston-salem/category/remodel-contractors',
    photoUrl: categoryImages['general-contractors'],
  },
  {
    name: 'Handyman Mark, Inc.',
    category: 'Handyman / small modifications',
    categorySlug: 'handyman-services',
    description: 'Handyman service for grab bars, ramps, and minor accessibility fixes across the Triad.',
    phone: '(336) 486-4978',
    website: 'https://www.bbb.org/us/nc/winston-salem/category/remodel-contractors',
    photoUrl: categoryImages['handyman-services'],
  },
  {
    name: 'Ward Construction & Remodeling of NC, Inc.',
    category: 'General contractor / bath remodel',
    categorySlug: 'general-contractors',
    description: 'Kernersville general contractor offering bathroom remodels and accessible modifications.',
    phone: '(336) 833-9273',
    website: 'https://www.bbb.org/us/nc/winston-salem/category/remodel-contractors',
    photoUrl: categoryImages['general-contractors'],
  },
  {
    name: 'Thomas General Contractors, LLC',
    category: 'General contractor / bath remodel',
    categorySlug: 'general-contractors',
    description: 'Clemmons-based contractor serving Greensboro, High Point, and Winston-Salem for bath remodels.',
    phone: '(336) 778-2171',
    website: 'https://www.bbb.org/us/nc/winston-salem/category/remodel-contractors',
    photoUrl: categoryImages['general-contractors'],
  },
  {
    name: 'Kiger Custom Creations, LLC',
    category: 'Home renovation / remodeling',
    categorySlug: 'general-contractors',
    description: 'Kernersville renovation firm covering Forsyth, Guilford, Davidson, and Yadkin counties.',
    phone: '(336) 978-6680',
    website: 'https://www.bbb.org/us/nc/winston-salem/category/remodel-contractors',
    photoUrl: categoryImages['general-contractors'],
  },
  {
    name: 'Stairlifts Plus North Carolina (W-S)',
    category: 'Stairlift supply & installation',
    categorySlug: 'stair-platform-lifts',
    description: 'Supplies and fits straight/curved stairlifts, including reconditioned and rental units.',
    phone: '(888) 541-0966',
    website: 'https://northcarolina.stairliftsplus.net/stair-lifts-winston-salem-nc/',
    photoUrl: categoryImages['stair-platform-lifts'],
  },
  {
    name: 'StairLifter USA (Winston-Salem)',
    category: 'Stair & platform lifts',
    categorySlug: 'stair-platform-lifts',
    description: 'Installs seated, platform, and wheelchair lifts with grant/financing assistance for Forsyth County.',
    phone: '(800) 515-5170',
    website: 'https://stairlifter-usa.com/winston-salem/',
    photoUrl: categoryImages['stair-platform-lifts'],
  },
];

async function main() {
  console.log('Seeding database...');

  for (const biz of businesses) {
    await prisma.business.upsert({
      where: { id: slugify(biz.name) },
      update: {
        name: biz.name,
        category: biz.category,
        categorySlug: biz.categorySlug,
        description: biz.description,
        phone: biz.phone,
        website: biz.website,
        photoUrl: biz.photoUrl,
      },
      create: {
        id: slugify(biz.name),
        name: biz.name,
        category: biz.category,
        categorySlug: biz.categorySlug,
        description: biz.description,
        phone: biz.phone,
        website: biz.website,
        photoUrl: biz.photoUrl,
      },
    });
    console.log(`  ✓ ${biz.name}`);
  }

  console.log(`\nSeeded ${businesses.length} businesses.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


