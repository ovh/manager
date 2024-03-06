import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useResolvedPath } from 'react-router-dom';

import {
  OsdsMenu,
  OsdsMenuItem,
  OsdsButton,
  OsdsIcon,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import {
  ODS_ICON_SIZE,
  ODS_ICON_NAME,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_TEXT_ALIGN,
} from '@ovhcloud/ods-components';

import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Dashboard from '@/components/layout-helpers/Dashboard/Dashboard';
import Loading from '@/components/Loading/Loading';

export default function DashboardPage() {
  const { t } = useTranslation('pci-file-storage/dashboard');

  const tabsList = [
    {
      name: 'general_informations',
      title: t('general_informations'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'organizations',
      title: t('organization'),
      to: useResolvedPath('organizations').pathname,
    },
    {
      name: 'domains',
      title: t('domain'),
      to: useResolvedPath('domains').pathname,
    },
    {
      name: 'email_accounts',
      title: t('email_accounts'),
      to: useResolvedPath('email-accounts').pathname,
    },
    {
      name: 'mailing_list',
      title: t('mailing_list'),
      to: useResolvedPath('mailing-lists').pathname,
    },
    {
      name: 'redirections',
      title: t('redirections'),
      to: useResolvedPath('redirections').pathname,
    },
  ];

  return (
    <div>
      <Breadcrumb />
      <div className="flex justify-between">
        <h1>{t('title')}</h1>
        <OsdsMenu>
          <OsdsButton
            slot="menu-title"
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_BUTTON_VARIANT.ghost}
            size={ODS_BUTTON_SIZE.md}
            type={ODS_BUTTON_TYPE.button}
            text-align={ODS_BUTTON_TEXT_ALIGN.center}
          >
            <span slot="start">
              <OsdsIcon
                name={ODS_ICON_NAME.GUIDES}
                size={ODS_ICON_SIZE.xs}
              ></OsdsIcon>
            </span>
            <span slot="end">{t('header_guides')}</span>
          </OsdsButton>
          <OsdsMenuItem>
            <OsdsButton
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.ghost}
              text-align={ODS_BUTTON_TEXT_ALIGN.start}
              type={ODS_BUTTON_TYPE.button}
            >
              <span slot={'start'}>
                <OsdsText
                  size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                  color={ODS_THEME_COLOR_INTENT.primary}
                >
                  {t('guides_title_1')}
                </OsdsText>
                <OsdsIcon
                  name={ODS_ICON_NAME.EXTERNAL_LINK}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  size={ODS_ICON_SIZE.xxs}
                  className={'ml-1'}
                ></OsdsIcon>
              </span>
            </OsdsButton>
          </OsdsMenuItem>
        </OsdsMenu>
      </div>

      <Suspense fallback={<Loading />}>
        <Dashboard tabs={tabsList} />
      </Suspense>
    </div>
  );
}
