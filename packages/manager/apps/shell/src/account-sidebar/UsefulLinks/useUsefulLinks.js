import { buildURL } from '@ovh-ux/ufrontend/url-builder';

import constants from './constants';

const useUsefulLinks = (environment) => {
  const region = environment.getRegion();
  const user = environment.getUser();

  const hasChatbot = true;

  const getUsefulLinks = () => {
    const trackingPrefix = 'hub::sidebar::useful-links';
    return [
      {
        id: 'helpCenter',
        href: constants[region]?.help[user.ovhSubsidiary],
        tracking: `${trackingPrefix}::go-to-helpcenter`,
        icon: 'oui-icon oui-icon-lifebuoy_concept',
      },
      ...(hasChatbot
        ? [
            {
              id: 'chatbot',
              action: () => {
                // this.openChatbot();
              },
              icon: 'oui-icon oui-icon-speech-bubble_concept',
            },
          ]
        : []),
      {
        id: 'tasks',
        href: constants[region]?.tasks,
        tracking: `${trackingPrefix}::go-to-ovh-status`,
        icon: 'oui-icon oui-icon-traffic-cone_concept',
      },
      {
        id: 'tickets',
        href: buildURL('dedicated', '#/ticket'),
        tracking: `${trackingPrefix}::go-to-tickets`,
        icon: 'oui-icon oui-icon-envelop_concept',
      },
      ...(['EU', 'CA'].includes(region)
        ? [
            {
              id: 'createTicket',
              href: buildURL('dedicated', '#/support/tickets/new'),
              tracking: `${trackingPrefix}::go-to-create-ticket`,
              icon: 'oui-icon oui-icon-user-support_concept',
            },
          ]
        : []),
    ];
  };

  return {
    getUsefulLinks,
  };
};

export default useUsefulLinks;
