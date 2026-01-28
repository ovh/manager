import { useMemo } from 'react';
import { Divider, Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { ImageHelper } from './distributionImage/ImageHelper.component';
import DistributionImageType from './distributionImage/DistributionImageType.component';
import DistributionImageVariants from './distributionImage/DistributionImageVariants.component';
import DistributionVersionList from './distributionImage/DistributionVersionList.component';
import { useProjectId } from '@/hooks/project/useProjectId';
import { useFormContext, useWatch } from 'react-hook-form';
import { deps } from '@/deps/deps';
import {
  selectImages,
  emptyResult,
  selectEligibleBackups,
  selectFlavorBackupConstraints,
} from '../view-models/imagesViewModel';
import { TInstanceCreationForm } from '../CreateInstance.schema';
import { useBackups } from '@/data/hooks/backups/useBackups';
import { useInstancesCatalogWithSelect } from '@/data/hooks/catalog/useInstancesCatalogWithSelect';

type TDistributionImageProps = {
  microRegion: string;
};

const DistributionImage = ({ microRegion }: TDistributionImageProps) => {
  const projectId = useProjectId();
  const { control } = useFormContext<TInstanceCreationForm>();
  const { t } = useTranslation('creation');
  const [
    distributionImageType,
    distributionImageVariantId,
    flavorId,
  ] = useWatch({
    control,
    name: ['distributionImageType', 'distributionImageVariantId', 'flavorId'],
  });

  const flavorBackupConstraintsSelect = useMemo(
    () => selectFlavorBackupConstraints(flavorId),
    [flavorId],
  );

  const {
    data: flavorBackupConstraints = null,
  } = useInstancesCatalogWithSelect({
    select: flavorBackupConstraintsSelect,
  });

  const selectBackups = useMemo(
    () => selectEligibleBackups(flavorBackupConstraints),
    [flavorBackupConstraints],
  );

  const { data: eligibleBackups } = useBackups(
    microRegion,
    {
      select: selectBackups,
      enabled: distributionImageType === 'backups' && !!flavorBackupConstraints,
    },
    { limit: 100 },
  );

  const { images: imageVariants, versions } = useMemo(() => {
    if (distributionImageType === 'backups') {
      return eligibleBackups ?? emptyResult;
    }

    return selectImages(deps)({
      projectId,
      selectedImageType: distributionImageType,
      microRegion,
      regionalizedFlavorId: flavorId,
      distributionImageVariantId,
    });
  }, [
    distributionImageType,
    flavorId,
    microRegion,
    projectId,
    distributionImageVariantId,
    eligibleBackups,
  ]);

  return (
    <section>
      <Divider spacing="64" />
      <div className="flex items-center space-x-4">
        <Text preset="heading-3">
          {t('pci_instance_creation_select_image_title')}
        </Text>
        <ImageHelper />
      </div>
      <DistributionImageType
        flavorBackupConstraints={flavorBackupConstraints}
      />
      {!!imageVariants.length && (
        <DistributionImageVariants variants={imageVariants} />
      )}
      {!!versions.length && <DistributionVersionList versions={versions} />}
    </section>
  );
};

export default DistributionImage;
