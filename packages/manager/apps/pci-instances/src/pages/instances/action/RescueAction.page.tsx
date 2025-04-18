import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@datatr-ux/uxlib';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ActionModal from '@/components/actionModal/ActionModal.component';
import { useImages } from '@/data/hooks/image/useImages';
import { useInstanceRescueAction } from '@/data/hooks/instance/action/useInstanceAction';
import { TInstanceDto } from '@/types/instance/api.type';
import { imagesRescueSelector } from '@/data/hooks/image/selector/image.selector';

type TRescueActionSection = 'rescue/start' | 'rescue/end';

export type TRescueActionPageProps = {
  title: string;
  section: TRescueActionSection;
  projectId: string;
  onError: (error: unknown) => void;
  onSuccess: () => void;
  handleModalClose: () => void;
  instance?: TInstanceDto;
  isLoading: boolean;
};

export const RescueActionPage: FC<TRescueActionPageProps> = ({
  title,
  section,
  projectId,
  onError,
  onSuccess,
  handleModalClose,
  instance,
  isLoading,
}) => {
  const { t } = useTranslation('actions');
  const { data: images, isLoading: isImageLoading } = useImages({
    projectId,
    region: instance?.region ?? '',
    params: {
      visibility: 'public',
    },
    selectFn: (data) => imagesRescueSelector(data, t),
  });

  const [imageId, setImageId] = useState<string>('');

  useEffect(() => {
    if (images && images.length > 0) {
      setImageId(images[0].id);
    }
  }, [images]);

  const isRescueMode = section === 'rescue/start';

  const { mutationHandler, isPending } = useInstanceRescueAction(projectId, {
    onError,
    onSuccess,
  });

  const handleInstanceAction = () => {
    if (instance)
      mutationHandler({ instance, imageId, isRescue: isRescueMode });
  };

  const imageOptions = useMemo(
    () =>
      images?.map((image) => ({
        label: image.name,
        value: image.id,
      })),
    [images],
  );

  return (
    <ActionModal
      title={title}
      isPending={isPending}
      handleInstanceAction={handleInstanceAction}
      handleModalClose={handleModalClose}
      instanceName={instance?.name}
      section={section}
      isLoading={isLoading}
    >
      {isRescueMode && (
        <Select
          aria-label="image-id-select"
          name="image"
          onValueChange={setImageId}
          value={imageId}
          disabled={isImageLoading || !imageOptions?.length}
        >
          <p className="text-grey-500 my-2 font-bold text-xs">
            {t(
              'pci_instances_actions_rescue_start_instance_select_image_label',
            )}
          </p>
          <SelectTrigger
            className="text-foreground whitespace-nowrap overflow-hidden text-ellipsis"
            id="image"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {imageOptions?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex flex-col items-start text-primary-800">
                  <p className={`text-bold text-l`}>{option.label}</p>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </ActionModal>
  );
};
