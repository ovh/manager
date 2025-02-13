import { Node } from "./node";

export const assistanceTree: Node = {
  id: 'assistance',
  translation: 'sidebar_assistance_title',
  children: [
    {
      id: 'cloud_changelog',
      translation: 'sidebar_cloud_changelog',
      url: 'cloud_changelog',
      hasService: false,
      isExternal: true,
    },
    {
      id: 'hosting_and_collab_changelog',
      translation: 'sidebar_hosting_and_collab_changelog',
      url: 'hosting_and_collab_changelog',
      hasService: false,
      isExternal: true,
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
      id: 'assistance_status',
      translation: 'sidebar_assistance_status',
      url: 'status',
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
    }
  ]
}
