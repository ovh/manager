import { FC, useEffect, useState } from 'react';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useInstanceReinstallAction } from '@/data/hooks/instance/action/useInstanceAction';
import { TInstanceDto } from '@/types/instance/api.type';
import ActionModal from '@/components/actionModal/ActionModal.component';
import ImageSelector from '@/components/imageSelector/ImageSelector.component';
import { imagesRescueSelector } from '@/data/hooks/image/selector/image.selector';
import { useImages } from '@/data/hooks/image/useImages';

export type TReinstallActionPageProps = {
  title: string;
  section: 'reinstall';
  projectId: string;
  onError: (error: unknown) => void;
  onSuccess: () => void;
  onModalClose: () => void;
  instance?: TInstanceDto;
  isLoading: boolean;
};

const ReinstallActionPage: FC<TReinstallActionPageProps> = ({
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
  const [imageId, setImageId] = useState<string>('');
  const { data: images, isLoading: isImageLoading } = useImages({
    projectId,
    region: instance?.region ?? '',
    params: {
      visibility: 'public',
    },
    selectFn: (data) => imagesRescueSelector(data, t as TFunction),
  });

  const { mutationHandler, isPending } = useInstanceReinstallAction(projectId, {
    onError,
    onSuccess,
  });

  useEffect(() => {
    if (images && images.length > 0) {
      setImageId(images[0].value);
    }
  }, [images]);

  const handleInstanceAction = () => {
    if (instance) mutationHandler({ instance, imageId });
  };

  return (
    <ActionModal
      title={title}
      isPending={isPending}
      handleInstanceAction={handleInstanceAction}
      onModalClose={onModalClose}
      instance={instance}
      section={section}
      variant="primary"
      isLoading={isLoading}
    >
      <ImageSelector
        imageId={imageId}
        setImageId={setImageId}
        isImageLoading={isImageLoading}
        imageOptions={images ?? []}
      />
    </ActionModal>
  );
};

export default ReinstallActionPage;
