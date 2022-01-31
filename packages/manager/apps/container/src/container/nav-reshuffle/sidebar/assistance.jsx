import React from 'react';
import { useTranslation } from 'react-i18next';
import SidebarLink from './sidebar-link';

function AssistanceSidebar() {
  const { t } = useTranslation('sidebar');
  return (
    <ul>
      <li>
        <h2>{t('sidebar_assistance_title')}</h2>
      </li>
      <li>
        <SidebarLink
          node={{ translation: 'sidebar_assistance_help_center' }}
          onClick={() => {}}
        />
        <SidebarLink
          node={{ translation: 'sidebar_assistance_tickets' }}
          onClick={() => {}}
        />
        <SidebarLink
          node={{ translation: 'sidebar_assistance_status' }}
          onClick={() => {}}
        />
        <SidebarLink
          node={{ translation: 'sidebar_assistance_support_level' }}
          onClick={() => {}}
        />
        <SidebarLink
          node={{ translation: 'sidebar_assistance_live_chat' }}
          onClick={() => {}}
        />
      </li>
    </ul>
  );
}

export default AssistanceSidebar;
