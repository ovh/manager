import { useTranslation } from 'react-i18next';

import { TMappedRestriction } from '@/api/hooks/useRestriction';

import RestrictionLine from './RestrictionLine.component';

type RestrictionColumnsProps = {
  disabled: boolean | undefined;
  onSave: (ip: string, index: number) => void;
  onDelete: (ip: string) => void;
  onClose: (ip: string, index: number) => void;
};

export const useRestrictionColumns = ({
  onSave,
  onDelete,
  onClose,
  disabled,
}: Readonly<RestrictionColumnsProps>) => {
  const { t } = useTranslation('restrictions');

  return [
    {
      id: 'allowed-clients',
      cell: (props: TMappedRestriction) => (
        <RestrictionLine
          ip={props.value}
          ipIndex={props.index}
          onSave={onSave}
          onDelete={onDelete}
          onClose={onClose}
          disabled={disabled}
        />
      ),
      label: t('kube_restrictions_allowed_clients'),
    },
  ];
};
