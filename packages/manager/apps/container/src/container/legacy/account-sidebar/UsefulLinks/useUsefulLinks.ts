import { Environment } from '@ovh-ux/manager-config';
import constants from './constants';
import { UsefulLink } from './Link/usefulLink';

import { useShell } from '@/context/useApplicationContext';
import useContainer from '@/core/container';
import { ODS_ICON_NAME} from '@ovhcloud/ods-components'


import getOdsIcon from '../getOdsIcon';

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

  const getUsefulLinks = (): UsefulLink[] => {
    const trackingPrefix = 'hub::sidebar::useful-links';
    return [
      {
        id: 'helpCenter',
        external: true,
        href: constants[region]?.help[user.ovhSubsidiary],
        tracking: `${trackingPrefix}::go-to-helpcenter`,
        icon: getOdsIcon(ODS_ICON_NAME.LIFEBUOY_CONCEPT),      },
      ...(isLivechatEnabled
        ? [
            {
              id: 'chatbot',
              action: () => {
                shell.getPlugin('ux').openLiveChat();
                setChatbotReduced(false);
              },
              icon: getOdsIcon(ODS_ICON_NAME.SPEECH_BUBBLE_CONCEPT),
            },
          ]
        : []),
      {
        id: 'tasks',
        external: true,
        href: constants[region]?.tasks,
        tracking: `${trackingPrefix}::go-to-ovh-status`,
        icon: getOdsIcon(ODS_ICON_NAME.TRAFFIC_CONE_CONCEPT),
      },
      {
        id: 'tickets',
        href: navigation.getURL('dedicated', '#/ticket'),
        tracking: `${trackingPrefix}::go-to-tickets`,
        icon: getOdsIcon(ODS_ICON_NAME.ENVELOP_CONCEPT),
      },
      ...(['EU', 'CA'].includes(region)
        ? [
            {
              id: 'createTicket',
              href: navigation.getURL('dedicated', '#/support/tickets/new'),
              tracking: `${trackingPrefix}::go-to-create-ticket`,
              icon: getOdsIcon(ODS_ICON_NAME.USER_SUPPORT_CONCEPT),
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
