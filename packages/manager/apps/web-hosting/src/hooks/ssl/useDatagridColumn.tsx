import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  ActionMenu,
  ActionMenuItem,
  Badge,
  DataGridTextCell,
  DateFormat,
  useFormattedDate,
} from '@ovh-ux/manager-react-components';

import {
  ODS_BADGE_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';

import { SslCertificate } from '@/types/ssl';

export const DatagridActionCell = (props: SslCertificate) => {
  const { t } = useTranslation('ssl');

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('disable_ssl'),
    },
    {
      id: 2,
      label: t('regenerate_ssl'),
    },
  ];

  return (
    <DataGridTextCell>
      <ActionMenu
        id={props?.currentState?.mainDomain}
        items={items}
        isCompact
        variant={ODS_BUTTON_VARIANT.ghost}
        icon={ODS_ICON_NAME.ellipsisVertical}
      />
    </DataGridTextCell>
  );
};

export default function useDatagridColumn() {
  const { t } = useTranslation('ssl');

  const StatusColor = {
    ACTIVE: ODS_BADGE_COLOR.success,
    CREATING: ODS_BADGE_COLOR.warning,
    DELETING: ODS_BADGE_COLOR.warning,
    EXPIRED: ODS_BADGE_COLOR.neutral,
    IMPORTING: ODS_BADGE_COLOR.warning,
    REGENERATING: ODS_BADGE_COLOR.warning,
  };

  const columns = [
    {
      id: 'mainDomain',
      cell: (props: SslCertificate) => (
        <DataGridTextCell>{props?.currentState?.mainDomain}</DataGridTextCell>
      ),
      label: t('cell_main_domain'),
    },
    {
      id: 'additionalDomain',
      cell: (props: SslCertificate) => (
        <DataGridTextCell>
          {props?.currentState?.additionalDomains?.[0] || '-'}
          {props?.currentState?.additionalDomains?.length > 1 && (
            <small className="text-blue-700 pl-6">
              {t(
                props?.currentState?.additionalDomains?.length === 2
                  ? 'additional_domains_singular_total'
                  : 'additional_domains_plural_total',
                { n: props?.currentState?.additionalDomains?.length - 1 },
              )}
            </small>
          )}
        </DataGridTextCell>
      ),
      label: t('cell_additional_domain'),
    },
    {
      id: 'type',
      cell: (props: SslCertificate) => (
        <DataGridTextCell>
          {t(props?.currentState?.certificateType)}
        </DataGridTextCell>
      ),
      label: t('cell_certificate_type'),
    },
    {
      id: 'state',
      cell: (props: SslCertificate) => (
        <DataGridTextCell>
          <Badge
            label={t(props?.currentState?.state)}
            className="my-3"
            color={StatusColor[props?.currentState?.state]}
          />
        </DataGridTextCell>
      ),
      label: t('cell_state'),
    },
    {
      id: 'creationDate',
      cell: (props: SslCertificate) => (
        <DataGridTextCell>
          {useFormattedDate({
            dateString: props?.currentState?.createdAt,
            format: DateFormat.compact,
          })}
        </DataGridTextCell>
      ),
      label: t('cell_creation_date'),
    },
    {
      id: 'expirationDate',
      cell: (props: SslCertificate) => (
        <DataGridTextCell>
          {useFormattedDate({
            dateString: props?.currentState?.expiredAt,
            format: DateFormat.compact,
          })}
        </DataGridTextCell>
      ),
      label: t('cell_expiration_date'),
    },
    {
      id: 'actions',
      label: '',
      isSortable: false,
      cell: DatagridActionCell,
    },
  ];

  return columns;
}
