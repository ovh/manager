import { Node } from '@/types/node';

export const assistanceTree: Node = {
  id: 'assistance',
  translation: 'sidebar_assistance_title',
  children: [
    {
      id: 'roadmap_changelog',
      translation: 'sidebar_roadmap_changelog',
      routing: {
        application: 'hub',
        hash: '#/roadmap-changelog',
      },
    },
    {
      id: 'assistance_status',
      translation: 'sidebar_assistance_status',
      url: 'status',
      hasService: false,
      isExternal: true,
    },
    {
      id: 'carbon_calculator',
      features: ['carbon-calculator'],
      translation: 'sidebar_assistance_carbon_calculator',
      hasService: false,
      routing: {
        application: 'carbon-calculator',
        hash: '#',
      },
    },
  ],
};
