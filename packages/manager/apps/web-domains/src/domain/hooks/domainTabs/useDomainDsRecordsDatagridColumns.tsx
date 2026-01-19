import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, DataGridTextCell } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction, useState } from 'react';
import { TDsDataInterface } from '@/domain/types/dnssecConfiguration';
import { DrawerActionEnum } from '@/common/enum/common.enum';
import { DrawerBehavior } from '@/common/types/common.types';
import DatagridColumnStatus from '@/domain/components/DatagridColumns/DatagridColumnStatus';
import { ActiveConfigurationTypeEnum } from '@/domain/enum/dnsConfigurationType.enum';
import { domain_dsrecords_key_signing_ksk } from '@/domain/constants/dsRecords';
import { StatusEnum } from '@/domain/enum/Status.enum';

interface UseDomainDsRecordsDatagridColumnsProps {
  readonly setDrawer: Dispatch<SetStateAction<DrawerBehavior>>;
  readonly setDsRecordsData: Dispatch<SetStateAction<TDsDataInterface>>;
  readonly setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  readonly activeConfiguration: ActiveConfigurationTypeEnum;
}

export const useDomainDsRecordsDatagridColumns = ({
  setDrawer,
  setDsRecordsData,
  setIsModalOpen,
  activeConfiguration,
}: UseDomainDsRecordsDatagridColumnsProps) => {
  const { t } = useTranslation(['domain', NAMESPACES.STATUS]);
  const [isPublicKeyExpanded, setisPublicKeyExpanded] = useState<boolean>(true);
  const isActionsDisabled =
    activeConfiguration === ActiveConfigurationTypeEnum.INTERNAL;
  const columns = [
    {
      id: 'keyTag',
      cell: (props: TDsDataInterface) => (
        <DataGridTextCell>{props.keyTag}</DataGridTextCell>
      ),
      label: t('domain_dsrecords_table_header_keyTag'),
    },
    {
      id: 'flags',
      cell: (props: TDsDataInterface) => (
        <DataGridTextCell>
          {`${props.flags} - ${domain_dsrecords_key_signing_ksk}`}
        </DataGridTextCell>
      ),
      label: t('domain_dsrecords_table_header_flags'),
    },
    {
      id: 'algorithm',
      cell: (props: TDsDataInterface) => (
        <DataGridTextCell>{`${props.supportedAlgorithm.number} - ${props.supportedAlgorithm.name}`}</DataGridTextCell>
      ),
      label: t('domain_dsrecords_table_header_algo'),
    },
    {
      id: 'publicKey',
      cell: (props: TDsDataInterface) => (
        <DataGridTextCell>
          <div
            onClick={() => setisPublicKeyExpanded(!isPublicKeyExpanded)}
            className={`max-w-sm break-all cursor-pointer ${isPublicKeyExpanded &&
              'truncate'}`}
          >
            <span>{props.publicKey}</span>
          </div>
        </DataGridTextCell>
      ),
      label: t('domain_dsrecords_table_header_publicKey'),
    },
    {
      id: 'status',
      label: t(`${NAMESPACES.STATUS}:status`),
      cell: (props: TDsDataInterface) => (
        <DatagridColumnStatus status={props.status} />
      ),
    },
  ];

  if (!isActionsDisabled) {
    columns.push({
      id: 'actions',
      cell: (props: TDsDataInterface) => (
        <ActionMenu
          items={[
            {
              id: 1,
              label: t(`${NAMESPACES.ACTIONS}:modify`),
              onClick: () => {
                setDrawer({
                  action: DrawerActionEnum.Modify,
                  isOpen: true,
                });
                setDsRecordsData(props);
              },
              isDisabled: props.status === StatusEnum.ACTIVATING,
            },
            {
              id: 2,
              label: t(`${NAMESPACES.ACTIONS}:delete`),
              color: ODS_BUTTON_COLOR.critical,
              onClick: () => {
                setDsRecordsData(props);
                setIsModalOpen(true);
              },
            },
          ]}
          id={`${props.publicKey}`}
          isCompact
          variant={ODS_BUTTON_VARIANT.ghost}
        />
      ),
      label: '',
    });
  }
  return columns;
};
