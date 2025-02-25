import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TActionsMenuItem,
  ActionsMenu,
} from '@/components/menu/ActionsMenu.component';
import { LoadingCell } from '@/components/datagrid/cell/LoadingCell.component';
import { TInstance } from '@/types/instance/entity.type';

export type TActionsCellProps = {
  isLoading: boolean;
  instance: TInstance;
};

export const ActionsCell: FC<TActionsCellProps> = ({ isLoading, instance }) => {
  const { t } = useTranslation('list');

  const items: TActionsMenuItem[] = useMemo(
    () =>
      instance.actions.map((action) => ({
        link: action.link,
        label: t(`pci_instances_list_action_${action.name}`),
        isDisabled: !action.enabled,
      })),
    [instance.actions, t],
  );

  return (
    <LoadingCell isLoading={isLoading}>
      <ActionsMenu items={items} />
    </LoadingCell>
  );
};
