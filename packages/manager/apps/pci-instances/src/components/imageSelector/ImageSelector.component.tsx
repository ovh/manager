import {
  Select,
  SelectContent,
  SelectControl,
  SelectValueChangeDetail,
  Text,
} from '@ovhcloud/ods-react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type TImageSelectorProps = {
  imageId: string;
  setImageId: (imageId: string) => void;
  isImageLoading: boolean;
  imageOptions: { label: string; value: string }[];
};

const ImageSelector = ({
  imageId,
  setImageId,
  isImageLoading,
  imageOptions,
}: TImageSelectorProps) => {
  const { t } = useTranslation('actions');

  const handleSelect = useCallback(
    (detail: SelectValueChangeDetail) => {
      setImageId(detail.value[0] ?? '');
    },
    [setImageId],
  );

  return (
    <Select
      aria-label="image-id-select"
      name="image"
      onValueChange={handleSelect}
      value={[imageId]}
      items={imageOptions}
      disabled={isImageLoading || !imageOptions.length}
    >
      <div className="my-4">
        <Text preset="label">
          {t('pci_instances_actions_rescue_start_instance_select_image_label')}
        </Text>
      </div>
      <SelectControl />
      <SelectContent />
    </Select>
  );
};

export default ImageSelector;
