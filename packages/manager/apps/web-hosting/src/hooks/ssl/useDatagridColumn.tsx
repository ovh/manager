import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR, ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';

import {
  ActionMenu,
  ActionMenuItem,
  Badge,
  DataGridTextCell,
  useFormatDate,
} from '@ovh-ux/manager-react-components';

import { SslCertificate } from '@/data/types/product/ssl';
import { subRoutes, urls } from '@/routes/routes.constants';

export const DatagridActionCell = (props: SslCertificate) => {
  const { serviceName } = useParams();
  const navigate = useNavigate();

  const { t } = useTranslation('ssl');

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('disable_ssl'),
      onClick: () => {
        navigate(
          urls.disableSsl
            .replace(subRoutes.serviceName, serviceName)
            .replace(subRoutes.domain, props?.currentState?.mainDomain),
        );
      },
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
  const navigate = useNavigate();
  const { serviceName } = useParams();
  const { t } = useTranslation('ssl');
  const formatDate = useFormatDate();
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
            <OdsButton
              onClick={() => {
                navigate({
                  pathname: urls.sanSsl
                    .replace(subRoutes.serviceName, serviceName)
                    .replace(subRoutes.domain, props?.currentState?.mainDomain),
                  search: `?${new URLSearchParams({
                    san: props?.currentState?.additionalDomains?.join('; '),
                  })}`,
                });
              }}
              variant={ODS_BUTTON_VARIANT.ghost}
              label={t(
                props?.currentState?.additionalDomains?.length === 2
                  ? 'additional_domains_singular_total'
                  : 'additional_domains_plural_total',
                { n: props?.currentState?.additionalDomains?.length - 1 },
              )}
            />
          )}
        </DataGridTextCell>
      ),
      label: t('cell_additional_domain'),
    },
    {
      id: 'type',
      cell: (props: SslCertificate) => (
        <DataGridTextCell>{t(props?.currentState?.certificateType)}</DataGridTextCell>
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
          {formatDate({
            date: props?.currentState?.createdAt,
            format: 'dd/MM/yyyy',
          })}
        </DataGridTextCell>
      ),
      label: t('cell_creation_date'),
    },
    {
      id: 'expirationDate',
      cell: (props: SslCertificate) => (
        <DataGridTextCell>
          {props?.currentState?.expiredAt
            ? formatDate({
                date: props?.currentState?.expiredAt,
                format: 'dd/MM/yyyy',
              })
            : '-'}
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
