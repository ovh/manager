import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, DataGridTextCell } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { TDsDataInterface } from '@/domain/types/dnssecConfiguration';
import { useState } from 'react';
import DatagridColumnStatus from '@/domain/components/DatagridColumns/DatagridColumnStatus';
import { domain_dsrecords_key_signing_ksk } from '@/domain/constants/dsRecords';

export const useDomainDsRecordsDatagridColumns = () => {
  const { t } = useTranslation(['domain', NAMESPACES.STATUS]);
  const [isPublicKeyExpanded, setisPublicKeyExpanded] = useState<boolean>(true);
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
    {
      id: 'actions',
      cell: () => (
        <ActionMenu
          items={[
            {
              id: 1,
              label: t(`${NAMESPACES.ACTIONS}:modify`),
            },
            {
              id: 2,
              label: t(`${NAMESPACES.ACTIONS}:delete`),
              color: ODS_BUTTON_COLOR.critical,
            },
          ]}
          id={'1'}
          isCompact
          variant={ODS_BUTTON_VARIANT.ghost}
        />
      ),
      label: '',
    },
  ];
  return columns;
};
