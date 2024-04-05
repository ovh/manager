import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsMessage,
  OsdsSpinner,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useMutation } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { handleClick } from '@/utils/ods-utils';
import {
  ButtonType,
  PageLocation,
  PageName,
  PageType,
  getClickProps,
} from '@/utils/tracking';
import {
  Task,
  dissociateVrackServices,
  dissociateVrackServicesQueryKey,
} from '@/api';

const sharedTrackingParams = {
  pageName: PageName.dissociate,
  pageType: PageType.popup,
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function Dissociate() {
  const { id, vrackId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('vrack-services');
  const { shell } = React.useContext(ShellContext);
  const closeModal = () => {
    shell.tracking.trackClick(
      getClickProps({
        ...sharedTrackingParams,
        actionType: 'exit',
        actions: ['cancel'],
      }),
    );
    navigate('..');
  };
  const { mutate: dissociateVs, isPending, error } = useMutation<
    ApiResponse<Task>,
    ApiError
  >({
    mutationFn: () =>
      dissociateVrackServices({
        vrack: vrackId,
        vrackServices: id,
      }),
    mutationKey: dissociateVrackServicesQueryKey(vrackId, id),
    onSuccess: () => {
      closeModal();
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
      {!!error && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error}>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('genericApiError', { error: error.response?.data?.message })}
          </OsdsText>
        </OsdsMessage>
      )}

      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        className="block mb-3"
      >
        {t('modalDissociateDescription')}
      </OsdsText>
      {isPending && <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />}
      <OsdsButton
        disabled={isPending || undefined}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.error}
        {...handleClick(closeModal)}
      >
        {t('modalCancelButton')}
      </OsdsButton>
      <OsdsButton
        disabled={isPending || undefined}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.error}
        {...handleClick(() => {
          shell.tracking.trackClick(
            getClickProps({
              ...sharedTrackingParams,
              actionType: 'action',
              actions: ['confirm'],
            }),
          );
          dissociateVs();
        })}
      >
        {t('modalConfirmButton')}
      </OsdsButton>
    </OsdsModal>
  );
}
