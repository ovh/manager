import { FC, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { useNavigate } from 'react-router-dom';
import { DefaultError } from '@tanstack/react-query';
import { useNotifications } from '@ovh-ux/manager-react-components';
import ActionModal from '@/components/actionModal/ActionModal.component';
import { useImages } from '@/data/hooks/image/useImages';
import { useInstanceRescueAction } from '@/data/hooks/instance/action/useInstanceAction';
import { imagesRescueSelector } from '@/data/hooks/image/selector/image.selector';
import ImageSelector from '@/components/imageSelector/ImageSelector.component';
import { useProjectId } from '@/hooks/project/useProjectId';
import { isApiErrorResponse } from '@/utils';
import {
  useInstanceActionModal,
  useInstanceParams,
} from '@/pages/instances/action/hooks/useInstanceActionModal';
import { TSectionType } from '@/types/instance/action/action.type';

export type TRescueActionPageProps = {
  section: TSectionType;
};

const RescueActionPage: FC<TRescueActionPageProps> = ({ section }) => {
  const projectId = useProjectId();
  const { instanceId, region } = useInstanceParams();

  const { t } = useTranslation('actions');
  const navigate = useNavigate();
  const { addError, addInfo } = useNotifications();

  const { instance, isLoading } = useInstanceActionModal(
    region,
    instanceId,
    section,
  );

  const { data: images, isLoading: isImageLoading } = useImages({
    projectId,
    region,
    params: {
      visibility: 'public',
    },
    selectFn: (data) => imagesRescueSelector(data, t as TFunction),
  });

  const [imageId, setImageId] = useState<string>('');

  useEffect(() => {
    if (images && images.length > 0) {
      setImageId(images[0]?.value ?? '');
    }
  }, [images]);

  const isRescueMode = section === 'rescue/start';
  const snakeCaseSection = isRescueMode ? 'rescue_start' : 'rescue_end';

  const closeModal = () => navigate('..');

  const onSuccess = () => {
    if (isRescueMode) {
      addInfo(
        <Trans
          i18nKey={'pci_instances_actions_rescue_start_instance_info_message'}
          values={{
            name: instance?.name,
            ip: instance?.ip,
          }}
          t={t}
          components={[
            <code
              key="0"
              className="px-1 py-0.5 text-[90%] text-[#c7254e] bg-[#f9f2f4] rounded"
            />,
          ]}
        />,
        true,
      );
    } else {
      addInfo(
        t(
          `pci_instances_actions_${snakeCaseSection}_instance_success_message`,
          {
            name: instance?.name,
          },
        ),
        true,
      );
    }

    closeModal();
  };

  const onError = (rawError: unknown) => {
    const errorMessage = isApiErrorResponse(rawError)
      ? rawError.response?.data.message
      : (rawError as DefaultError).message;
    addError(
      t(`pci_instances_actions_${snakeCaseSection}_instance_error_message`, {
        name: instance?.name,
        error: errorMessage,
      }),
      true,
    );
  };

  const { mutationHandler, isPending } = useInstanceRescueAction(
    projectId,
    region,
    {
      onError,
      onSuccess,
    },
  );

  const handleInstanceAction = () => {
    if (instance)
      mutationHandler({ instance, imageId, isRescue: isRescueMode });
  };

  return (
    <ActionModal
      title={t(`pci_instances_actions_${snakeCaseSection}_instance_title`)}
      isPending={isPending}
      handleInstanceAction={handleInstanceAction}
      onModalClose={closeModal}
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

export default RescueActionPage;
