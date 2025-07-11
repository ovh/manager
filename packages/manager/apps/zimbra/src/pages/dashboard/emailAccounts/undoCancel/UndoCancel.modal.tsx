import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  SlotServiceRenewMode,
} from '@/data/api';
import queryClient from '@/queryClient';
import { CANCEL, CONFIRM, UNDO_CANCEL_SLOT } from '@/tracking.constants';
import { capitalize } from '@/utils';

export const UndoCancelSlotModal = () => {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation(['accounts', 'common']);
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const format = useFormatDate();

  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);
  const { slotWithService, isLoading } = useSlotWithService();

  const { mutate: cancelEmailAccount, isPending: isSending } = useMutation({
    mutationFn: (serviceId: number) => {
      return putService(serviceId, {
        renew: {
          mode: SlotServiceRenewMode.automatic,
        },
      });
    },
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: UNDO_CANCEL_SLOT,
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
        pageName: UNDO_CANCEL_SLOT,
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

  const handleSlotUndoCancelClick = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [UNDO_CANCEL_SLOT, CONFIRM],
    });
    cancelEmailAccount(slotWithService?.service.id);
  };

  const handleUndoCancelClick = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [UNDO_CANCEL_SLOT, CANCEL],
    });
    onClose();
  };

  return (
    <Modal
      title={t('common:undo_cancel_slot_title', {
        offer: capitalize(slotWithService?.offer),
      })}
      color={ODS_MODAL_COLOR.information}
      onClose={onClose}
      isLoading={isLoading}
      isDismissible
      isOpen
      secondaryButton={{
        label: t('common:cancel'),
        onClick: handleUndoCancelClick,
      }}
      primaryButton={{
        label: t('common:confirm'),
        onClick: handleSlotUndoCancelClick,
        isLoading: isSending || isLoading,
        testid: 'primary-btn',
      }}
    >
      <>
        <OdsText
          preset={ODS_TEXT_PRESET.paragraph}
          data-testid="text-slot-undo-cancel-content"
          className="mb-4"
        >
          {t('zimbra_slot_undo_cancel_modal_content')}
        </OdsText>
        <OdsText
          preset={ODS_TEXT_PRESET.paragraph}
          data-testid="text-slot-undo-cancel-renew-date"
          className="mb-4"
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
          data-testid="text-slot-undo-cancel-confirm"
          className="mb-4"
        >
          {t('zimbra_slot_undo_cancel_modal_confirm')}
        </OdsText>
      </>
    </Modal>
  );
};

export default UndoCancelSlotModal;
