import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BUTTON_VARIANT,
  MESSAGE_COLOR,
  TEXT_PRESET,
  BUTTON_COLOR,
  MODAL_COLOR,
  Button,
  Message,
  Modal,
  Text,
  ModalContent,
  ModalBody,
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  getVrackServicesResourceListQueryKey,
  useDissociateVrack,
  useVrackService,
} from '@ovh-ux/manager-network-common';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import { LoadingText } from '@/components/LoadingText.component';
import { PageName } from '@/utils/tracking';
import { getDisplayName } from '@/utils/vrack-services';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

const sharedTrackingParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function DissociateModal() {
  const { id, vrackId } = useParams();
  const queryClient = useQueryClient();
  const { addSuccessMessage } = React.useContext(MessagesContext);
  const { data: vs } = useVrackService();
  const navigate = useNavigate();
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.dissociate,
    NAMESPACES.ACTIONS,
  ]);
  const { trackClick, trackPage } = useOvhTracking();
  const closeModal = () => {
    trackClick({
      ...sharedTrackingParams,
      actionType: 'exit',
      actions: ['dissociate-vrack', 'cancel'],
    });
    navigate('..');
  };

  const { dissociateVs, isPending, error, isError } = useDissociateVrack({
    vrackServicesId: id,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: PageName.successDissociateVrack,
      });
      queryClient.invalidateQueries({
        queryKey: getVrackServicesResourceListQueryKey,
      });
      navigate('..');
      addSuccessMessage(
        t('vrackServicesDissociateSuccess', {
          vs: getDisplayName(vs),
          vrack: vrackId,
        }),
        { vrackServicesId: id },
      );
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: PageName.errorDissociateVrack,
      });
    },
  });

  if (!id || !vrackId) {
    closeModal();
    return <></>;
  }

  return (
    <Modal
      open
      closeOnEscape={!isPending}
      closeOnInteractOutside={!isPending}
      onOpenChange={closeModal}
    >
      <ModalContent dismissible={!isPending} color={MODAL_COLOR.critical}>
        <ModalBody>
          <Text className="block mb-4" preset={TEXT_PRESET.heading4}>
            {t('modalDissociateHeadline')}
          </Text>
          {!!isError && (
            <Message dismissible={false} color={MESSAGE_COLOR.critical}>
              <MessageIcon name="hexagon-exclamation" />
              <MessageBody>
                {t('modalDissociateError', {
                  error: error.response?.data?.message || error?.message,
                })}
              </MessageBody>
            </Message>
          )}

          <Text preset={TEXT_PRESET.paragraph} className="block mb-8">
            {t('modalDissociateDescription')}
          </Text>
          {isPending && (
            <LoadingText
              title={t('modalDissociateVrackWaitMessage')}
              description={t('removeVrackServicesFromVrack')}
            />
          )}
          <div className="flex justify-end gap-8">
            <Button
              type="button"
              variant={BUTTON_VARIANT.ghost}
              color={BUTTON_COLOR.critical}
              onClick={closeModal}
            >
              {t('cancel', { ns: NAMESPACES.ACTIONS })}
            </Button>
            <Button
              loading={isPending}
              type="button"
              color={BUTTON_COLOR.critical}
              onClick={() => {
                trackClick({
                  ...sharedTrackingParams,
                  actionType: 'action',
                  actions: ['dissociate-vrack', 'confirm'],
                });
                dissociateVs();
              }}
            >
              {t('confirm', { ns: NAMESPACES.ACTIONS })}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
