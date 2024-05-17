import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsMessage,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useQueryClient } from '@tanstack/react-query';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { handleClick } from '@ovhcloud/manager-components';
import {
  getDisplayName,
  getVrackServicesResourceListQueryKey,
  useDissociateVrack,
  useVrackService,
} from '@/api';
import { MessagesContext } from '@/components/Messages/Messages.context';
import { LoadingText } from '@/components/LoadingText';
import { PageName } from '@/utils/tracking';

const sharedTrackingParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function Dissociate() {
  const { id, vrackId } = useParams();
  const queryClient = useQueryClient();
  const { addSuccessMessage } = React.useContext(MessagesContext);
  const { data: vs } = useVrackService();
  const navigate = useNavigate();
  const { t } = useTranslation('vrack-services/dissociate');
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
        id,
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
    return closeModal();
  }

  return (
    <OsdsModal
      dismissible
      color={ODS_THEME_COLOR_INTENT.error}
      headline={t('modalDissociateHeadline')}
      onOdsModalClose={closeModal}
    >
      {!!isError && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error}>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('modalDissociateError', {
              error: error.response?.data?.message,
            })}
          </OsdsText>
        </OsdsMessage>
      )}

      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        className="block mb-8"
      >
        {t('modalDissociateDescription')}
      </OsdsText>
      {isPending && (
        <LoadingText
          title={t('modalDissociateVrackWaitMessage')}
          description={t('removeVrackServicesFromVrack')}
        />
      )}
      <OsdsButton
        disabled={isPending || undefined}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.error}
        {...handleClick(closeModal)}
      >
        {t('modalDissociateCancelButton')}
      </OsdsButton>
      <OsdsButton
        disabled={isPending || undefined}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.error}
        {...handleClick(() => {
          trackClick({
            ...sharedTrackingParams,
            actionType: 'action',
            actions: ['dissociate-vrack', 'confirm'],
          });
          dissociateVs();
        })}
      >
        {t('modalDissociateConfirmButton')}
      </OsdsButton>
    </OsdsModal>
  );
}
