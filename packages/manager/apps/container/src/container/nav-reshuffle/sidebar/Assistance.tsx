import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReket } from '@ovh-ux/ovh-reket';
import { useURL } from '@/container/common/urls-constants';
import ApplicationContext from '@/context';
import { ONBOARDING_STATUS_ENUM } from '@/core/onboarding';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

import SidebarLink from './SidebarLink';
import style from './style.module.scss';

type Props = {
  containerURL: { appId: string; appHash: string };
};

function AssistanceSidebar({ containerURL }: Props): JSX.Element {
  const { t } = useTranslation('sidebar');
  const { shell } = useContext(ApplicationContext);
  const environment = shell
    .getPluginManager()
    .getPlugin('environment')
    .getEnvironment();
  const urls = useURL(environment);
  const trackingPlugin = shell.getPlugin('tracking');
  const reketInstance = useReket();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string>(null);

  const hasAdvancedSupport = ['EU', 'CA'].includes(environment.getRegion());
  const [hasChatbot, setHashChatbot] = useState(false);

  const { openOnboarding, onboardingOpenedState } = useProductNavReshuffle();

  useEffect(() => {
    const initChatbot = async () => {
      const results: Record<string, boolean> = await reketInstance.get(
        `/feature/chatbot/availability`,
        {
          requestType: 'aapi',
        },
      );

      setHashChatbot(results.chatbot);
    };
    initChatbot();
  });

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
    trackingPlugin.trackClickImpression({
      click: {
        variant: 'navbar_v2::assistance::onboarding_widget',
        campaignId: '[tooltip-manager]',
        creation: '[general-onboarding]',
        detailedPlacement:
          onboardingOpenedState === ONBOARDING_STATUS_ENUM.DISPLAYED
            ? '[new_visitor]'
            : '[returning_visitor]',
      },
    });
  };

  const trackNode = (id: string) => {
    trackingPlugin.trackClick({ name: `navbar_v2_${id}`, type: 'navigation' });
  };

  return (
    <ul className="mt-auto">
      <li className="assistance_header" onClick={() => setIsOpen(!isOpen)}>
        <h2 className="d-flex justify-content-between">
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
              onClick={() => trackNode('assistance_tickets')}
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
                onClick={() => trackNode('assistance_support_level')}
              />
            </li>
          )}
          {hasChatbot && (
            <li>
              <SidebarLink
                node={{
                  translation: 'sidebar_assistance_live_chat',
                  count: false,
                }}
                onClick={() => {
                  shell.getPlugin('ux').openChatbot();
                  trackNode('assistance_live_chat');
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
}

export default AssistanceSidebar;
