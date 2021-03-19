import { buildURL } from '@ovh-ux/ufrontend/url-builder';
import { Environment } from '@ovh-ux/manager-config';

const links = (user) => [
  {
    href: this?.RedirectionService?.getURL('help', {
      ovhSubsidiary: user?.ovhSubsidiary,
    }),
    icon: 'oui-icon oui-icon-lifebuoy_concept',
    label: 'hub_links_help_center',
  },
  ...(this?.hasChatbot
    ? [
        {
          action: () => {
            // TODO : create chatbot function
            return null;
          },
          icon: 'oui-icon oui-icon-speech-bubble_concept',
          label: 'hub_links_chatbot',
        },
      ]
    : []),
  {
    href: this?.RedirectionService?.getURL('tasks'),
    icon: 'oui-icon oui-icon-traffic-cone_concept',
    label: 'hub_links_tasks',
  },
  {
    href: buildURL('dedicated', '#/ticket'),
    icon: 'oui-icon oui-icon-envelop_concept',
    label: 'hub_links_tickets',
  },
  ...(['EU', 'CA'].includes(Environment.getRegion())
    ? [
        {
          href: buildURL('dedicated', '#/support/tickets/new'),
          icon: 'oui-icon oui-icon-user-support_concept',
          label: 'hub_links_create_ticket',
        },
      ]
    : []),
];

export default links;
