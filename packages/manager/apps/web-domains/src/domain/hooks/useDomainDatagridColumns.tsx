import { useTranslation } from 'react-i18next';
import { DatagridColumn } from '@ovh-ux/manager-react-components';
import {
  FilterCategories,
  FilterTypeCategories,
} from '@ovh-ux/manager-core-api';
import DatagridColumnServiceName from '@/domain/components/DatagridColumns/Domain/DatagridColumnServiceName';
import {
  DomainService,
  NameServerTypeEnum,
  StatusDetails,
  TDomainResource,
} from '@/domain/types/domainResource';
import DatagridColumnStatus from '@/domain/components/DatagridColumns/Domain/DatagridColumnStatus';
import {
  additionalDomainStateAsValue,
  DOMAIN_STATE,
  DOMAIN_TRANSFER_LOCK_STATUS,
  SUSPENSION_STATUS,
} from '@/domain/constants/serviceDetail';
import DatagridColumnDnssec from '@/domain/components/DatagridColumns/Domain/DatagridColumnDnssec';
import DatagridColumnTags from '@/domain/components/DatagridColumns/Domain/DatagridColumnTags';
import DatagridColumnRenewFrequency from '@/domain/components/DatagridColumns/Domain/DatagridColumnRenewFrequency';
import DatagridColumnPendingActions from '@/domain/components/DatagridColumns/Domain/DatagridColumnPendingActions';
import DatagridColumnExpiration from '@/domain/components/DatagridColumns/Domain/DatagridColumnExpiration';
import DatagridColumnContact from '@/domain/components/DatagridColumns/Domain/DatagridColumnContact';
import DatagridColumnDnsType from '@/domain/components/DatagridColumns/Domain/DatagridColumnDnsType';
import DatagridColumnDns from '@/domain/components/DatagridColumns/Domain/DatagridColumnDns';
import DatagridColumnActions from '@/domain/components/DatagridColumns/Domain/DatagridColumnActions';
import { AdditionalDomainStateEnum } from '../enum/domainState.enum';

interface DomainDatagridColumnsProps {
  readonly openModal: (serviceNames: string[]) => void;
}
export const useDomainDatagridColumns = ({
  openModal,
}: DomainDatagridColumnsProps): DatagridColumn<TDomainResource>[] => {
  const { t } = useTranslation('domain');

  const deduplicatedRecord = Object.entries(DOMAIN_STATE).reduce<
    Record<string, StatusDetails>
  >((acc, [key, item]) => {
    if (!Object.values(acc).some((v) => v.i18nKey === item.i18nKey)) {
      acc[key] = item;
    }
    return acc;
  }, {});

  const columns: DatagridColumn<TDomainResource>[] = [
    {
      id: 'domain',
      cell: (props: TDomainResource) => (
        <DatagridColumnServiceName domainName={props.id} />
      ),
      comparator: FilterCategories.String,
      label: t('domain_table_header_serviceName'),
      isFilterable: true,
      enableHiding: false,
      isSearchable: true,
    },
    {
      id: 'iam.tags',
      cell: (props: TDomainResource) => (
        <DatagridColumnTags tags={props.iam.tags} />
      ),
      type: FilterTypeCategories.Tags,
      label: t('domain_table_header_tags'),
      isFilterable: true,
      enableHiding: true,
    },
    {
      id: 'state',
      cell: (props: TDomainResource) => {
        const procedure = additionalDomainStateAsValue(
          props.currentState?.additionalStates,
        ) as AdditionalDomainStateEnum;
        return (
          <DatagridColumnStatus
            state={procedure ? procedure : props.currentState.mainState}
            mapping={DOMAIN_STATE}
          />
        );
      },
      comparator: FilterCategories.String,
      label: t('domain_table_header_status'),
      isFilterable: true,
      enableHiding: false,
    },
    {
      id: 'suspensionState',
      cell: (props: TDomainResource) => (
        <DatagridColumnStatus
          state={props.currentState?.suspensionState}
          mapping={SUSPENSION_STATUS}
        />
      ),
      label: t('domain_table_header_technical_status'),
      isFilterable: false,
      enableHiding: false,
    },
    {
      id: 'transferProtection',
      cell: (props: TDomainResource) => (
        <DatagridColumnStatus
          state={props.currentState?.protectionState}
          mapping={DOMAIN_TRANSFER_LOCK_STATUS}
        />
      ),
      label: t('domain_table_header_transfer_protection'),
      isFilterable: false,
      enableHiding: true,
    },
    {
      id: 'renewFrequency',
      cell: (props: TDomainResource) => (
        <DatagridColumnRenewFrequency serviceName={props.id} />
      ),
      label: t('domain_table_header_renew_frequency'),
      isFilterable: false,
      enableHiding: false,
    },
    {
      id: 'pendingActions',
      cell: (props: TDomainResource) => (
        <DatagridColumnPendingActions serviceName={props.id} />
      ),
      label: t('domain_table_header_pending_actions'),
      isFilterable: false,
      enableHiding: false,
    },
    {
      id: 'expiration',
      cell: (props: TDomainResource) => (
        <DatagridColumnExpiration serviceName={props.id} />
      ),
      label: t('domain_table_header_expiration'),
      isFilterable: false,
      enableHiding: false,
    },
    {
      id: 'dnssec',
      cell: (props: TDomainResource) => (
        <DatagridColumnDnssec serviceName={props.id} />
      ),
      label: t('domain_table_header_dnssec'),
      isFilterable: false,
      enableHiding: true,
    },
    {
      id: 'contactOwner.id',
      cell: (props: TDomainResource) => (
        <DatagridColumnContact
          contactId={
            props.currentState?.contactsConfiguration?.contactOwner?.id
          }
          isOwner={true}
        />
      ),
      comparator: FilterCategories.String,
      label: t('domain_table_header_contact_owner'),
      isFilterable: false,
      enableHiding: true,
    },
    {
      id: 'contactTech.id',
      cell: (props: TDomainResource) => (
        <DatagridColumnContact
          contactId={
            props.currentState?.contactsConfiguration?.contactTechnical?.id
          }
          isOwner={false}
        />
      ),
      comparator: FilterCategories.String,
      label: t('domain_table_header_contact_tech'),
      isFilterable: true,
      enableHiding: true,
    },
    {
      id: 'contactAdmin.id',
      cell: (props: TDomainResource) => (
        <DatagridColumnContact
          contactId={
            props.currentState?.contactsConfiguration?.contactTechnical?.id
          }
          isOwner={false}
        />
      ),
      comparator: FilterCategories.String,
      label: t('domain_table_header_contact_admin'),
      isFilterable: true,
      enableHiding: true,
    },
    {
      id: 'contactBilling.id',
      cell: (props: TDomainResource) => (
        <DatagridColumnContact
          contactId={
            props.currentState?.contactsConfiguration?.contactBilling?.id
          }
          isOwner={false}
        />
      ),
      comparator: FilterCategories.String,
      label: t('domain_table_header_contact_billing'),
      isFilterable: true,
      enableHiding: true,
    },
    {
      id: 'dns',
      cell: (props: TDomainResource) => (
        <DatagridColumnDns
          dns={props.currentState?.dnsConfiguration?.nameServers}
        />
      ),
      label: t('domain_tab_name_dns_server'),
      isFilterable: false,
      enableHiding: true,
    },
    {
      id: 'nameServerType',
      cell: (props: TDomainResource) => (
        <DatagridColumnDnsType
          type={props.currentState?.dnsConfiguration?.configurationType}
        />
      ),
      comparator: FilterCategories.String,
      label: t('domain_dns_table_header_type'),
      isFilterable: true,
      filterOptions: [
        {
          value: NameServerTypeEnum.ANYCAST,
          label: NameServerTypeEnum.ANYCAST,
        },
        {
          value: NameServerTypeEnum.MIXED,
          label: NameServerTypeEnum.MIXED,
        },
        {
          value: NameServerTypeEnum.HOSTING,
          label: NameServerTypeEnum.HOSTING,
        },
        {
          value: NameServerTypeEnum.EMPTY,
          label: NameServerTypeEnum.EMPTY,
        },
        {
          value: NameServerTypeEnum.EXTERNAL,
          label: NameServerTypeEnum.EXTERNAL,
        },
        {
          value: NameServerTypeEnum.HOLD,
          label: NameServerTypeEnum.HOLD,
        },
        {
          value: NameServerTypeEnum.HOSTED,
          label: NameServerTypeEnum.HOSTED,
        },
        {
          value: NameServerTypeEnum.PARKING,
          label: NameServerTypeEnum.PARKING,
        },
      ],
      enableHiding: true,
    },
    {
      id: 'actions',
      cell: (props: TDomainResource) => (
        <DatagridColumnActions
          serviceName={props.id}
          mainState={props.currentState?.mainState}
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
