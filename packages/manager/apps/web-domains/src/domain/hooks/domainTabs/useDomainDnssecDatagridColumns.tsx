import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, DataGridTextCell } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { DrawerActionEnum } from '@/domain/enum/drawerAction.enum';

interface UseDomainDnssecDatagridColumnsProps {
  readonly setDrawer: Dispatch<
    SetStateAction<{ isOpen: boolean; action?: DrawerActionEnum }>
  >;

  readonly setFormData: Dispatch<
    SetStateAction<{
      keyTag: string;
      flag: string;
      algorithm: string;
      publicKey: string;
    }>
  >;
}

export const useDomainDnssecDatagridColumns = ({
  setDrawer,
  setFormData,
}: UseDomainDnssecDatagridColumnsProps) => {
  const { t } = useTranslation('domain');
  const columns = [
    {
      id: 'keyTag',
      cell: () => <DataGridTextCell>32456</DataGridTextCell>,
      label: t('domain_DNSSEC_table_header_keyTag'),
    },
    {
      id: 'flag',
      cell: () => (
        <DataGridTextCell>257 - Key Signing Key (KSK) </DataGridTextCell>
      ),
      label: t('domain_DNSSEC_table_header_flag'),
    },
    {
      id: 'Algorithme',
      cell: () => <DataGridTextCell>8 - RSASHZA3457</DataGridTextCell>,
      label: t('domain_DNSSEC_table_header_algo'),
    },
    {
      id: 'publicKey',
      cell: () => (
        <DataGridTextCell>
          SreztregdhtfjghkvjbhlNcqityzfEZFjyfchgvkliYHELVBQSFHCJVD
        </DataGridTextCell>
      ),
      label: t('domain_DNSSEC_table_header_publicKey'),
    },
    {
      id: 'actions',
      cell: () => (
        <ActionMenu
          items={[
            {
              id: 1,
              label: t(`${NAMESPACES.ACTIONS}:modify`),
              onClick: () => {
                setDrawer({ isOpen: true, action: DrawerActionEnum.MODIFY });
              },
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
