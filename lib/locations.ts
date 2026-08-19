export interface LocationInfo {
  slug: string;
  city: string;
  county: string;
  blurb: string;
  intro: string;
  body: string[];
  neighborhoods: string[];
  heroImage: string;
}

export const LOCATIONS: LocationInfo[] = [
  {
    slug: 'greensboro',
    city: 'Greensboro',
    county: 'Guilford County',
    blurb:
      'Accessible home service providers serving Greensboro and Guilford County — ramps, stair lifts, and accessible remodeling.',
    intro:
      'Greensboro is the largest city in the Piedmont Triad, and its mix of established neighborhoods and older housing stock means accessibility upgrades are in steady demand. The providers below serve Greensboro and the surrounding Guilford County area.',
    body: [
      'Whether you need a wheelchair ramp installed at a ranch home in Lindley Park, a roll-in shower for a two-story house in Irving Park, or a stair lift in an older home near downtown, the directory connects you with local specialists who work throughout Greensboro.',
      'Many providers listed here also serve nearby High Point and the wider Guilford County area, and several hold accessibility certifications such as CAPS (Certified Aging-in-Place Specialist).',
    ],
    neighborhoods: ['Downtown Greensboro', 'Irving Park', 'Lindley Park', 'Sunset Hills', 'Fisher Park', 'Adams Farm'],
    heroImage:
      'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
  },
  {
    slug: 'winston-salem',
    city: 'Winston-Salem',
    county: 'Forsyth County',
    blurb:
      'Accessible home service providers serving Winston-Salem and Forsyth County — mobility, bathroom remodeling, and aging-in-place experts.',
    intro:
      'Winston-Salem anchors the western Triad and is home to a large share of the region’s accessibility and mobility specialists. Several providers in this directory are based directly in Winston-Salem and serve the whole of Forsyth County.',
    body: [
      'From stair lifts and vertical platform lifts to accessible bathroom and kitchen remodeling, Winston-Salem has a deep pool of experienced providers. The city’s strong healthcare sector also means many companies here are familiar with working alongside occupational and physical therapists on discharge planning.',
      'The providers below serve Winston-Salem neighborhoods and the surrounding Forsyth County communities, and many also cover nearby Kernersville, Clemmons, and Lewisville.',
    ],
    neighborhoods: ['Downtown Winston-Salem', 'Ardmore', 'Buena Vista', 'West End', 'Washington Park', 'Clemmons'],
    heroImage:
      'https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
  },
  {
    slug: 'high-point',
    city: 'High Point',
    county: 'Guilford County',
    blurb:
      'Accessible home service providers serving High Point and the surrounding Triad — ramps, lifts, and accessible home modifications.',
    intro:
      'High Point sits at the heart of the Piedmont Triad between Greensboro and Winston-Salem. Its central location means most providers in this directory readily serve High Point homeowners in addition to the two larger cities.',
    body: [
      'Homeowners in High Point can access the full range of accessibility services — wheelchair ramps, stair and platform lifts, roll-in showers, and complete aging-in-place remodeling — from the specialists listed below.',
      'Because High Point is centrally located within the Triad, response times are typically quick and many providers cover it as part of their standard service area alongside Greensboro and Jamestown.',
    ],
    neighborhoods: ['Uptown High Point', 'Emerywood', 'Jamestown', 'Deep River', 'Oakview'],
    heroImage:
      'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
  },
];

export function getLocationBySlug(slug: string): LocationInfo | undefined {
  return LOCATIONS.find((l) => l.slug === slug);
}
