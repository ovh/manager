import { FC, useMemo } from 'react';
import { Divider, Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { ImageHelper } from './distributionImage/ImageHelper.component';
import DistributionImageType from './distributionImage/DistributionImageType.component';
import DistributionImageVariants from './distributionImage/DistributionImageVariants.component';
import DistributionVersionList from './distributionImage/DistributionVersionList.component';
import { useProjectId } from '@/hooks/project/useProjectId';
import { useFormContext, useWatch } from 'react-hook-form';
import { deps } from '@/deps/deps';
import { selectImages } from '../view-models/imagesViewModel';
import { TInstanceCreationForm } from '../CreateInstance.schema';

const DistributionImage: FC = () => {
  const projectId = useProjectId();
  const { control } = useFormContext<TInstanceCreationForm>();
  const { t } = useTranslation('creation');
  const [
    distributionImageType,
    distributionImageVariantId,
    microRegion,
    flavorId,
  ] = useWatch({
    control,
    name: [
      'distributionImageType',
      'distributionImageVariantId',
      'microRegion',
      'flavorId',
    ],
  });

  const { images: imageVariants, versions } = useMemo(
    () =>
      selectImages(deps)(
        projectId,
        distributionImageType,
        microRegion,
        flavorId,
      ),
    [distributionImageType, flavorId, microRegion, projectId],
  );

  const versionOptions = useMemo(
    () =>
      distributionImageVariantId
        ? versions.get(distributionImageVariantId)
        : [],
    [distributionImageVariantId, versions],
  );

  const showVersions = useMemo(
    () => !!versionOptions?.filter((version) => !version.disabled).length,
    [versionOptions],
  );

  return (
    <section>
      <Divider spacing="64" />
      <div className="flex items-center space-x-4">
        <Text preset="heading-3">
          {t('pci_instance_creation_select_image_title')}
        </Text>
        <ImageHelper />
      </div>
      <DistributionImageType />
      <DistributionImageVariants variants={imageVariants} />
      {versionOptions && showVersions && (
        <DistributionVersionList versions={versionOptions} />
      )}
    </section>
  );
};

export default DistributionImage;
