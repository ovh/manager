import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReket } from '@ovh-ux/ovh-reket';
import { useURL } from '@/container/common/urls-constants';
import ApplicationContext from '@/context';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

import SidebarLink from './SidebarLink';
import style from './style.module.scss';
import useContainer from '@/core/container';

const AssistanceSidebar: React.FC = (): JSX.Element => {
  const { t } = useTranslation('sidebar');
  const { shell } = useContext(ApplicationContext);
  const { setChatbotReduced } = useContainer();

  const environment = shell
    .getPluginManager()
    .getPlugin('environment')
    .getEnvironment();
  const urls = useURL(environment);
  const trackingPlugin = shell.getPlugin('tracking');
  const reketInstance = useReket();

  const [hasLiveChat, setHashLiveChat] = useState(false);

  const { closeNavigationSidebar, openOnboarding } = useProductNavReshuffle();

  useEffect(() => {
    const initLiveChat = async () => {
      const results: Record<string, boolean> = await reketInstance.get(
        `/feature/livechat/availability`,
        {
          requestType: 'aapi',
        },
      );
      setHashLiveChat(results.livechat);
    };
    initLiveChat();
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
    <ul className="mt-auto">
      <li className="assistance_header px-3">
        <h2 className="flex justify-between">
          <span>{t('sidebar_assistance_title')}</span>
        </h2>
      </li>
      {['EU'].includes(environment.getRegion()) && (
        <li className="flex px-3">
          <span
            className={`oui-icon oui-icon-home mr-2 ${style.sidebar_action_icon}`}
            aria-hidden="true"
          ></span>
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
      <li className="flex px-3">
        <span
          className={`oui-icon oui-icon-help mr-2 ${style.sidebar_action_icon}`}
          aria-hidden="true"
        ></span>
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
      <li className="flex px-3">
        <span
          className={`oui-icon oui-icon-warning mr-2 ${style.sidebar_action_icon}`}
          aria-hidden="true"
        ></span>
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
        <li className="flex px-3">
          <span
            className={`oui-icon oui-icon-chat mr-2 ${style.sidebar_action_icon}`}
            aria-hidden="true"
          ></span>
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
    </ul>
  );
};

export default AssistanceSidebar;
