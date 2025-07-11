import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Modal } from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  getEligibleManagedServiceListQueryKey,
  useVrackService,
  useUpdateVrackServices,
} from '@ovh-ux/manager-network-common';
import { PageName } from '@/utils/tracking';
import { MessagesContext } from '@/components/feedback-messages/Messages.context';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

export default function EndpointsDeleteModal() {
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.endpoints,
    NAMESPACES.ACTIONS,
    TRANSLATION_NAMESPACES.common,
  ]);
  const { id, urn } = useParams();
  const urnToDelete = urn.replace('_', '/');
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

  const {
    deleteEndpoint,
    isPending,
    updateError,
    isError,
  } = useUpdateVrackServices({
    id,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: PageName.successDeleteEndpoint,
      });
      navigate('..');
      queryClient.invalidateQueries({
        queryKey: getEligibleManagedServiceListQueryKey(id),
      });
      addSuccessMessage(t('endpointDeleteSuccess', { id }), {
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
      isOpen
      onDismiss={onClose}
      onPrimaryButtonClick={() => {
        trackClick({
          location: PageLocation.popup,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['delete_endpoints', 'confirm'],
        });
        deleteEndpoint({ vs, urnToDelete });
      }}
      heading={t('modalDeleteServiceEndpointHeadline')}
      onSecondaryButtonClick={onClose}
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      primaryLabel={t('delete', { ns: NAMESPACES.ACTIONS })}
      isPrimaryButtonLoading={isPending}
      isLoading={isLoading}
    >
      <OdsText>{t('modalDeleteEndpointDescription')}</OdsText>
      {isError && (
        <OdsMessage
          className="block mb-8"
          color={ODS_MESSAGE_COLOR.critical}
          isDismissible={false}
        >
          {t('modalError', {
            error: updateError?.response?.data?.message,
            ns: TRANSLATION_NAMESPACES.common,
          })}
        </OdsMessage>
      )}
    </Modal>
  );
}
