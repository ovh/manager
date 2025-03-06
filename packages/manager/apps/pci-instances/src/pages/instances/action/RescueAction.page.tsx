import { FC, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/react';
import Modal from '@/components/modal/Modal.component';
import { useInstanceRescueAction } from '@/data/hooks/instance/action/useInstanceAction';
import { TInstanceDto } from '@/types/instance/api.type';
import { ActionModalContent } from './modal/ActionModalContent.component';
import { useImages } from '@/data/hooks/image/useImages';

// TODO: Remove when api will be ready
const DEFAULT_RESCUE_ID = '0';
const DEFAULT_RESCUE = 'Distribution Rescue Made-in-OVH';

export const RescueActionPage: FC<{
  title: string;
  section: 'rescue/start';
  projectId: string;
  handleMutationError: () => void;
  handleMutationSuccess: () => void;
  handleModalClose: () => void;
  instance: TInstanceDto;
}> = ({
  title,
  section,
  projectId,
  handleMutationError,
  handleMutationSuccess,
  handleModalClose,
  instance,
}) => {
  const { t } = useTranslation('actions');
  const { data: images, isLoading } = useImages(projectId, {
    region: instance.region,
  });

  const [imageId, setImageId] = useState<string>(DEFAULT_RESCUE_ID);

  const { mutationHandler, isPending } = useInstanceRescueAction(projectId, {
    onError: handleMutationError,
    onSuccess: handleMutationSuccess,
  });

  const handleInstanceAction = () => mutationHandler({ instance, imageId });

  const imageOptions = images?.map((image) => ({
    label: image.name,
    value: image.id,
  }));

  return (
    <Modal
      title={title}
      isPending={isPending || isLoading}
      handleInstanceAction={handleInstanceAction}
      handleModalClose={handleModalClose}
    >
      <ActionModalContent type={section} instanceName={instance.name} />

      <Select
        aria-label="image-id-select"
        name={'image'}
        onValueChange={setImageId}
        value={imageId}
        disabled={isLoading}
      >
        <OsdsText>
          {t('pci_instances_actions_rescue_start_instance_select_image_label')}
        </OsdsText>
        <SelectTrigger
          className={`text-foreground whitespace-nowrap overflow-hidden text-ellipsis`}
          id="image"
        >
          <SelectValue placeholder="Select an image" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key={DEFAULT_RESCUE_ID} value={DEFAULT_RESCUE_ID}>
            <div className="flex flex-col items-start">
              <p className={`text-bold text-l`}>{DEFAULT_RESCUE}</p>
            </div>
          </SelectItem>
          {imageOptions?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex flex-col items-start">
                <p className={`text-bold text-l`}>{option.label}</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Modal>
  );
};
