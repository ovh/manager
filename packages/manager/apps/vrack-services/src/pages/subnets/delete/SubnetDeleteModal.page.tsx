import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_VARIANT,
  Button,
  MESSAGE_COLOR,
  Message,
  MessageBody,
  MessageIcon,
  Modal,
  ModalBody,
  ModalContent,
  SPINNER_SIZE,
  Spinner,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useUpdateVrackServices, useVrackService } from '@ovh-ux/manager-network-common';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import type { TrackingClickParams } from '@ovh-ux/manager-react-shell-client';

import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import { PageName } from '@/utils/tracking';
import { getDisplayName } from '@/utils/vrack-services';

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
  const cidrToDelete = cidr?.replace('_', '/') || '';
  const { addSuccessMessage } = React.useContext(MessagesContext);
  const { trackPage, trackClick } = useOvhTracking();
  const navigate = useNavigate();

  const { data: vs, isLoading } = useVrackService();
  const { deleteSubnet, isPending, updateError, isError } = useUpdateVrackServices({
    id: id || '',
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: PageName.successDeleteSubnet,
      });
      navigate('..');
      addSuccessMessage(
        t('subnetDeleteSuccess', {
          id: getDisplayName(vs) || '',
          cidr: cidrToDelete,
        }),
        { vrackServicesId: id || '' },
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
          <div className="mb-4 flex items-center">
            <Text className="mr-3 block flex-1" preset={TEXT_PRESET.heading4}>
              {t('modalDeleteSubnetHeadline')}
            </Text>
          </div>
          {isLoading && (
            <div data-testid="spinner" className="my-5 flex justify-center">
              <Spinner size={SPINNER_SIZE.md} inline-block></Spinner>
            </div>
          )}
          {!isLoading && (
            <>
              <Text>{t('modalDeleteSubnetDescription')}</Text>
              {isError && (
                <Message dismissible={false} className="mb-8" color={MESSAGE_COLOR.critical}>
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
          <div className="flex flex-wrap justify-end gap-4">
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
                  if (vs) {
                    deleteSubnet({ vs, cidrToDelete });
                  }
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
