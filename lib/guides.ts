export interface GuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  relatedCategorySlug?: string;
  readTime: string;
  updated: string; // ISO date
  heroImage: string;
  intro: string;
  sections: GuideSection[];
  faqs: { q: string; a: string }[];
}

export const GUIDES: Guide[] = [
  {
    slug: 'wheelchair-accessible-bathroom-nc',
    title: 'How to Make a Bathroom Wheelchair Accessible in North Carolina',
    description:
      'A practical guide to accessible bathroom remodeling in the Piedmont Triad — roll-in showers, grab bars, comfort-height fixtures, clearances, and what it typically costs.',
    relatedCategorySlug: 'bathroom-remodeling',
    readTime: '7 min read',
    updated: '2026-01-15',
    heroImage:
      'https://www.thespruce.com/thmb/PPCuIoDml-auAiQzmAb9vWgly-I=/4000x0/filters:no_upscale():max_bytes(150000):strip_icc()/SPR-walk-in-shower-ideas-7108802-5f89528832234934a4b8387f08135ecd.jpg',
    intro:
      'The bathroom is one of the most common places for falls at home, and it is also the room that benefits most from thoughtful accessibility upgrades. Whether you use a wheelchair full time, are recovering from surgery, or are planning ahead so you can age in place, this guide walks through the elements of a wheelchair-accessible bathroom and what to expect when remodeling one in the Piedmont Triad.',
    sections: [
      {
        heading: 'Start with clearances and the doorway',
        paragraphs: [
          'A wheelchair needs room to enter, turn, and approach fixtures. Aim for a doorway with at least 32 inches of clear width, and ideally a 36-inch opening. Inside the room, plan for a 60-inch turning circle (or a T-shaped turning space) so a chair can rotate without backing in and out.',
          'Swapping a standard hinged door for a pocket door or an out-swinging door frees up floor space and makes the room safer to use.',
        ],
      },
      {
        heading: 'Choose a roll-in or curbless shower',
        paragraphs: [
          'A curbless, roll-in shower is the centerpiece of most accessible bathrooms. Eliminating the threshold lets a wheelchair or shower chair roll straight in, and a linear drain keeps water contained without a raised lip.',
          'Add a fold-down shower seat, a handheld shower wand on a slide bar, and lever or single-handle controls placed within easy reach from a seated position.',
        ],
        bullets: [
          'Curbless entry with a linear or trench drain',
          'Fold-down or bench seat rated for the user’s weight',
          'Handheld sprayer with a 60-inch hose',
          'Anti-scald, single-lever mixing valve',
        ],
      },
      {
        heading: 'Install grab bars in the right places',
        paragraphs: [
          'Grab bars must be anchored into blocking or studs — never into drywall alone. The most useful locations are beside and behind the toilet, and on the walls of the shower. Standard practice is to support at least 250 pounds of force.',
          'If you are remodeling down to the studs, ask your contractor to add plywood blocking across the walls so bars can be relocated later without opening up the wall again.',
        ],
      },
      {
        heading: 'Comfort-height toilet and roll-under sink',
        paragraphs: [
          'A comfort-height (ADA-height) toilet sits roughly 17–19 inches off the floor, which makes transfers from a wheelchair far easier. Leave clear floor space beside the toilet for a side or diagonal transfer.',
          'A wall-mounted or open-front vanity with a roll-under sink lets a wheelchair user pull up close. Insulate the drain and supply lines so there is no risk of burns against bare skin.',
        ],
      },
      {
        heading: 'What it typically costs',
        paragraphs: [
          'Accessible bathroom projects in the Triad range widely depending on scope. A modest update — grab bars, a comfort-height toilet, and a handheld sprayer — may run a few thousand dollars. A full curbless roll-in shower conversion with new fixtures, waterproofing, and finishes is a larger investment.',
          'Get itemized quotes from at least two or three contractors who specialize in accessibility, and ask to see photos of roll-in showers they have completed locally.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Does insurance or Medicaid pay for an accessible bathroom remodel in NC?',
        a: 'Standard homeowners insurance generally does not cover accessibility remodeling. Some people qualify for help through North Carolina Medicaid waiver programs, Veterans Affairs grants (such as the SAH/SHA grants), or local aging services. Eligibility varies, so check with the specific program before starting work.',
      },
      {
        q: 'How wide does a bathroom door need to be for a wheelchair?',
        a: 'A clear opening of at least 32 inches is the practical minimum, and 36 inches is more comfortable. Remember that the door hardware and the angle of approach reduce the usable width, so measure the clear opening, not the door slab.',
      },
      {
        q: 'Can any contractor build a roll-in shower?',
        a: 'A curbless shower requires careful floor framing and waterproofing to drain correctly without a curb. Choose a contractor with specific experience in accessible or barrier-free showers, and ask to see local examples.',
      },
    ],
  },
  {
    slug: 'aging-in-place-home-modifications',
    title: 'Aging-in-Place Home Modifications Explained',
    description:
      'A room-by-room look at the modifications that let older adults stay safely in their own homes — from no-step entries and stair lifts to lighting, flooring, and smart-home safety.',
    relatedCategorySlug: 'aging-in-place',
    readTime: '8 min read',
    updated: '2026-01-20',
    heroImage:
      'https://bethanyvillagehomehealthcare.org/wp-content/uploads/2025/10/10-Aging-in-Place-Home-Modifications-to-Make-Life-Easier-hero.jpg',
    intro:
      'Most people say they would prefer to remain in their own home as they get older rather than move to assisted living. “Aging in place” makes that possible by adapting the home to changing needs — improving safety, removing barriers, and reducing the everyday effort of getting around. Here is how to think about it, room by room.',
    sections: [
      {
        heading: 'Getting in and out: entries and thresholds',
        paragraphs: [
          'A safe, no-step entrance is the foundation of an accessible home. Options range from a permanent ramp or a gently regraded walkway to a modular aluminum ramp that can be installed quickly and removed later.',
          'Inside, reduce or bevel raised thresholds between rooms so they are not trip hazards, and make sure the primary entrance has good lighting and a level landing large enough to maneuver.',
        ],
      },
      {
        heading: 'Moving between floors',
        paragraphs: [
          'If the home has stairs, a stair lift is often the most cost-effective solution for someone who can transfer to a seat. For wheelchair users, a vertical platform lift or a through-floor home lift may be more appropriate.',
          'Where possible, arranging a full living setup on one floor — bedroom, full bath, kitchen, and laundry — can delay or avoid the need for a lift altogether.',
        ],
      },
      {
        heading: 'The bathroom',
        paragraphs: [
          'Bathrooms deserve priority because they combine water, hard surfaces, and transfers. Curbless showers, grab bars, comfort-height toilets, and slip-resistant flooring dramatically reduce fall risk. See our dedicated bathroom accessibility guide for the details.',
        ],
      },
      {
        heading: 'Kitchen and daily-living spaces',
        paragraphs: [
          'Small changes add up: pull-out shelves and drawers instead of deep cabinets, lever-style faucet and door handles, varied counter heights, and D-shaped cabinet pulls that are easy to grip with limited hand strength.',
          'Good task lighting under cabinets and over work areas helps compensate for changing vision.',
        ],
        bullets: [
          'Lever handles on doors and faucets',
          'Pull-out pantry and cabinet shelving',
          'Contrasting counter edges for low vision',
          'Rocker light switches at reachable heights',
        ],
      },
      {
        heading: 'Lighting, flooring, and safety tech',
        paragraphs: [
          'Increase overall light levels, add motion-activated night lighting along the path from bedroom to bathroom, and choose matte, slip-resistant flooring. Remove or secure loose rugs, which are a leading cause of falls.',
          'Smart-home devices — voice assistants, video doorbells, medical alert pendants, and automatic stove shut-offs — add a layer of security and help family members stay connected.',
        ],
      },
      {
        heading: 'Plan with a CAPS professional',
        paragraphs: [
          'A Certified Aging-in-Place Specialist (CAPS) is a contractor or designer trained specifically in these modifications. Several providers in the Piedmont Triad hold this certification and can assess a home and prioritize changes based on current and anticipated needs.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What is the first modification I should make?',
        a: 'For most homes, the highest-impact changes are a safe no-step entry and a fall-safe bathroom. Start there, then address stairs and lighting.',
      },
      {
        q: 'What does CAPS mean?',
        a: 'CAPS stands for Certified Aging-in-Place Specialist, a designation from the National Association of Home Builders for professionals trained in home modifications for older adults.',
      },
      {
        q: 'Are aging-in-place modifications tax deductible?',
        a: 'Some medically necessary home modifications may qualify as a medical expense deduction if they exceed IRS thresholds and do not add to the home’s value. Consult a tax professional about your situation.',
      },
    ],
  },
  {
    slug: 'choosing-a-stair-lift',
    title: 'Choosing a Stair Lift: A Homeowner’s Guide',
    description:
      'Straight vs. curved rails, weight capacity, power options, new vs. reconditioned, and installation — everything to weigh before buying a stair lift in the Piedmont Triad.',
    relatedCategorySlug: 'stair-platform-lifts',
    readTime: '6 min read',
    updated: '2026-01-25',
    heroImage:
      'https://home.mobilityworks.com/wp-content/uploads/2020/11/vertical-platform-lifts-bruno-residential-porch.jpg',
    intro:
      'A stair lift can be the difference between using your whole home and living on a single floor. They install on the stair treads (not the wall), work on most staircases, and can usually be fitted within a day or two. Here is what to consider before you buy.',
    sections: [
      {
        heading: 'Straight vs. curved staircases',
        paragraphs: [
          'A straight staircase with no turns or landings uses a straight rail, which is the most affordable option and is often available quickly, sometimes as a reconditioned unit.',
          'A staircase with bends, landings, or a spiral needs a curved rail that is custom-manufactured to your exact stairs. Curved rails cost more and take longer to produce, so plan for a lead time.',
        ],
      },
      {
        heading: 'Weight capacity and seat options',
        paragraphs: [
          'Standard stair lifts support around 300 pounds; heavy-duty (bariatric) models support 400 pounds or more with a wider seat. Consider the user’s weight plus a margin, and look at seat width, swivel, and footrest features for comfortable, safe transfers at the top and bottom.',
        ],
      },
      {
        heading: 'Power: battery vs. AC',
        paragraphs: [
          'Most modern lifts are battery-powered and recharge at charge points along the rail. That means they keep working during a power outage — an important safety feature — and run quietly and smoothly.',
        ],
      },
      {
        heading: 'New vs. reconditioned, buy vs. rent',
        paragraphs: [
          'Reconditioned straight lifts can save money and are a good fit for short- or medium-term needs. Some Triad providers also rent lifts by the month, which makes sense for a temporary situation such as recovery from surgery.',
          'Curved lifts are almost always purchased new because the rail is custom to your stairs.',
        ],
        bullets: [
          'New straight lift — lowest long-term cost if used for years',
          'Reconditioned straight lift — budget-friendly, faster availability',
          'Rental — best for temporary needs',
          'Curved lift — custom rail, buy new',
        ],
      },
      {
        heading: 'Installation and service',
        paragraphs: [
          'A reputable installer will measure your stairs, confirm the rail does not obstruct the walkway more than necessary, and handle the fitting. Ask about the warranty, the availability of local service technicians, and response times for repairs — a lift is only useful if it can be serviced quickly.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do stair lifts damage my staircase?',
        a: 'No. The rail mounts to the stair treads, not the wall, using a small number of fixings. When removed, only minor holes remain in the treads.',
      },
      {
        q: 'How long does installation take?',
        a: 'A straight stair lift can often be installed in a few hours. A curved lift takes longer to manufacture but the on-site installation is still usually completed in a day.',
      },
      {
        q: 'Will it work during a power outage?',
        a: 'Yes. Battery-powered stair lifts continue to operate on their charged batteries during an outage, then recharge when power returns.',
      },
    ],
  },
  {
    slug: 'wheelchair-ramps-costs-codes-nc',
    title: 'Wheelchair Ramps in NC: Costs, Codes & Options',
    description:
      'Ramp slope rules, materials (aluminum, wood, concrete), permanent vs. modular options, and how to choose the right wheelchair ramp for a home in the Piedmont Triad.',
    relatedCategorySlug: 'home-modifications',
    readTime: '6 min read',
    updated: '2026-01-28',
    heroImage: 'https://www.homesafety.net/wp-content/uploads/2018/12/ramp-rental.jpg',
    intro:
      'A wheelchair ramp restores independent access to the home — but a ramp that is too steep or too short can be unsafe. This guide covers the slope math, the material choices, and the trade-offs between permanent and modular ramps so you can plan the right solution.',
    sections: [
      {
        heading: 'Get the slope right',
        paragraphs: [
          'The widely used ADA guideline is a maximum slope of 1:12 — one inch of ramp rise for every twelve inches of ramp length. So a porch 24 inches high needs about 24 feet of ramp. A gentler slope is easier and safer, especially for someone self-propelling a manual wheelchair.',
          'Ramps also need level landings at the top and bottom, and at any turn or direction change, so the user can rest and maneuver safely.',
        ],
      },
      {
        heading: 'Compare materials',
        paragraphs: [
          'Aluminum modular ramps are lightweight, slip-resistant, need no concrete footings, and can be reconfigured or removed later. Wood ramps blend into a home’s look and can be cost-effective but need periodic maintenance and a slip-resistant surface. Concrete ramps are the most permanent and durable but are the most expensive and the least flexible.',
        ],
        bullets: [
          'Aluminum — fast install, reusable, low maintenance',
          'Wood — attractive, moderate cost, needs upkeep',
          'Concrete — most durable and permanent, highest cost',
        ],
      },
      {
        heading: 'Permanent vs. modular (and renting)',
        paragraphs: [
          'If the need is long-term, a permanent wood or concrete ramp may be worthwhile. If the need is temporary — a recovery period, or a rental home — a modular aluminum ramp that can be rented or relocated is usually the smarter choice. Several Triad providers rent modular ramps by the month.',
        ],
      },
      {
        heading: 'Permits and codes',
        paragraphs: [
          'Requirements vary by municipality in the Triad. A permanent structural ramp often requires a permit and must meet the North Carolina building code for slope, width, landings, and handrails. A temporary modular ramp usually has lighter requirements. Your contractor should confirm local rules before building.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How long does a ramp need to be?',
        a: 'Using the 1:12 rule, you need roughly one foot of ramp for every inch of vertical rise. Measure the total height from the ground to the door threshold, then multiply by 12 to estimate the ramp length before landings.',
      },
      {
        q: 'Do I need a permit for a wheelchair ramp in North Carolina?',
        a: 'A permanent ramp typically requires a building permit and must meet code; a temporary modular ramp often does not. Rules vary by city and county, so confirm with your local building department or ask your installer.',
      },
      {
        q: 'Can I rent a wheelchair ramp?',
        a: 'Yes. Modular aluminum ramps are commonly rented monthly, which is ideal for temporary needs such as recovery from surgery or a short-term rehabilitation period.',
      },
    ],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
