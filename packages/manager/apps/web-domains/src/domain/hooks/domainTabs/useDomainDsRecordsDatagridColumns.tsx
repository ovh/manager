import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, DataGridTextCell } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { TDsDataInterface } from '@/domain/types/dnssecConfiguration';
import { useState } from 'react';

export const useDomainDsRecordsDatagridColumns = () => {
  const { t } = useTranslation('domain');
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
      id: 'flag',
      cell: (props: TDsDataInterface) => (
        <DataGridTextCell>
          {props.flags} - Key Signing Key (KSK)
        </DataGridTextCell>
      ),
      label: t('domain_dsrecords_table_header_flag'),
    },
    {
      id: 'algorithme',
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
            className={`${isPublicKeyExpanded && 'max-w-xs truncate'}`}
          >
            <span>{props.publicKey}</span>
          </div>
        </DataGridTextCell>
      ),
      label: t('domain_dsrecords_table_header_publicKey'),
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
