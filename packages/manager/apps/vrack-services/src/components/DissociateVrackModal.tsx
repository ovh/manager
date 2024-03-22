import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsText,
  OsdsSpinner,
  OsdsModal,
  OsdsButton,
  OsdsMessage,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useMutation } from '@tanstack/react-query';
import { handleClick } from '@/utils/ods-utils';
import { Task } from '@/api';
import {
  dissociateVrackServices,
  dissociateVrackServicesQueryKey,
} from '@/api/vrack/delete';

export type DissociateVrackModalProps = {
  headline: string;
  description?: string;
  isModalOpen?: boolean;
  closeModal: () => void;
  isLoading?: boolean;
  dataTrackingPath?: string;
  dataTrackingConfirmValue?: string;
  dataTrackingCancelValue?: string;
  vrackId: string;
  vrackServicesId: string;
};

export const DissociateVrackModal: React.FC<DissociateVrackModalProps> = ({
  headline,
  description,
  isModalOpen,
  closeModal,
  isLoading,
  dataTrackingPath,
  dataTrackingConfirmValue,
  dataTrackingCancelValue,
  vrackId,
  vrackServicesId,
}) => {
  const { t } = useTranslation('vrack-services');
  const { trackPage, trackClick } = useOvhTracking();

  const { mutate: dissociateVs, isPending, isError, error } = useMutation<
    ApiResponse<Task>,
    ApiError
  >({
    mutationFn: () =>
      dissociateVrackServices({
        vrack: vrackId,
        vrackServices: vrackServicesId,
      }),
    mutationKey: dissociateVrackServicesQueryKey(vrackId),
    onSuccess: () => {
      closeModal();
    },
  });

  const close = () => {
    trackClick({ path: dataTrackingPath, value: dataTrackingCancelValue });
    closeModal();
  };

  React.useEffect(() => {
    if (isModalOpen && dataTrackingPath) {
      trackPage({
        path: dataTrackingPath,
        pageParams: { category: 'pop-up' },
      });
    }
  }, [isModalOpen, dataTrackingPath]);

  return (
    <OsdsModal
      dismissible
      color={ODS_THEME_COLOR_INTENT.error}
      headline={headline}
      masked={!isModalOpen || undefined}
      onOdsModalClose={close}
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
        {description}
      </OsdsText>
      {isLoading && <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />}
      <OsdsButton
        disabled={isLoading || undefined}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.error}
        {...handleClick(close)}
      >
        {t('modalCancelButton')}
      </OsdsButton>
      <OsdsButton
        disabled={isLoading || undefined}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.error}
        {...handleClick(() => {
          dissociateVs();
          trackClick({
            path: dataTrackingPath,
            value: dataTrackingConfirmValue,
          });
        })}
      >
        {t('modalConfirmButton')}
      </OsdsButton>
    </OsdsModal>
  );
};
