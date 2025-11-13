import { useTranslation } from 'react-i18next';
import { DatagridColumn } from '@ovh-ux/manager-react-components';
import { FilterCategories } from '@ovh-ux/manager-core-api';
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
import DatagridColumnContact from '../components/DatagridColumns/Domain/DatagridColumnContact';
import DatagridColumnDnsType from '../components/DatagridColumns/Domain/DatagridColumnDnsType';
import DatagridColumnDns from '../components/DatagridColumns/Domain/DatagridColumnDns';
import DatagridColumnActions from '../components/DatagridColumns/Domain/DatagridColumnActions';
import DatagridColumnCheckBox from '../components/DatagridColumns/Domain/DatagrdColumnCheckBox';

interface DomainDatagridColumnsProps {
  readonly openModal: (serviceNames: string[]) => void;
  readonly selectedServiceNames: string[];
  readonly onToggleCheckbox: (serviceName: string, checked: boolean) => void;
}
export const useDomainDatagridColumns = ({
  openModal,
  selectedServiceNames,
  onToggleCheckbox,
}: DomainDatagridColumnsProps): DatagridColumn<DomainService>[] => {
  const { t } = useTranslation('domain');

  const columns: DatagridColumn<DomainService>[] = [
    {
      id: 'select',
      cell: (props: DomainService) => (
        <DatagridColumnCheckBox
          serviceName={props.domain}
          isSelected={selectedServiceNames.includes(props.domain)}
          onToggle={onToggleCheckbox}
        />
      ),
      label: '',
      isFilterable: false,
      enableHiding: false,
    },
    {
      id: 'domain',
      cell: (props: DomainService) => (
        <DatagridColumnServiceName domainName={props.domain} />
      ),
      comparator: FilterCategories.String,
      label: t('domain_table_header_serviceName'),
      isFilterable: true,
      enableHiding: false,
      isSearchable: true,
    },
    {
      id: 'status',
      cell: (props: DomainService) => (
        <DatagridColumnStatus state={props.state} mapping={DOMAIN_STATE} />
      ),
      comparator: FilterCategories.String,
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
      comparator: FilterCategories.String,
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
      comparator: FilterCategories.Date,
      label: t('domain_table_header_expiration'),
      isFilterable: true,
      enableHiding: false,
    },
    {
      id: 'pendingActions',
      cell: (props: DomainService) => (
        <DatagridColumnPendingActions serviceName={props.domain} />
      ),
      comparator: FilterCategories.String,
      label: t('domain_table_header_pending_actions'),
      isFilterable: true,
      enableHiding: false,
    },
    {
      id: 'tags',
      cell: (props: DomainService) => (
        <DatagridColumnTags tags={props.iam.tags} />
      ),
      comparator: FilterCategories.Tags,
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
      comparator: FilterCategories.String,
      label: t('domain_table_header_transfer_protection'),
      isFilterable: true,
      enableHiding: true,
    },
    {
      id: 'dnssec',
      cell: (props: DomainService) => (
        <DatagridColumnDnssec serviceName={props.domain} />
      ),
      comparator: FilterCategories.String,
      label: t('domain_table_header_dnssec'),
      isFilterable: true,
      enableHiding: true,
    },
    {
      id: 'contact-owner',
      cell: (props: DomainService) => (
        <DatagridColumnContact
          contactId={props.contactOwner.id}
          isOwner={true}
        />
      ),
      comparator: FilterCategories.String,
      label: t('domain_table_header_contact_owner'),
      isFilterable: false,
      enableHiding: true,
    },
    {
      id: 'contact-tech',
      cell: (props: DomainService) => (
        <DatagridColumnContact contactId={props.contactTech.id} />
      ),
      comparator: FilterCategories.String,
      label: t('domain_table_header_contact_tech'),
      isFilterable: false,
      enableHiding: true,
    },
    {
      id: 'contact-admin',
      cell: (props: DomainService) => (
        <DatagridColumnContact contactId={props.contactAdmin.id} />
      ),
      comparator: FilterCategories.String,
      label: t('domain_table_header_contact_admin'),
      isFilterable: false,
      enableHiding: true,
    },
    {
      id: 'contact-billing',
      cell: (props: DomainService) => (
        <DatagridColumnContact contactId={props.contactBilling.id} />
      ),
      comparator: FilterCategories.String,
      label: t('domain_table_header_contact_billing'),
      isFilterable: false,
      enableHiding: true,
    },
    {
      id: 'dns',
      cell: (props: DomainService) => (
        <DatagridColumnDns dns={props.nameServers} />
      ),
      comparator: FilterCategories.String,
      label: t('domain_tab_name_dns_server'),
      isFilterable: false,
      enableHiding: true,
    },
    {
      id: 'dns-type',
      cell: (props: DomainService) => (
        <DatagridColumnDnsType type={props.nameServerType} />
      ),
      comparator: FilterCategories.String,
      label: t('domain_dns_table_header_type'),
      isFilterable: false,
      enableHiding: true,
    },
    {
      id: 'actions',
      cell: (props: DomainService) => (
        <DatagridColumnActions
          serviceName={props.domain}
          mainState={props.state}
          openModal={openModal}
        />
      ),
      label: '',
      isFilterable: false,
      enableHiding: false,
    },
  ];

  return columns;
};
