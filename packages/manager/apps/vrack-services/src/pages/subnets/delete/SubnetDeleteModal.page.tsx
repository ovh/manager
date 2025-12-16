import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useOvhTracking,
  ButtonType,
  PageLocation,
  PageType,
  TrackingClickParams,
} from '@ovh-ux/manager-react-shell-client';
import {
  MESSAGE_COLOR,
  Text,
  Message,
  MessageBody,
  MessageIcon,
  Modal,
  ModalBody,
  ModalContent,
  TEXT_PRESET,
  BUTTON_VARIANT,
  Button,
  Spinner,
  SPINNER_SIZE,
} from '@ovhcloud/ods-react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  useVrackService,
  useUpdateVrackServices,
} from '@ovh-ux/manager-network-common';
import { PageName } from '@/utils/tracking';
import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import { getDisplayName } from '@/utils/vrack-services';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

const sharedTrackingParams: TrackingClickParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function SubnetDeleteModal() {
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.subnets,
    NAMESPACES.ACTIONS,
    TRANSLATION_NAMESPACES.common,
  ]);
  const { id, cidr } = useParams();
  const cidrToDelete = cidr.replace('_', '/');
  const { addSuccessMessage } = React.useContext(MessagesContext);
  const { trackPage, trackClick } = useOvhTracking();
  const navigate = useNavigate();

  const { data: vs, isLoading } = useVrackService();
  const {
    deleteSubnet,
    isPending,
    updateError,
    isError,
  } = useUpdateVrackServices({
    id,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: PageName.successDeleteSubnet,
      });
      navigate('..');
      addSuccessMessage(
        t('subnetDeleteSuccess', {
          id: getDisplayName(vs),
          cidr: cidrToDelete,
        }),
        { vrackServicesId: id },
      );
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: PageName.errorDeleteSubnet,
      });
    },
  });

  const onClose = () => {
    trackClick({
      ...sharedTrackingParams,
      actionType: 'exit',
      actions: ['delete_subnets', 'cancel'],
    });
    if (!isPending) {
      navigate('..');
    }
  };

  return (
    <Modal
      open
      closeOnEscape={!isPending}
      closeOnInteractOutside={!isPending}
      onOpenChange={onClose}
    >
      <ModalContent>
        <ModalBody>
          <div className="flex items-center mb-4">
            <Text className="block mr-3 flex-1" preset={TEXT_PRESET.heading4}>
              {t('modalDeleteSubnetHeadline')}
            </Text>
          </div>
          {isLoading && (
            <div data-testid="spinner" className="flex justify-center my-5">
              <Spinner size={SPINNER_SIZE.md} inline-block></Spinner>
            </div>
          )}
          {!isLoading && (
            <>
              <Text>{t('modalDeleteSubnetDescription')}</Text>
              {isError && (
                <Message
                  dismissible={false}
                  className="mb-8"
                  color={MESSAGE_COLOR.critical}
                >
                  <MessageIcon name="hexagon-exclamation" />
                  <MessageBody>
                    {t('modalError', {
                      error: updateError?.response?.data?.message,
                      ns: TRANSLATION_NAMESPACES.common,
                    })}
                  </MessageBody>
                </Message>
              )}
            </>
          )}
          <div className="flex justify-end flex-wrap gap-4">
            <Button
              data-testid={'secondary-button'}
              variant={BUTTON_VARIANT.ghost}
              onClick={() => {
                if (!isPending) {
                  onClose();
                }
              }}
              disabled={isPending}
              className="mt-4"
            >
              {t('cancel', { ns: NAMESPACES.ACTIONS })}
            </Button>
            <Button
              data-testid={'primary-button'}
              onClick={() => {
                if (!isPending) {
                  trackClick({
                    ...sharedTrackingParams,
                    actionType: 'action',
                    actions: ['delete_subnets', 'confirm'],
                  });
                  deleteSubnet({ vs, cidrToDelete });
                }
              }}
              disabled={isPending}
              loading={isPending}
              variant={BUTTON_VARIANT.default}
              className="mt-4"
            >
              {t('delete', { ns: NAMESPACES.ACTIONS })}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
