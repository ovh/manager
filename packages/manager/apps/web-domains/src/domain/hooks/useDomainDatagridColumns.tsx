import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DatagridColumn } from '@ovh-ux/muk';
import { CellContext } from '@tanstack/react-table';
import { FilterComparator } from '@ovh-ux/manager-core-api';
import DatagridColumnServiceName from '@/domain/components/DatagridColumns/Domain/DatagridColumnServiceName';
import {
  StatusDetails,
  TDomainResource,
  TNameServerWithType,
  TransferLockStatusEnum,
  TCurrentState,
  TTargetSpec,
} from '@/domain/types/domainResource';
import DatagridColumnStatus from '@/domain/components/DatagridColumns/Domain/DatagridColumnStatus';
import {
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
import { DomainStateEnum } from '@/domain/enum/domainState.enum';
import { capitalize } from '@/domain/utils/helpers';
import { SuspensionStateEnum } from '../enum/suspensionState.enum';
import { DnsConfigurationTypeEnum } from '../enum/dnsConfigurationType.enum';

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
  const deduplicatedRecord = Object.entries(DOMAIN_STATE).reduce<
    Record<string, StatusDetails>
  >((acc, [key, item]) => {
    if (!Object.values(acc).some((v) => v.i18nKey === item.i18nKey)) {
      acc[key] = item;
    }
    return acc;
  }, {});
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
          label: t('domain_table_header_serviceName'),
          enableHiding: false,
          isSearchable: true,
          size: 300,
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
          isFilterable: true,
          enableHiding: true,
        },
        {
          id: 'state',
          accessorFn: (row: DomainResourceDatagridData) => {
            return row.currentState?.mainState;
          },
          cell: ({
            getValue,
          }: CellContext<DomainResourceDatagridData, unknown>) => {
            const state = getValue<DomainStateEnum | undefined>();
            return (
              <DatagridColumnStatus state={state} mapping={DOMAIN_STATE} />
            );
          },
          label: t('domain_table_header_status'),
          header: t('domain_table_header_status'),
          comparator: [FilterComparator.IsEqual],
          isFilterable: true,
          enableHiding: false,
          filterOptions: Object.entries(deduplicatedRecord)
            .map(([state, statusDetails]) => ({
              label: t(statusDetails.i18nKey),
              value: statusDetails.value ?? state,
            }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        },
        {
          id: 'suspensionState',
          accessorKey: 'currentState.suspensionState',
          cell: ({
            getValue,
          }: CellContext<DomainResourceDatagridData, unknown>) => {
            const state = getValue<SuspensionStateEnum | undefined>();
            return state ? (
              <DatagridColumnStatus state={state} mapping={SUSPENSION_STATUS} />
            ) : (
              <span>-</span>
            );
          },
          isFilterable: true,
          enableHiding: false,
          label: t('domain_table_header_technical_status'),
          header: t('domain_table_header_technical_status'),
          filterOptions: Object.entries(SUSPENSION_STATUS)
            .map(([state, statusDetails]) => ({
              label: t(statusDetails.i18nKey),
              value: statusDetails.value ?? state,
            }))
            .sort((a, b) => a.label.localeCompare(b.label)),
          comparator: [FilterComparator.IsEqual],
        },
        {
          id: 'transferProtection',
          accessorKey: 'currentState.protectionState',
          cell: ({
            getValue,
          }: CellContext<DomainResourceDatagridData, unknown>) => {
            const state = getValue<TransferLockStatusEnum | undefined>();
            return state ? (
              <DatagridColumnStatus
                state={state}
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
          accessorFn: (row: DomainResourceDatagridData) => {
            return {
              domainId: row.id,
              isProcedure: row.currentState?.additionalStates?.length > 0,
            };
          },
          cell: ({
            getValue,
          }: CellContext<DomainResourceDatagridData, unknown>) => {
            const { domainId, isProcedure } = getValue<{
              domainId: string;
              isProcedure: boolean;
            }>();
            return (
              <DatagridColumnPendingActions
                serviceName={domainId}
                isProcedure={isProcedure}
              />
            );
          },
          label: t('domain_table_header_pending_actions'),
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
          accessorFn: (row: DomainResourceDatagridData) => {
            return {
              currentState: row.currentState,
              targetSpec: row.targetSpec,
            };
          },
          cell: ({
            getValue,
          }: CellContext<DomainResourceDatagridData, unknown>) => {
            const { currentState, targetSpec } = getValue<{
              currentState: TCurrentState;
              targetSpec: TTargetSpec;
            }>();
            return (
              <DatagridColumnDnssec
                resourceCurrentState={currentState}
                resourceTargetSpec={targetSpec}
              />
            );
          },
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
          comparator: [FilterComparator.IsEqual],
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
          comparator: [FilterComparator.IsEqual],
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
          comparator: [FilterComparator.IsEqual],
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
          comparator: [FilterComparator.IsEqual],
          isFilterable: true,
          enableHiding: true,
        },
        {
          id: 'dns',
          accessorKey: 'currentState.dnsConfiguration.nameServers',
          cell: ({
            getValue,
          }: CellContext<DomainResourceDatagridData, unknown>) => {
            const dns = getValue<TNameServerWithType[] | undefined>();
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
            const type = getValue<DnsConfigurationTypeEnum>();
            return type ? (
              <DatagridColumnDnsType type={capitalize(type)} />
            ) : (
              <span>-</span>
            );
          },
          header: t('domain_dns_table_header_type'),
          label: t('domain_dns_table_header_type'),
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
          size: 50,
        },
      ] as DatagridColumn<DomainResourceDatagridData>[],
    [t, openModal],
  );

  return columns;
};
