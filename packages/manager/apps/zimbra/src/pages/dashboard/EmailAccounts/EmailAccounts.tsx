import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
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
import { convertOctets } from '@/utils';

type EmailsItem = {
  id: string;
  email: string;
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
        {convertOctets(item.used)} / {convertOctets(item.available)}
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

  const webmailUrl = guidesConstants.GUIDES_LIST.webmail.url;
  return (
    <div className="py-6 mt-8">
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
