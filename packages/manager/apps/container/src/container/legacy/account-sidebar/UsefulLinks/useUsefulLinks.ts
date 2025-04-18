import { Environment } from '@ovh-ux/manager-config';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import OvhProductName from '@ovh-ux/ovh-product-icons/utils/OvhProductNameEnum';
import constants from './constants';
import { UsefulLink } from './Link/usefulLink';

import { useShell } from '@/context/useApplicationContext';
import useContainer from '@/core/container';

import getOdsIcon from '../getOdsIcon';
import { getSvgIcon } from '../getSvgIcon';

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
        id: 'roadmap_changelog',
        external: true,
        href: navigation.getURL('hub', '#/roadmap-changelog'),
        tracking: `${trackingPrefix}::go-to-cloud-changelog`,
        icon: getSvgIcon(OvhProductName.CLOUD_CHANGELOG),
      },
      {
        id: 'helpCenter',
        external: true,
        href: constants[region]?.help[user.ovhSubsidiary],
        tracking: `${trackingPrefix}::go-to-helpcenter`,
        icon: getOdsIcon(ODS_ICON_NAME.LIFEBUOY_CONCEPT),
      },
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
        external: isEUOrCA,
        href: isEUOrCA
          ? constants[region].support.tickets(user.ovhSubsidiary)
          : navigation.getURL('dedicated', '#/ticket'),
        tracking: `${trackingPrefix}::go-to-tickets`,
        icon: getOdsIcon(ODS_ICON_NAME.ENVELOP_CONCEPT),
      },
      ...(isEUOrCA
        ? [
            {
              id: 'createTicket',
              external: true,
              href: constants[region].support.createTicket(user.ovhSubsidiary),
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
