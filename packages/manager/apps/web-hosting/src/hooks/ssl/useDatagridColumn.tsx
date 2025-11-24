import React, { useMemo } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BADGE_COLOR, BUTTON_VARIANT, Badge, Button, ICON_NAME } from '@ovhcloud/ods-react';

import { ActionMenu, ActionMenuItemProps, DatagridColumn, useFormatDate } from '@ovh-ux/muk';

import { SslCertificate } from '@/data/types/product/ssl';
import { subRoutes, urls } from '@/routes/routes.constants';

interface CellContext<TData> {
  row: {
    original: TData;
  };
}
export const DatagridActionCell = ({ row }: CellContext<Record<string, unknown>>) => {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('ssl');
  const resource = row.original as SslCertificate;

  const items: ActionMenuItemProps[] = [
    {
      id: 1,
      label: t('disable_ssl'),
      onClick: () => {
        navigate(
          urls.disableSsl
            .replace(subRoutes.serviceName, serviceName)
            .replace(subRoutes.domain, resource?.currentState?.mainDomain),
        );
      },
    },
  ];

  return (
    <ActionMenu
      id={resource?.currentState?.mainDomain}
      items={items}
      isCompact
      variant={BUTTON_VARIANT.ghost}
      icon={ICON_NAME.ellipsisVertical}
    />
  );
};

export default function useDatagridColumn() {
  const navigate = useNavigate();
  const { serviceName } = useParams();
  const { t } = useTranslation('ssl');
  const formatDate = useFormatDate();

  const getResource = (row: Record<string, unknown>): SslCertificate => {
    return row as SslCertificate;
  };

  const columns: DatagridColumn<Record<string, unknown>>[] = useMemo(() => {
    const StatusColor = {
      ACTIVE: BADGE_COLOR.success,
      CREATING: BADGE_COLOR.warning,
      DELETING: BADGE_COLOR.warning,
      EXPIRED: BADGE_COLOR.neutral,
      IMPORTING: BADGE_COLOR.warning,
      REGENERATING: BADGE_COLOR.warning,
    };

    return [
      {
        id: 'mainDomain',
        accessorFn: (row) => getResource(row).currentState.mainDomain,
        cell: ({ row }) => <div>{getResource(row.original).currentState.mainDomain}</div>,
        header: t('cell_main_domain'),
      },
      {
        id: 'additionalDomain',
        cell: ({ row }) => (
          <>
            {getResource(row.original)?.currentState?.additionalDomains?.[0] || '-'}
            {getResource(row.original)?.currentState?.additionalDomains?.length > 1 && (
              <Button
                onClick={() => {
                  navigate({
                    pathname: urls.sanSsl
                      .replace(subRoutes.serviceName, serviceName)
                      .replace(
                        subRoutes.domain,
                        getResource(row.original)?.currentState?.mainDomain,
                      ),
                    search: `?${new URLSearchParams({
                      san: getResource(row.original)?.currentState?.additionalDomains?.join('; '),
                    })}`,
                  });
                }}
                variant={BUTTON_VARIANT.ghost}
              >
                {t(
                  getResource(row.original)?.currentState?.additionalDomains?.length === 2
                    ? 'additional_domains_singular_total'
                    : 'additional_domains_plural_total',
                  { n: getResource(row.original)?.currentState?.additionalDomains?.length - 1 },
                )}
              </Button>
            )}
          </>
        ),
        header: t('cell_additional_domain'),
      },
      {
        id: 'type',
        cell: ({ row }) => <>{t(getResource(row.original)?.currentState?.certificateType)}</>,
        header: t('cell_certificate_type'),
      },
      {
        id: 'state',
        cell: ({ row }) => (
          <Badge
            className="my-3"
            color={StatusColor[getResource(row.original)?.currentState?.state]}
          >
            {t(getResource(row.original)?.currentState?.state)}
          </Badge>
        ),
        label: t('cell_state'),
      },
      {
        id: 'creationDate',
        cell: ({ row }) => (
          <>
            {formatDate({
              date: getResource(row.original)?.currentState?.createdAt,
              format: 'dd/MM/yyyy',
            })}
          </>
        ),
        label: t('cell_creation_date'),
      },
      {
        id: 'expirationDate',
        cell: ({ row }) => (
          <>
            {getResource(row.original)?.currentState?.expiredAt
              ? formatDate({
                  date: getResource(row.original)?.currentState?.expiredAt,
                  format: 'dd/MM/yyyy',
                })
              : '-'}
          </>
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
  }, [t, navigate, serviceName, formatDate]);
  return columns;
}
