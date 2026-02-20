import { FC } from 'react';
import { useFormatDiskDisplay } from '../../hooks/useFormatDiskDisplay';
import { TDiskViewModel } from '../../view-models/mappers/diskMapper';

export const DiskDisplayCell: FC<{ disk: TDiskViewModel }> = ({ disk }) => {
  const formatted = useFormatDiskDisplay(disk);
  return <>{formatted}</>;
};
