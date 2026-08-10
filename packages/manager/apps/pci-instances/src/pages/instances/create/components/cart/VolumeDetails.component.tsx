import { FC } from 'react';
import { Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { DiskDisplayCell } from './DiskDisplayCell.component';
import { TDiskViewModel } from '../../view-models/mappers/diskMapper';
import { selectLocalDisks } from '../../view-models/volumesViewModel';

type TVolumeDetails = {
  disks: TDiskViewModel[];
};

export const VolumeDetails: FC<TVolumeDetails> = ({ disks }) => {
  const { t } = useTranslation('creation');

  return (
    <div className="w-full">
      <Text
        preset="heading-6"
        className="block font-semibold text-[--ods-color-heading]"
      >
        {t('pci_instance_creation_volumes_local_name')}
      </Text>
      {selectLocalDisks(disks).map((disk) => (
        <Text key={disk.id} className="block text-[--ods-color-heading]">
          <DiskDisplayCell disk={disk} />
        </Text>
      ))}
    </div>
  );
};
