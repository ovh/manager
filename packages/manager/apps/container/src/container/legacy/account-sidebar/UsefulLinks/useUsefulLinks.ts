import { Environment } from '@ovh-ux/manager-config';
import constants from './constants';
import { UsefulLink } from './Link/usefulLink';

import { useShell } from '@/context/useApplicationContext';
import useContainer from '@/core/container';

interface UseUsefulLinks {
  getUsefulLinks(): UsefulLink[];
}

const useUsefulLinks = (): UseUsefulLinks => {
  const shell = useShell();
  const navigation = shell.getPlugin('navigation');
  const environment: Environment = shell
    .getPlugin('environment')
    .getEnvironment();
  const region = environment.getRegion();
  const user = environment.getUser();
  const { isLivechatEnabled, setChatbotReduced } = useContainer();

  const isEUOrCA = ['EU', 'CA'].includes(region);

  const getUsefulLinks = (): UsefulLink[] => {
    const trackingPrefix = 'hub::sidebar::useful-links';
    return [
      {
        id: 'helpCenter',
        external: true,
        href: constants[region]?.help[user.ovhSubsidiary],
        tracking: `${trackingPrefix}::go-to-helpcenter`,
        icon: 'oui-icon oui-icon-lifebuoy_concept',
      },
      ...(isLivechatEnabled
        ? [
          {
            id: 'chatbot',
            action: () => {
              shell.getPlugin('ux').openLiveChat();
              setChatbotReduced(false);
            },
            icon: 'oui-icon oui-icon-speech-bubble_concept',
          },
        ]
        : []),
      {
        id: 'tasks',
        external: true,
        href: constants[region]?.tasks,
        tracking: `${trackingPrefix}::go-to-ovh-status`,
        icon: 'oui-icon oui-icon-traffic-cone_concept',
      },
      {
        id: 'tickets',
        external: isEUOrCA,
        href: isEUOrCA ? constants[region].support.tickets : navigation.getURL('dedicated', '#/ticket'),
        tracking: `${trackingPrefix}::go-to-tickets`,
        icon: 'oui-icon oui-icon-envelop_concept',
      },
      ...(isEUOrCA
        ? [
          {
            id: 'createTicket',
            external: true,
            href: constants[region].support.createTicket,
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
