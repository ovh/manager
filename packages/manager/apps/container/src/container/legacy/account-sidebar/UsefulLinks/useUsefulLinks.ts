import { Environment } from '@ovh-ux/manager-config';
import constants from './constants';
import { UsefulLink } from './Link/usefulLink';

import { useShell } from '@/context/useApplicationContext';
import useContainer from '@/core/container';
import { useHeader } from '@/context/header';

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
  const {
    isChatbotEnabled,
    isLivechatEnabled,
    setChatbotReduced,
  } = useContainer();
  const { setIsAccountSidebarVisible } = useHeader();

  const getUsefulLinks = (): UsefulLink[] => {
    const trackingPrefix = 'hub::sidebar::useful-links';
    const uxPlugin = shell.getPlugin('ux');
    return [
      {
        id: 'helpCenter',
        href: constants[region]?.help[user.ovhSubsidiary],
        tracking: `${trackingPrefix}::go-to-helpcenter`,
        icon: 'oui-icon oui-icon-lifebuoy_concept',
      },
      ...(isChatbotEnabled || isLivechatEnabled
        ? [
            {
              id: 'chatbot',
              action: () => {
                if (isChatbotEnabled) shell.getPlugin('ux').openChatbot();
                else {
                  shell.getPlugin('ux').openLiveChat();
                  setChatbotReduced(false);
                }
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
        href: navigation.getURL('dedicated', '#/ticket'),
        tracking: `${trackingPrefix}::go-to-tickets`,
        icon: 'oui-icon oui-icon-envelop_concept',
      },
      ...(['EU', 'CA'].includes(region)
        ? [
            {
              id: 'createTicket',
              href: navigation.getURL('dedicated', '#/support/tickets/new'),
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
