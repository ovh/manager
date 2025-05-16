import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@datatr-ux/uxlib';
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
  return (
    <Select
      aria-label="image-id-select"
      name="image"
      onValueChange={setImageId}
      value={imageId}
      disabled={isImageLoading || !imageOptions?.length}
    >
      <p className="text-grey-500 my-2 font-bold text-xs">
        {t('pci_instances_actions_rescue_start_instance_select_image_label')}
      </p>
      <SelectTrigger
        className="text-foreground whitespace-nowrap overflow-hidden text-ellipsis"
        id="image"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {imageOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex flex-col items-start text-primary-800">
              <p className={`text-bold text-l`}>{option.label}</p>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ImageSelector;
