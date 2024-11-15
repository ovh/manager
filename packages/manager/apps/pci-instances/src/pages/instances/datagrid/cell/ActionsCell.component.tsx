import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import {
  TActionsMenuItem,
  ActionsMenu,
} from '@/components/menu/ActionsMenu.component';
import { LoadingCell } from '@/components/datagrid/cell/LoadingCell.component';
import { DeepReadonly } from '@/types/utils.type';

type TActionsCellHref =
  | 'deleteHref'
  | 'autobackupHref'
  | 'detailsHref'
  | 'stopHref'
  | 'startHref';
export type TActionsCellHrefs = Record<TActionsCellHref, string>;

export type TActionsCellProps = DeepReadonly<{
  isLoading: boolean;
  hrefs: TActionsCellHrefs;
}>;

export const ActionsCell: FC<TActionsCellProps> = ({ isLoading, hrefs }) => {
  const { t } = useTranslation('list');
  const items: TActionsMenuItem[] = [
    {
      label: t('pci_instances_list_action_instance_details'),
      href: useHref(hrefs.detailsHref),
      group: 'general',
    },
    {
      label: t('pci_instances_list_action_autobackup'),
      href: hrefs.autobackupHref,
      group: 'general',
    },
    {
      label: t('pci_instances_list_action_start_instance'),
      href: useHref(hrefs.startHref),
      group: 'boot',
    },
    {
      label: t('pci_instances_list_action_stop_instance'),
      href: useHref(hrefs.stopHref),
      group: 'boot',
    },
    {
      label: t('pci_instances_list_action_delete_instance'),
      href: useHref(hrefs.deleteHref),
    },
  ];

  return (
    <LoadingCell isLoading={isLoading}>
      <ActionsMenu items={items} />
    </LoadingCell>
  );
};
