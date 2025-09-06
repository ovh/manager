import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OdsButton,
  OdsMessage,
  OdsModal,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
  ODS_BUTTON_COLOR,
  ODS_MODAL_COLOR,
} from '@ovhcloud/ods-components';
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
    <OdsModal
      isOpen
      isDismissible
      color={ODS_MODAL_COLOR.critical}
      onOdsClose={closeModal}
    >
      <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.heading4}>
        {t('modalDissociateHeadline')}
      </OdsText>
      {!!isError && (
        <OdsMessage
          className="block"
          isDismissible={false}
          color={ODS_MESSAGE_COLOR.critical}
        >
          {t('modalDissociateError', {
            error: error.response?.data?.message || error?.message,
          })}
        </OdsMessage>
      )}

      <OdsText preset={ODS_TEXT_PRESET.paragraph} className="block mb-8">
        {t('modalDissociateDescription')}
      </OdsText>
      {isPending && (
        <LoadingText
          title={t('modalDissociateVrackWaitMessage')}
          description={t('removeVrackServicesFromVrack')}
        />
      )}
      <OdsButton
        slot="actions"
        type="button"
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_BUTTON_COLOR.critical}
        label={t('cancel', { ns: NAMESPACES.ACTIONS })}
        onClick={closeModal}
      />
      <OdsButton
        isLoading={isPending}
        slot="actions"
        type="button"
        color={ODS_BUTTON_COLOR.critical}
        onClick={() => {
          trackClick({
            ...sharedTrackingParams,
            actionType: 'action',
            actions: ['dissociate-vrack', 'confirm'],
          });
          dissociateVs();
        }}
        label={t('confirm', { ns: NAMESPACES.ACTIONS })}
      />
    </OdsModal>
  );
}
