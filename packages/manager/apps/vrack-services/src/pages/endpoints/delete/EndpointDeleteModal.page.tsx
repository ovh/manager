import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
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
import {
  getEligibleManagedServiceListQueryKey,
  useUpdateVrackServices,
  useVrackService,
} from '@ovh-ux/manager-network-common';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import { PageName } from '@/utils/tracking';

export default function EndpointsDeleteModal() {
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.endpoints,
    NAMESPACES.ACTIONS,
    TRANSLATION_NAMESPACES.common,
  ]);
  const { id, urn } = useParams();
  const urnToDelete = urn?.replace('_', '/') || '';
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addSuccessMessage } = React.useContext(MessagesContext);
  const { trackPage, trackClick } = useOvhTracking();
  const { data: vs, isLoading } = useVrackService();

  const onClose = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'exit',
      actions: ['delete_endpoints', 'cancel'],
    });
    navigate('..');
  };

  const { deleteEndpoint, isPending, updateError, isError } = useUpdateVrackServices({
    id: id || '',
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: PageName.successDeleteEndpoint,
      });
      navigate('..');
      void queryClient.invalidateQueries({
        queryKey: getEligibleManagedServiceListQueryKey(id || ''),
      });
      addSuccessMessage(t('endpointDeleteSuccess', { id: id || '' }), {
        vrackServicesId: id,
      });
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: PageName.errorDeleteEndpoint,
      });
    },
  });

  return (
    <Modal
      defaultOpen={true}
      closeOnEscape={!isPending}
      closeOnInteractOutside={!isPending}
      onOpenChange={onClose}
    >
      <ModalContent>
        <ModalBody>
          <div className="mb-4 flex items-center">
            <Text className="mr-3 block flex-1" preset={TEXT_PRESET.heading4}>
              {t('modalDeleteServiceEndpointHeadline')}
            </Text>
          </div>

          {isLoading && (
            <div data-testid="spinner" className="my-5 flex justify-center">
              <Spinner size={SPINNER_SIZE.md} inline-block></Spinner>
            </div>
          )}
          {!isLoading && (
            <>
              <Text>{t('modalDeleteEndpointDescription')}</Text>
              {isError && (
                <Message className="mb-8" color={MESSAGE_COLOR.critical} dismissible={false}>
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
                    location: PageLocation.popup,
                    buttonType: ButtonType.button,
                    actionType: 'action',
                    actions: ['delete_endpoints', 'confirm'],
                  });
                  if (vs) {
                    deleteEndpoint({ vs, urnToDelete });
                  }
                }
              }}
              disabled={isPending || isLoading}
              loading={isPending || isLoading}
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
