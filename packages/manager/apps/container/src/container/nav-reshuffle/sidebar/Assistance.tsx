import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReket } from '@ovh-ux/ovh-reket';
import { useURL } from '@/container/common/urls-constants';
import ApplicationContext from '@/context';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

import SidebarLink from './SidebarLink';
import useContainer from '@/core/container';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

const AssistanceSidebar: React.FC = (): JSX.Element => {
  const { t } = useTranslation('sidebar');
  const { shell } = useContext(ApplicationContext);
  const { setChatbotReduced } = useContainer();
  const features = ['livechat', 'carbon-calculator'];

  const environment = shell
    .getPluginManager()
    .getPlugin('environment')
    .getEnvironment();
  const urls = useURL(environment);
  const trackingPlugin = shell.getPlugin('tracking');
  const reketInstance = useReket();

  const [hasLiveChat, setHashLiveChat] = useState(false);
  const [hasCarbonCalculator, setHasCarbonCalculator] = useState(false);

  const { closeNavigationSidebar, openOnboarding } = useProductNavReshuffle();

  useEffect(() => {
    const initFeatures = async () => {
      const results: Record<string, boolean> = await reketInstance.get(
        `/feature/${features.join(',')}/availability`,
        {
          requestType: 'aapi',
        },
      );
      setHashLiveChat(results['livechat']);
      setHasCarbonCalculator(results['carbon-calculator']);
    }
    initFeatures();
  }, []);

  const startOnboarding = () => {
    openOnboarding();
    trackingPlugin.trackClick({
      name: 'navbar_v2::assistance::onboarding_widget',
      type: 'action',
    });
  };

  const trackNode = (id: string) => {
    trackingPlugin.trackClick({ name: `navbar_v2_${id}`, type: 'navigation' });
  }; 

  return (
    <ul className="mt-auto pb-3" id="useful-links">
      <li className="assistance_header px-3 mb-3">
        <h2 className="flex justify-between">
          <span>{t('sidebar_assistance_title')}</span>
        </h2>
      </li>
      {['EU'].includes(environment.getRegion()) && (
        <li className="flex px-3 align-items-center">
          <OsdsIcon
            name={ODS_ICON_NAME.HOME}
            className="mr-2"
            size={ODS_ICON_SIZE.sm}
            color={ODS_THEME_COLOR_INTENT.primary}
            contrasted
          />
          <SidebarLink
            node={{
              translation: 'sidebar_marketplace',
              url: urls.get('marketplace'),
              count: false,
              isExternal: true,
            }}
          />
        </li>
      )}
      <li className="flex px-3 align-items-center">
        <OsdsIcon
            name={ODS_ICON_NAME.HELP_CIRCLE}
            className="mr-2"
            size={ODS_ICON_SIZE.sm}
            color={ODS_THEME_COLOR_INTENT.primary}
            contrasted
          />
        <SidebarLink
          node={{
            translation: 'sidebar_assistance_help_center',
            url: urls.get('help'),
            count: false,
            isExternal: true,
          }}
          onClick={() => trackNode('assistance_help_center')}
        />
      </li>
      <li className="flex px-3 align-items-center">
        <OsdsIcon
            name={ODS_ICON_NAME.WARNING}
            className="mr-2"
            size={ODS_ICON_SIZE.sm}
            color={ODS_THEME_COLOR_INTENT.primary}
            contrasted
          />
        <SidebarLink
          node={{
            translation: 'sidebar_assistance_status',
            url: urls.get('status'),
            count: false,
            isExternal: true,
          }}
          onClick={() => trackNode('assistance_status')}
        />
      </li>
      {hasLiveChat && (
        <li className="flex px-3 align-items-center">
          <OsdsIcon
            name={ODS_ICON_NAME.CHAT}
            className="mr-2"
            size={ODS_ICON_SIZE.sm}
            color={ODS_THEME_COLOR_INTENT.primary}
            contrasted
          />
          <SidebarLink
            node={{
              translation: 'sidebar_assistance_live_chat',
              count: false,
            }}
            onClick={() => {
              shell.getPlugin('ux').openLiveChat();
              setChatbotReduced(false);
              trackNode('assistance_live_chat');
              closeNavigationSidebar();
            }}
          />
        </li>
      )}
      {hasCarbonCalculator && (
        <li className="flex px-3 align-items-center">
          <OsdsIcon
            name={ODS_ICON_NAME.LEAF_CONCEPT}
            className="mr-2"
            size={ODS_ICON_SIZE.sm}
            color={ODS_THEME_COLOR_INTENT.primary}
            contrasted
          />
          <SidebarLink
            node={{
              translation: 'sidebar_assistance_carbon_calculator',
              count: false,
              routing: {
                application: 'carbon-calculator',
                hash: '#/',
              },
            }}
            onClick={() => {
              trackNode('assistance_carbon_calculator');
              closeNavigationSidebar();
            }}
          />
        </li>
      )}
    </ul>
  );
};

export default AssistanceSidebar;
