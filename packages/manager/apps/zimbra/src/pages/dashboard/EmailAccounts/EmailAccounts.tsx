import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsIcon, OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
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
} from '@ovhcloud/manager-components';
import { useQuery } from '@tanstack/react-query';
import {
  getZimbraPlatformEmails,
  getZimbraPlatformEmailsQueryKey,
} from '@/api';
import { useOrganization, usePlatform } from '@/hooks';
import LabelChip from '@/components/LabelChip';
import guidesConstants from '@/guides.constants';
import ActionButtonEmail from './ActionButtonEmail';

type EmailsItem = {
  id: string;
  email: string;
  organizationLabel: string;
  used: number;
  available: number;
};

export default function EmailAccounts() {
  const { t } = useTranslation('emails');
  const { platformId } = usePlatform();
  const { data: organization } = useOrganization();
  const { data } = useQuery({
    queryKey: getZimbraPlatformEmailsQueryKey(platformId, organization?.id),
    queryFn: () => getZimbraPlatformEmails(platformId, organization?.id),
  });

  const items: EmailsItem[] =
    data?.map((item) => ({
      id: item.targetSpec.organizationId,
      email: item.currentState.email,
      organizationLabel: item.targetSpec.organizationLabel,
      used: item.targetSpec.quota.used,
      available: item.targetSpec.quota.available,
    })) ?? [];

  const formatQuota = (value: number) => {
    if (value >= 1e12) {
      return `${(value / 1e12).toFixed(1)} ${t(
        'zimbra_emails_datagrid_quota_to',
      )}`;
    }
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(1)} ${t(
        'zimbra_emails_datagrid_quota_go',
      )}`;
    }
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)} ${t(
        'zimbra_emails_datagrid_quota_mo',
      )}`;
    }
    if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)} ${t(
        'zimbra_emails_datagrid_quota_ko',
      )}`;
    }
    return `${value} ${t('zimbra_emails_datagrid_quota_octets')}`;
  };
  const columns: DatagridColumn<EmailsItem>[] = [
    {
      id: 'email account',
      cell: (item) => (
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._200}
          level={ODS_TEXT_LEVEL.body}
        >
          {item.email}
        </OsdsText>
      ),
      label: 'zimbra_emails_datagrid_email_label',
    },
    {
      id: 'organization',
      cell: (item) =>
        item.organizationLabel && (
          <LabelChip id={item.id}>{item.organizationLabel}</LabelChip>
        ),
      label: 'zimbra_emails_datagrid_organization_label',
    },
    {
      id: 'quota',
      cell: (item) => (
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_TEXT_SIZE._200}
          level={ODS_TEXT_LEVEL.body}
        >
          {formatQuota(item.used)} / {formatQuota(item.available)}
        </OsdsText>
      ),
      label: 'zimbra_emails_datagrid_quota',
    },
    {
      id: 'tooltip',
      cell: () => <ActionButtonEmail />,
      label: '',
    },
  ];
  const webmailUrl = guidesConstants.GUIDES_LIST.webmail.url;
  return (
    <div className="py-6">
      <div className="mb-4">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          hue={ODS_TEXT_COLOR_HUE._500}
          size={ODS_TEXT_SIZE._200}
          className="font-bold mr-4"
        >
          {t('zimbra_emails_datagrid_webmail_label')}
        </OsdsText>
        <Links
          href={webmailUrl}
          type={LinkType.external}
          label={webmailUrl}
          target={OdsHTMLAnchorElementTarget._blank}
        ></Links>
      </div>
      <Datagrid
        columns={columns.map((column) => ({
          ...column,
          label: t(column.label),
        }))}
        items={items}
        totalItems={items.length}
      />
    </div>
  );
}
