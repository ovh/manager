import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';

import {
  ActionMenu,
  ActionMenuItem,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { subRoutes, urls } from '@/routes/routes.constants';

import { DomainDetails } from '@/types/ssl';

export const DatagridActionCell = (props: DomainDetails) => {
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
            .replace(subRoutes.domain, props.domain),
        );
      },
    },
    {
      id: 2,
      label: t('regenerate_ssl'),
      onClick: () => {
        navigate(
          urls.regenerateSsl
            .replace(subRoutes.serviceName, serviceName)
            .replace(subRoutes.domain, props.domain),
        );
      },
    },
  ];

  return (
    <DataGridTextCell>
      <ActionMenu
        id={props?.domain}
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

  const columns = [
    {
      id: 'mainDomain',
      cell: (props: DomainDetails) => (
        <DataGridTextCell>
          <DataGridTextCell>{props?.domain}</DataGridTextCell>
        </DataGridTextCell>
      ),
      label: t('cell_main_domain'),
    },
    {
      id: 'additionalDomain',
      cell: (props: DomainDetails) => (
        <DataGridTextCell>
          <DataGridTextCell>{props?.additional}</DataGridTextCell>
        </DataGridTextCell>
      ),
      label: t('cell_additional_domain'),
    },
    {
      id: 'type',
      cell: (props: DomainDetails) => (
        <DataGridTextCell>
          <DataGridTextCell>{props?.type}</DataGridTextCell>
        </DataGridTextCell>
      ),
      label: t('cell_certificate_type'),
    },
    {
      id: 'state',
      cell: (props: DomainDetails) => (
        <DataGridTextCell>
          <DataGridTextCell>{props?.state}</DataGridTextCell>
        </DataGridTextCell>
      ),
      label: t('cell_state'),
    },
    {
      id: 'creationDate',
      cell: (props: DomainDetails) => (
        <DataGridTextCell>
          <DataGridTextCell>{props?.creationDate}</DataGridTextCell>
        </DataGridTextCell>
      ),
      label: t('cell_creation_date'),
    },
    {
      id: 'expirationDate',
      cell: (props: DomainDetails) => (
        <DataGridTextCell>
          <DataGridTextCell>{props?.expirationDate}</DataGridTextCell>
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
