import { FC, useCallback, useEffect, useState } from 'react';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { DefaultError } from '@tanstack/react-query';
import {
  useBaseInstanceAction,
  useInstanceReinstallAction,
} from '@/data/hooks/instance/action/useInstanceAction';
import ActionModal, {
  TActionModalProps,
} from '@/components/actionModal/ActionModal.component';
import ImageSelector from '@/components/imageSelector/ImageSelector.component';
import { imagesRescueSelector } from '@/data/hooks/image/selector/image.selector';
import { useImages } from '@/data/hooks/image/useImages';
import { useProjectId } from '@/hooks/project/useProjectId';
import {
  useInstanceActionModal,
  useInstanceParams,
} from '@/pages/instances/action/hooks/useInstanceActionModal';
import { isApiErrorResponse } from '@/utils';

export type TReinstallActionPageProps = Omit<
  TActionModalProps,
  'children' | 'section' | 'handleInstanceAction' | 'isPending'
> & {
  projectId: string;
  onError: (error: unknown) => void;
  onSuccess: () => void;
};

const ReinstallActionImages: FC<TReinstallActionPageProps> = ({
  instance,
  projectId,
  onSuccess,
  onError,
  ...actionProps
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
    if (images?.[0]) {
      setImageId(images[0].value);
    }
  }, [images]);

  const handleInstanceAction = () => {
    if (instance) mutationHandler({ instance, imageId });
  };

  return (
    <ActionModal
      {...actionProps}
      isPending={isPending}
      handleInstanceAction={handleInstanceAction}
      instance={instance}
      section={'reinstall'}
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

const ReinstallActionBase: FC<TReinstallActionPageProps> = ({
  instance,
  projectId,
  onSuccess,
  onError,
  ...actionModalProps
}) => {
  const { mutationHandler, isPending } = useBaseInstanceAction(
    'reinstall',
    projectId,
    {
      onError,
      onSuccess,
    },
  );

  const handleInstanceAction = () => {
    if (instance) mutationHandler({ instance });
  };

  return (
    <ActionModal
      {...actionModalProps}
      section={'reinstall'}
      instance={instance}
      isPending={isPending}
      handleInstanceAction={handleInstanceAction}
    />
  );
};

const ReinstallActionPage: FC = () => {
  const projectId = useProjectId();
  const { instanceId, region } = useInstanceParams();

  const { t } = useTranslation('actions');
  const navigate = useNavigate();
  const { addError, addInfo } = useNotifications();

  const { instance, isLoading } = useInstanceActionModal(
    region,
    instanceId,
    'reinstall',
  );

  const closeModal = useCallback(() => navigate('..'), [navigate]);

  const onSuccess = useCallback(() => {
    addInfo(
      t(`pci_instances_actions_reinstall_instance_success_message`, {
        name: instance?.name,
      }),
      true,
    );

    closeModal();
  }, [closeModal, t, instance]);

  const onError = useCallback(
    (rawError: unknown) => {
      const errorMessage = isApiErrorResponse(rawError)
        ? rawError.response?.data.message
        : (rawError as DefaultError).message;

      addError(
        t(`pci_instances_actions_reinstall_instance_error_message`, {
          name: instance?.name,
          error: errorMessage,
        }),
        true,
      );
    },
    [closeModal, t, instance],
  );

  const modalProps = {
    title: t(`pci_instances_actions_reinstall_instance_title`),
    projectId,
    onModalClose: closeModal,
    instance,
    isLoading,
    onSuccess,
    onError,
  };

  return instance?.isImageDeprecated ? (
    <ReinstallActionImages {...modalProps} />
  ) : (
    <ReinstallActionBase {...modalProps} />
  );
};

export default ReinstallActionPage;
