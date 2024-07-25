import { ODS_ICON_NAME } from "@ovhcloud/ods-components";
import { Node } from "./node";

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
      icon: ODS_ICON_NAME.HOME,
    },
    {
      id: 'help',
      translation: 'sidebar_assistance_help_center',
      url: 'help',
      count: false,
      isExternal: true,
      icon: ODS_ICON_NAME.HELP_CIRCLE,
    },
    {
      id: 'assistance_status',
      translation: 'sidebar_assistance_status',
      url: 'status',
      count: false,
      isExternal: true,
      icon: ODS_ICON_NAME.WARNING,
    },
    {
      id: 'livechat',
      features: ['livechat'],
      translation: 'sidebar_assistance_live_chat',
      count: false,
      icon: ODS_ICON_NAME.CHAT,
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
      icon: ODS_ICON_NAME.LEAF_CONCEPT,
    }
  ]
}