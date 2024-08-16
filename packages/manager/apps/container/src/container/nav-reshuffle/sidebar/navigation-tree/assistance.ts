import { Node } from "./node";
import StoreIcon from "./services/icons/StoreIcon";
import HelpCenterIcon from "./services/icons/HelpCenterIcon";
import NetworkStatusIcon from "./services/icons/NetworkStatusIcon";
import LiveChatIcon from "./services/icons/LiveChatIcon";
import LeafIcon from "./services/icons/LeafIcon";

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
      iconNode: StoreIcon
    },
    {
      id: 'help',
      translation: 'sidebar_assistance_help_center',
      url: 'help',
      count: false,
      isExternal: true,
      iconNode: HelpCenterIcon
    },
    {
      id: 'assistance_status',
      translation: 'sidebar_assistance_status',
      url: 'status',
      count: false,
      isExternal: true,
      iconNode: NetworkStatusIcon
    },
    {
      id: 'livechat',
      features: ['livechat'],
      translation: 'sidebar_assistance_live_chat',
      count: false,
      iconNode: LiveChatIcon,
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
      iconNode: LeafIcon,
    }
  ]
}