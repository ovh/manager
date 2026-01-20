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
import { TImageTypeName } from '@/domain/entities/instancesCatalog';

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
      /**
       * TODO: remove this cast when image backups implementation will be done:
       * we have 4 image type options in select: linux, apps, windows, backups
       * but we will have 2 different selectors: 1 for the selected images type (linux, apps, windows)
       * and another one for backups images.
       *  */

      selectImages(deps)({
        projectId,
        selectedImageType: distributionImageType as TImageTypeName,
        microRegion,
        regionalizedFlavorId: flavorId,
        distributionImageVariantId,
      }),
    [
      distributionImageType,
      flavorId,
      microRegion,
      projectId,
      distributionImageVariantId,
    ],
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
      {!!imageVariants.length && (
        <DistributionImageVariants variants={imageVariants} />
      )}
      {!!versions.length && <DistributionVersionList versions={versions} />}
    </section>
  );
};

export default DistributionImage;
