import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DatagridColumn } from '@ovh-ux/muk';
import { CellContext } from '@tanstack/react-table';
import {
  FilterCategories,
  FilterTypeCategories,
} from '@ovh-ux/manager-core-api';
import DatagridColumnServiceName from '@/domain/components/DatagridColumns/Domain/DatagridColumnServiceName';
import {
  NameServerTypeEnum,
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

export type DomainResourceDatagridData = TDomainResource &
  Record<string, unknown>;

export const useDomainDatagridColumns = ({
  openModal,
}: DomainDatagridColumnsProps): DatagridColumn<
  DomainResourceDatagridData
>[] => {
  const { t } = useTranslation('domain');

  const columns = useMemo(
    () =>
      [
        {
          id: 'domain',
          accessorKey: 'id',
          cell: ({
            getValue,
          }: CellContext<DomainResourceDatagridData, unknown>) => (
            <DatagridColumnServiceName domainName={getValue<string>()} />
          ),
          header: t('domain_table_header_serviceName'),
          enableHiding: false,
          isSearchable: true,
        },
        {
          id: 'iam.tags',
          accessorKey: 'iam.tags',
          cell: ({
            getValue,
          }: CellContext<DomainResourceDatagridData, unknown>) => {
            const tags = getValue<Record<string, string> | undefined>();
            const hasContent = tags && Object.keys(tags).length > 0;
            return hasContent ? (
              <DatagridColumnTags tags={tags} />
            ) : (
              <span>-</span>
            );
          },
          label: t('domain_table_header_tags'),
          header: t('domain_table_header_tags'),
          type: FilterTypeCategories.Tags,
          isFilterable: true,
          enableHiding: true,
        },
        {
          id: 'state',
          accessorFn: (row: DomainResourceDatagridData) => {
            const procedure = additionalDomainStateAsValue(
              row.currentState?.additionalStates,
            ) as AdditionalDomainStateEnum;
            return procedure === AdditionalDomainStateEnum.PROCEDURE_IN_PROGRESS
              ? procedure
              : row.currentState?.mainState;
          },
          cell: ({
            getValue,
          }: CellContext<DomainResourceDatagridData, unknown>) => {
            const state = getValue<
              string | AdditionalDomainStateEnum | undefined
            >();
            return (
              <DatagridColumnStatus
                state={state as any}
                mapping={DOMAIN_STATE}
              />
            );
          },
          label: t('domain_table_header_status'),
          header: t('domain_table_header_status'),
          comparator: FilterCategories.Options,
          isFilterable: true,
          enableHiding: false,
          filterOptions: Object.entries(DOMAIN_STATE).map(
            ([value, details]) => ({
              value,
              label: t(details.i18nKey),
            }),
          ),
        },
        {
          id: 'suspensionState',
          accessorKey: 'currentState.suspensionState',
          cell: ({
            getValue,
          }: CellContext<DomainResourceDatagridData, unknown>) => {
            const state = getValue<string | undefined>();
            return state ? (
              <DatagridColumnStatus
                state={state as any}
                mapping={SUSPENSION_STATUS}
              />
            ) : (
              <span>-</span>
            );
          },
          header: t('domain_table_header_technical_status'),
          isFilterable: false,
          enableHiding: false,
        },
        {
          id: 'transferProtection',
          accessorKey: 'currentState.protectionState',
          cell: ({
            getValue,
          }: CellContext<DomainResourceDatagridData, unknown>) => {
            const state = getValue<string | undefined>();
            return state ? (
              <DatagridColumnStatus
                state={state as any}
                mapping={DOMAIN_TRANSFER_LOCK_STATUS}
              />
            ) : (
              <span>-</span>
            );
          },
          header: t('domain_table_header_transfer_protection'),
          isFilterable: false,
          enableHiding: true,
        },
        {
          id: 'renewFrequency',
          accessorFn: (row: DomainResourceDatagridData) => row.id,
          cell: ({
            getValue,
          }: CellContext<DomainResourceDatagridData, unknown>) => (
            <DatagridColumnRenewFrequency serviceName={getValue<string>()} />
          ),
          header: t('domain_table_header_renew_frequency'),
          isFilterable: false,
          enableHiding: false,
        },
        {
          id: 'pendingActions',
          accessorFn: (row: DomainResourceDatagridData) => row.id,
          cell: ({
            getValue,
          }: CellContext<DomainResourceDatagridData, unknown>) => (
            <DatagridColumnPendingActions serviceName={getValue<string>()} />
          ),
          header: t('domain_table_header_pending_actions'),
          isFilterable: false,
          enableHiding: false,
        },
        {
          id: 'expiration',
          accessorFn: (row: DomainResourceDatagridData) => row.id,
          cell: ({
            getValue,
          }: CellContext<DomainResourceDatagridData, unknown>) => (
            <DatagridColumnExpiration serviceName={getValue<string>()} />
          ),
          header: t('domain_table_header_expiration'),
          isFilterable: false,
          enableHiding: false,
        },
        {
          id: 'dnssec',
          accessorFn: (row: DomainResourceDatagridData) => row.id,
          cell: ({
            getValue,
          }: CellContext<DomainResourceDatagridData, unknown>) => (
            <DatagridColumnDnssec serviceName={getValue<string>()} />
          ),
          header: t('domain_table_header_dnssec'),
          isFilterable: false,
          enableHiding: true,
        },
        {
          id: 'contactOwner.id',
          accessorKey: 'currentState.contactsConfiguration.contactOwner.id',
          cell: ({
            getValue,
          }: CellContext<DomainResourceDatagridData, unknown>) => {
            const contactId = getValue<string | undefined>();
            return contactId ? (
              <DatagridColumnContact contactId={contactId} isOwner={true} />
            ) : (
              <span>-</span>
            );
          },
          header: t('domain_table_header_contact_owner'),
          comparator: FilterCategories.String,
          label: t('domain_table_header_contact_owner'),
          isFilterable: true,
          enableHiding: true,
        },
        {
          id: 'contactTech.id',
          accessorKey: 'currentState.contactsConfiguration.contactTechnical.id',
          cell: ({
            getValue,
          }: CellContext<DomainResourceDatagridData, unknown>) => {
            const contactId = getValue<string | undefined>();
            return contactId ? (
              <DatagridColumnContact contactId={contactId} isOwner={false} />
            ) : (
              <span>-</span>
            );
          },
          header: t('domain_table_header_contact_tech'),
          label: t('domain_table_header_contact_tech'),
          comparator: FilterCategories.String,
          isFilterable: true,
          enableHiding: true,
        },
        {
          id: 'contactAdmin.id',
          accessorKey:
            'currentState.contactsConfiguration.contactAdministrator.id',
          cell: ({
            getValue,
          }: CellContext<DomainResourceDatagridData, unknown>) => {
            const contactId = getValue<string | undefined>();
            return contactId ? (
              <DatagridColumnContact contactId={contactId} isOwner={false} />
            ) : (
              <span>-</span>
            );
          },
          header: t('domain_table_header_contact_admin'),
          label: t('domain_table_header_contact_admin'),
          comparator: FilterCategories.String,
          isFilterable: true,
          enableHiding: true,
        },
        {
          id: 'contactBilling.id',
          accessorKey: 'currentState.contactsConfiguration.contactBilling.id',
          cell: ({
            getValue,
          }: CellContext<DomainResourceDatagridData, unknown>) => {
            const contactId = getValue<string | undefined>();
            return contactId ? (
              <DatagridColumnContact contactId={contactId} isOwner={false} />
            ) : (
              <span>-</span>
            );
          },
          header: t('domain_table_header_contact_billing'),
          label: t('domain_table_header_contact_billing'),
          comparator: FilterCategories.String,
          isFilterable: true,
          enableHiding: true,
        },
        {
          id: 'dns',
          accessorKey: 'currentState.dnsConfiguration.nameServers',
          cell: ({
            getValue,
          }: CellContext<DomainResourceDatagridData, unknown>) => {
            const dns = getValue<any[] | undefined>();
            const hasContent = dns && dns.length > 0;
            return hasContent ? (
              <DatagridColumnDns dns={dns} />
            ) : (
              <span>-</span>
            );
          },
          header: t('domain_tab_name_dns_server'),
          isFilterable: false,
          enableHiding: true,
        },
        {
          id: 'nameServerType',
          accessorKey: 'currentState.dnsConfiguration.configurationType',
          cell: ({
            getValue,
          }: CellContext<DomainResourceDatagridData, unknown>) => {
            const type = getValue<string | undefined>();
            return type ? (
              <DatagridColumnDnsType type={type as any} />
            ) : (
              <span>-</span>
            );
          },
          header: t('domain_dns_table_header_type'),
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
          accessorFn: (row: DomainResourceDatagridData) => row.id,
          cell: ({
            getValue,
            row,
          }: CellContext<DomainResourceDatagridData, unknown>) => (
            <DatagridColumnActions
              serviceName={getValue<string>()}
              mainState={row.original.currentState?.mainState}
              openModal={openModal}
            />
          ),
          header: '',
          isFilterable: false,
          enableHiding: false,
        },
      ] as DatagridColumn<DomainResourceDatagridData>[],
    [t, openModal],
  );

  return columns;
};
