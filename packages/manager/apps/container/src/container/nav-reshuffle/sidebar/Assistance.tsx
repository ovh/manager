import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { useURL } from '@/container/common/urls-constants';
import ApplicationContext from '@/context';
import { ONBOARDING_STATUS_ENUM } from '@/core/onboarding';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

import SidebarLink from './SidebarLink';

function AssistanceSidebar(): JSX.Element {
  const { t } = useTranslation('sidebar');
  const { shell } = useContext(ApplicationContext);
  const environment = shell
    .getPluginManager()
    .getPlugin('environment')
    .getEnvironment();
  const urls = useURL(environment);
  const trackingPlugin = shell.getPlugin('tracking');

  const hasAdvancedSupport = ['EU', 'CA'].includes(environment.getRegion());
  const { openOnboarding, onboardingOpenedState } = useProductNavReshuffle();

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

  const trackNode = (id) => {
    trackingPlugin.trackClick({ name: `navbar_v2_${id}`, type: 'navigation' });
  };

  return (
    <ul>
      <li>
        <h2>{t('sidebar_assistance_title')}</h2>
      </li>
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
        <SidebarLink
          node={{
            translation: 'sidebar_assistance_status',
            url: urls.get('status'),
            count: false,
            isExternal: true,
          }}
          onClick={() => trackNode('assistance_status')}
        />
        {hasAdvancedSupport && (
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
        )}
        {hasAdvancedSupport && (
          <SidebarLink
            node={{ translation: 'sidebar_assistance_live_chat', count: false }}
            onClick={() => {
              shell.getPlugin('ux').openChatbot();
              trackNode('assistance_live_chat');
            }}
          />
        )}
        <SidebarLink
          node={{ translation: 'sidebar_assistance_onboarding', count: false }}
          onClick={() => startOnboarding()}
        />
      </li>
    </ul>
  );
}

export default AssistanceSidebar;
