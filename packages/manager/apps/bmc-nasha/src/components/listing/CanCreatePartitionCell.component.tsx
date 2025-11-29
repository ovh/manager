import { useTranslation } from 'react-i18next';

type CanCreatePartitionCellProps = {
  canCreatePartition?: boolean;
};

export default function CanCreatePartitionCell({
  canCreatePartition,
}: CanCreatePartitionCellProps) {
  const { t } = useTranslation(['listing']);
  if (canCreatePartition === undefined || canCreatePartition === null) {
    return <>-</>;
  }
  return <>{t(`listing:columns.canCreatePartition_${canCreatePartition}`)}</>;
}
