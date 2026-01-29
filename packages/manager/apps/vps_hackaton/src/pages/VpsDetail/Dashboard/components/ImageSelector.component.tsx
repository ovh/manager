import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Text, Radio } from '@ovhcloud/ods-react';
import { useAvailableImages } from '@/api/hooks/useVpsActions';
import { LoadingSkeleton } from '@/components/LoadingSkeleton/LoadingSkeleton.component';
import { selectImagesForView } from '../view-models/rebuild.view-model';
import type { TRebuildFormValues } from '../schema/rebuild.schema';

type TImageSelectorProps = {
  serviceName: string;
};

const TYPE_LABELS: Record<string, string> = {
  linux: 'vps_rebuild_image_linux',
  windows: 'vps_rebuild_image_windows',
  plesk: 'vps_rebuild_image_plesk',
  cpanel: 'vps_rebuild_image_cpanel',
  other: 'vps_rebuild_image_other',
};

export const ImageSelector = ({ serviceName }: TImageSelectorProps) => {
  const { t } = useTranslation('vps');
  const { setValue, watch } = useFormContext<TRebuildFormValues>();
  const selectedImageId = watch('imageId');

  const selectFn = useMemo(() => selectImagesForView, []);

  const { data: groupedImages, isLoading } = useAvailableImages(serviceName, {
    select: selectFn,
  });

  const handleImageSelect = (imageId: string) => {
    setValue('imageId', imageId, { shouldValidate: true });
  };

  if (isLoading) {
    return <LoadingSkeleton lines={5} />;
  }

  if (!groupedImages || Object.keys(groupedImages).length === 0) {
    return (
      <Text preset="paragraph" className="text-gray-600">
        {t('common_error')}
      </Text>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedImages).map(([type, images]) => (
        <div key={type}>
          <Text preset="heading-5" className="mb-3">
            {t(TYPE_LABELS[type] ?? type)}
          </Text>

          <div className="grid gap-2">
            {images.map((image) => (
              <label
                key={image.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                  selectedImageId === image.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Radio
                  name="imageId"
                  value={image.id}
                  isChecked={selectedImageId === image.id}
                  onChange={() => handleImageSelect(image.id)}
                />
                <div>
                  <Text preset="paragraph" className="font-medium">
                    {image.name}
                  </Text>
                  <Text preset="caption" className="text-gray-500">
                    {image.distribution}
                  </Text>
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
