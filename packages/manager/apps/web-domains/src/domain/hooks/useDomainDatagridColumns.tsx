import React from 'react';
import { useTranslation } from 'react-i18next';
import { DatagridColumn } from '@ovh-ux/manager-react-components';
import DatagridColumnServiceName from '@/domain/components/DatagridColumns/Domain/DatagridColumnServiceName';
import { DomainService } from '../types/domainResource';
import DatagridColumnStatus from '../components/DatagridColumns/Domain/DatagridColumnStatus';
import {
  DOMAIN_STATE,
  DOMAIN_TRANSFER_LOCK_STATUS,
  SUSPENSION_STATUS,
} from '../constants/serviceDetail';
import DatagridColumnDnssec from '../components/DatagridColumns/Domain/DatagridColumnDnssec';
import DatagridColumnTags from '../components/DatagridColumns/Domain/DatagridColumnTags';
import DatagridColumnRenewFrequency from '../components/DatagridColumns/Domain/DatagridColumnRenewFrequency';
import DatagridColumnPendingActions from '../components/DatagridColumns/Domain/DatagridColumnPendingActions';
import DatagridColumnExpiration from '../components/DatagridColumns/Domain/DatagridColumnExpiration';

export const useDomainDatagridColumns = (): DatagridColumn<DomainService>[] => {
  const { t } = useTranslation('domain');
  const columns: DatagridColumn<DomainService>[] = [
    {
      id: 'serviceName',
      cell: (props: DomainService) => (
        <DatagridColumnServiceName domainName={props.domain} />
      ),
      label: t('domain_table_header_serviceName'),
      isFilterable: true,
      enableHiding: false,
    },
    {
      id: 'status',
      cell: (props: DomainService) => (
        <DatagridColumnStatus state={props.state} mapping={DOMAIN_STATE} />
      ),
      label: t('domain_table_header_status'),
      isFilterable: true,
      enableHiding: false,
    },
    {
      id: 'suspensionState',
      cell: (props: DomainService) => (
        <DatagridColumnStatus
          state={props.suspensionState}
          mapping={SUSPENSION_STATUS}
        />
      ),
      label: t('domain_table_header_technical_status'),
      isFilterable: true,
      enableHiding: false,
    },

    {
      id: 'renewFrequency',
      cell: (props: DomainService) => (
        <DatagridColumnRenewFrequency serviceName={props.domain} />
      ),
      label: t('domain_table_header_renew_frequency'),
      isFilterable: true,
      enableHiding: false,
    },
    {
      id: 'expiration',
      cell: (props: DomainService) => (
        <DatagridColumnExpiration serviceName={props.domain} />
      ),
      label: t('domain_table_header_expiration'),
      isFilterable: true,
      enableHiding: false,
    },
    {
      id: 'pendingActions',
      cell: (props: DomainService) => (
        <DatagridColumnPendingActions serviceName={props.domain} />
      ),
      label: t('domain_table_header_pending_actions'),
      isFilterable: true,
      enableHiding: false,
    },
    {
      id: 'tags',
      cell: (props: DomainService) => (
        <DatagridColumnTags tags={props.iam.tags} />
      ),
      label: t('domain_table_header_tags'),
      isFilterable: false,
      enableHiding: true,
    },
    {
      id: 'transferProtection',
      cell: (props: DomainService) => (
        <DatagridColumnStatus
          state={props.transferLockStatus}
          mapping={DOMAIN_TRANSFER_LOCK_STATUS}
        />
      ),
      label: t('domain_table_header_transfer_protection'),
      isFilterable: true,
      enableHiding: true,
    },
    {
      id: 'dnssec',
      cell: (props: DomainService) => (
        <DatagridColumnDnssec serviceName={props.domain} />
      ),
      label: t('domain_table_header_dnssec'),
      isFilterable: true,
      enableHiding: true,
    },
  ];
  return columns;
};
