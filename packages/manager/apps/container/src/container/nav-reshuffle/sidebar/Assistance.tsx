import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReket } from '@ovh-ux/ovh-reket';
import { useURL } from '@/container/common/urls-constants';
import ApplicationContext from '@/context';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

import SidebarLink from './SidebarLink';
import style from './style.module.scss';
import useContainer from '@/core/container';

interface Props {
  containerURL: { appId: string; appHash: string };
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

const AssistanceSidebar: React.FC<ComponentProps<Props>> = ({
  containerURL,
  isOpen,
  onToggle,
}: Props): JSX.Element => {
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
  const [selectedItem, setSelectedItem] = useState<string>(null);

  const hasAdvancedSupport = ['EU', 'CA'].includes(environment.getRegion());
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

  useEffect(() => {
    const { appId, appHash } = containerURL;

    setSelectedItem(null);
    if (
      appId === 'dedicated' &&
      appHash.startsWith('/useraccount/support/level')
    ) {
      setSelectedItem('support_level');
    } else if (
      appId === 'dedicated' &&
      (appHash.startsWith('/ticket') || appHash.startsWith('/support/tickets'))
    ) {
      setSelectedItem('tickets');
    }
  }, [containerURL]);

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
      <li className="assistance_header" onClick={() => onToggle(!isOpen)}>
        <h2 className="flex justify-between">
          <span>{t('sidebar_assistance_title')}</span>
          <span
            className={`oui-icon oui-icon-chevron-${isOpen ? 'up' : 'down'}`}
          ></span>
        </h2>
      </li>
      {isOpen && (
        <>
          <li>
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
          <li
            className={`${
              selectedItem === 'tickets' ? style.sidebar_selected : ''
            }`}
          >
            <SidebarLink
              node={{
                translation: 'sidebar_assistance_tickets',
                routing: {
                  application: 'dedicated',
                  hash: '#/ticket',
                },
                count: false,
              }}
              onClick={() => {
                trackNode('assistance_tickets');
                closeNavigationSidebar();
              }}
            />
          </li>
          <li>
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
          {hasAdvancedSupport && (
            <li
              className={`${
                selectedItem === 'support_level' ? style.sidebar_selected : ''
              }`}
            >
              <SidebarLink
                node={{
                  translation: 'sidebar_assistance_support_level',
                  routing: {
                    application: 'dedicated',
                    hash: '#/useraccount/support/level',
                  },
                  count: false,
                }}
                onClick={() => {
                  trackNode('assistance_support_level');
                  closeNavigationSidebar();
                }}
              />
            </li>
          )}
          {hasLiveChat && (
            <li>
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
          <li>
            <SidebarLink
              node={{
                translation: 'sidebar_assistance_onboarding',
                count: false,
              }}
              onClick={() => startOnboarding()}
            />
          </li>
        </>
      )}
    </ul>
  );
};

export default AssistanceSidebar;
