import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  Datagrid,
  DatagridColumn,
  Links,
  LinkType,
  ManagerButton,
  Notifications,
} from '@ovh-ux/manager-react-components';
import { Outlet } from 'react-router-dom';
import { AccountType } from '@/api/account';
import {
  useOverridePage,
  useGenerateUrl,
  useAccountList,
  usePlatform,
} from '@/hooks';
import LabelChip from '@/components/LabelChip';
import guidesConstants from '@/guides.constants';
import ActionButtonEmail from './ActionButtonEmail';
import { convertOctets } from '@/utils';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

export type EmailsItem = {
  id: string;
  email: string;
  offer: string;
  organizationId: string;
  organizationLabel: string;
  used: number;
  available: number;
};

const columns: DatagridColumn<EmailsItem>[] = [
  {
    id: 'email account',
    cell: (item) => (
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._100}
        level={ODS_TEXT_LEVEL.body}
      >
        {item.email}
      </OsdsText>
    ),
    label: 'zimbra_account_datagrid_email_label',
  },
  {
    id: 'organization',
    cell: (item) =>
      item.organizationLabel && (
        <LabelChip id={item.organizationId}>{item.organizationLabel}</LabelChip>
      ),
    label: 'zimbra_account_datagrid_organization_label',
  },
  {
    id: 'offer',
    cell: (item) =>
      item.offer && (
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._100}
          level={ODS_TEXT_LEVEL.body}
        >
          {item.offer}
        </OsdsText>
      ),
    label: 'zimbra_account_datagrid_offer_label',
  },
  {
    id: 'quota',
    cell: (item) => (
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._100}
        level={ODS_TEXT_LEVEL.body}
      >
        {convertOctets(item.used)} / {convertOctets(item.available)}
      </OsdsText>
    ),
    label: 'zimbra_account_datagrid_quota',
  },
  {
    id: 'tooltip',
    cell: (item: EmailsItem) => <ActionButtonEmail emailsItem={item} />,
    label: '',
  },
];

export default function EmailAccounts() {
  const { t } = useTranslation('accounts');
  const { platformUrn } = usePlatform();
  const { data } = useAccountList();
  const isOverriddedPage = useOverridePage();

  const items: EmailsItem[] =
    data?.map((item: AccountType) => ({
      id: item.id,
      email: item.currentState.email,
      offer: item.currentState.offer,
      organizationId: item.currentState.organizationId,
      organizationLabel: item.currentState.organizationLabel,
      used: item.currentState.quota.used,
      available: item.currentState.quota.available,
    })) ?? [];

  const webmailUrl = guidesConstants.GUIDES_LIST.webmail.url;

  const hrefAddEmailAccount = useGenerateUrl('./add', 'href');

  return (
    <>
      <div className="py-6 mt-8">
        <Outlet />
        {!isOverriddedPage && (
          <>
            <Notifications />
            <div className="mb-8">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                hue={ODS_TEXT_COLOR_HUE._500}
                size={ODS_TEXT_SIZE._200}
                className="font-bold mr-4"
              >
                {t('zimbra_account_datagrid_webmail_label')}
              </OsdsText>
              <Links
                href={webmailUrl}
                type={LinkType.external}
                label={webmailUrl}
                target={OdsHTMLAnchorElementTarget._blank}
              ></Links>
            </div>
            {platformUrn && (
              <ManagerButton
                color={ODS_THEME_COLOR_INTENT.primary}
                inline
                size={ODS_BUTTON_SIZE.sm}
                urn={platformUrn}
                iamActions={[IAM_ACTIONS.account.create]}
                href={hrefAddEmailAccount}
                data-testid="add-account-btn"
                className="mb-6"
              >
                <span slot="start">
                  <OsdsIcon
                    name={ODS_ICON_NAME.PLUS}
                    size={ODS_ICON_SIZE.sm}
                    color={ODS_THEME_COLOR_INTENT.primary}
                    contrasted
                  ></OsdsIcon>
                </span>
                <span slot="end">{t('zimbra_account_account_add')}</span>
              </ManagerButton>
            )}
            <Datagrid
              columns={columns.map((column) => ({
                ...column,
                label: t(column.label),
              }))}
              items={items}
              totalItems={items.length}
            />
          </>
        )}
      </div>
    </>
  );
}
