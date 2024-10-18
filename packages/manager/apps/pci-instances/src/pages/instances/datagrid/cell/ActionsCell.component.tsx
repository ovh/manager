import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { TInstance } from '@/data/hooks/instance/useInstances';
import {
  TActionsMenuItem,
  ActionsMenu,
} from '@/components/menu/ActionsMenu.component';
import { LoadingCell } from '@/components/datagrid/cell/LoadingCell.component';

type TActionsCellProps = {
  instance: TInstance;
  isLoading: boolean;
};

export const ActionsCell: FC<TActionsCellProps> = ({ isLoading, instance }) => {
  const { t } = useTranslation('list');
  const items: TActionsMenuItem[] = [
    {
      label: t('pci_instances_list_action_instance_details'),
      href: useHref(instance.id),
    },
  ];
  return (
    <LoadingCell isLoading={isLoading}>
      <ActionsMenu items={items} />
    </LoadingCell>
  );
};
