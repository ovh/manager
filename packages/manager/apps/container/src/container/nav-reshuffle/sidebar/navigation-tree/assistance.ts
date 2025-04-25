import { Node } from './node';

export const assistanceTree: Node = {
  id: 'assistance',
  translation: 'sidebar_assistance_title',
  children: [
    {
      id: 'help',
      translation: 'sidebar_assistance_help_center',
      url: 'help',
      hasService: false,
      isExternal: true,
    },
    {
      id: 'tickets',
      translation: 'sidebar_assistance_tickets',
      isExternal: true,
      url: 'support',
      hasService: false,
    },
    {
      id: 'roadmap_changelog',
      translation: 'sidebar_roadmap_changelog',
      routing: {
        application: 'hub',
        hash: '#/roadmap-changelog',
      },
    },
    {
      id: 'marketplace',
      translation: 'sidebar_marketplace',
      url: 'marketplace',
      hasService: false,
      isExternal: true,
      region: ['EU'],
    },
    {
      id: 'assistance_status',
      translation: 'sidebar_assistance_status',
      url: 'status',
      hasService: false,
      isExternal: true,
    },
    {
      id: 'create_ticket',
      translation: 'sidebar_create_ticket',
      url: 'createTicket',
      hasService: false,
      isExternal: true,
    },
    {
      id: 'livechat',
      features: ['livechat'],
      translation: 'sidebar_assistance_live_chat',
      hasService: false,
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
