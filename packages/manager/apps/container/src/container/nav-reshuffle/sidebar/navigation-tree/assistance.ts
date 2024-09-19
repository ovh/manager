import { Node } from "./node";
import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';

export const assistanceTree: Node = {
  id: 'assistance',
  translation: 'sidebar_assistance_title',
  children: [
    {
      id: 'marketplace',
      translation: 'sidebar_marketplace',
      url: 'marketplace',
      count: false,
      isExternal: true,
      region: ['EU'],
    },
    {
      id: 'help',
      translation: 'sidebar_assistance_help_center',
      url: 'help',
      count: false,
      isExternal: true,
    },
    {
      id: 'tickets',
      translation: 'sidebar_assistance_tickets',
      isExternal: true,
      url: 'support',
      count: false,
      svgIcon: OvhProductName.EMAIL
    },
    {
      id: 'assistance_status',
      translation: 'sidebar_assistance_status',
      url: 'status',
      count: false,
      isExternal: true,
    },
    {
      id: 'livechat',
      features: ['livechat'],
      translation: 'sidebar_assistance_live_chat',
      count: false,
    },
    {
      id: 'carbon_calculator',
      features: ['carbon-calculator'],
      translation: 'sidebar_assistance_carbon_calculator',
      count: false,
      routing: {
        application: 'carbon-calculator',
        hash: '#',
      },
    }
  ]
}