import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import ActionModal from '@/components/actionModal/ActionModal.component';
import { useImages } from '@/data/hooks/image/useImages';
import { useInstanceRescueAction } from '@/data/hooks/instance/action/useInstanceAction';
import { TInstanceDto } from '@/types/instance/api.type';
import { imagesRescueSelector } from '@/data/hooks/image/selector/image.selector';
import ImageSelector from '@/components/imageSelector/ImageSelector.component';

type TRescueActionSection = 'rescue/start' | 'rescue/end';

export type TRescueActionPageProps = {
  title: string;
  section: TRescueActionSection;
  projectId: string;
  onError: (error: unknown) => void;
  onSuccess: () => void;
  onModalClose: () => void;
  instance?: TInstanceDto;
  isLoading: boolean;
};

export const RescueActionPage: FC<TRescueActionPageProps> = ({
  title,
  section,
  projectId,
  onError,
  onSuccess,
  onModalClose,
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
    selectFn: (data) => imagesRescueSelector(data, t as TFunction),
  });

  const [imageId, setImageId] = useState<string>('');

  useEffect(() => {
    if (images && images.length > 0) {
      setImageId(images[0].value);
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

  return (
    <ActionModal
      title={title}
      isPending={isPending}
      handleInstanceAction={handleInstanceAction}
      onModalClose={onModalClose}
      instance={instance}
      section={section}
      isLoading={isLoading}
    >
      {isRescueMode && (
        <ImageSelector
          imageId={imageId}
          setImageId={setImageId}
          isImageLoading={isImageLoading}
          imageOptions={images ?? []}
        />
      )}
    </ActionModal>
  );
};
