import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import {
  useFormatDate,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useSlotWithService } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import { Modal } from '@/components';
import {
  getZimbraPlatformListQueryKey,
  putService,
  SlotServiceTerminationPolicy,
} from '@/data/api';
import queryClient from '@/queryClient';
import { CANCEL, CONFIRM, CANCEL_SLOT } from '@/tracking.constants';
import { capitalize } from '@/utils';

export const CancelSlotModal = () => {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation(['accounts', 'common']);
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const format = useFormatDate();
  const { slotWithService, isLoading } = useSlotWithService();

  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);

  const { mutate: cancelEmailAccount, isPending: isSending } = useMutation({
    mutationFn: (serviceId: number) => {
      return putService(serviceId, {
        terminationPolicy:
          SlotServiceTerminationPolicy.terminateAtExpirationDate,
      });
    },
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: CANCEL_SLOT,
      });
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('common:cancel_slot_success_message')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: CANCEL_SLOT,
      });
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('common:cancel_slot_error_message', {
            error: error?.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: getZimbraPlatformListQueryKey(),
      });

      onClose();
    },
  });

  const handleSlotCancelClick = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [CANCEL_SLOT, CONFIRM],
    });
    cancelEmailAccount(slotWithService?.service.id);
  };

  const handleCancelClick = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [CANCEL_SLOT, CANCEL],
    });
    onClose();
  };

  return (
    <Modal
      title={t('common:cancel_slot_title', {
        offer: capitalize(slotWithService?.offer),
      })}
      color={ODS_MODAL_COLOR.critical}
      onClose={onClose}
      isLoading={isLoading}
      isDismissible
      isOpen
      secondaryButton={{
        label: t('common:cancel_slot_refuse'),
        onClick: handleCancelClick,
      }}
      primaryButton={{
        label: t('common:cancel_slot'),
        onClick: handleSlotCancelClick,
        isLoading: isSending || isLoading,
        testid: 'primary-btn',
      }}
    >
      <>
        <OdsText
          preset={ODS_TEXT_PRESET.paragraph}
          data-testid="text-slot-cancel-content"
          className="mb-4"
        >
          {slotWithService?.email ? (
            <Trans
              t={t}
              i18nKey="zimbra_account_cancel_modal_content"
              values={{ email: slotWithService?.email }}
            />
          ) : (
            t('zimbra_slot_cancel_modal_content')
          )}
        </OdsText>
        <OdsText
          preset={ODS_TEXT_PRESET.span}
          data-testid="text-slot-cancel-renew-date"
          className="mb-4 font-bold"
        >
          {t('zimbra_slot_modal_renew_date', {
            renewDate: format({
              date: slotWithService?.service?.nextBillingDate,
              format: 'P',
            }),
          })}
        </OdsText>
        <OdsText
          preset={ODS_TEXT_PRESET.paragraph}
          data-testid="text-slot-cancel-confirm"
          className="mb-4"
        >
          {t('zimbra_slot_cancel_modal_confirm')}
        </OdsText>
      </>
    </Modal>
  );
};

export default CancelSlotModal;
