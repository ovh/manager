import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { MODAL_COLOR, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Modal, useFormatDate, useNotifications } from '@ovh-ux/muk';

import { SlotServiceRenewMode, getZimbraPlatformListQueryKey, putService } from '@/data/api';
import { useSlotWithService } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import queryClient from '@/queryClient';
import { CANCEL, CONFIRM, UNDO_CANCEL_SLOT } from '@/tracking.constants';
import { capitalize } from '@/utils';

export const UndoCancelSlotModal = () => {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation(['accounts', 'common', NAMESPACES.ACTIONS]);
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
        <Text preset={TEXT_PRESET.paragraph}>{t('common:cancel_slot_success_message')}</Text>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: UNDO_CANCEL_SLOT,
      });
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t('common:cancel_slot_error_message', {
            error: error?.response?.data?.message,
          })}
        </Text>,
        true,
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
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
      heading={t('common:undo_cancel_slot_title', {
        offer: capitalize(slotWithService?.offer),
      })}
      type={MODAL_COLOR.information}
      onOpenChange={onClose}
      loading={isLoading}
      open
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:confirm`),
        onClick: handleSlotUndoCancelClick,
        loading: isSending || isLoading,
        testId: 'primary-btn',
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: handleUndoCancelClick,
      }}
    >
      <>
        <Text
          preset={TEXT_PRESET.paragraph}
          data-testid="text-slot-undo-cancel-content"
          className="mb-4"
        >
          {t('zimbra_slot_undo_cancel_modal_content')}
        </Text>
        <Text
          preset={TEXT_PRESET.paragraph}
          data-testid="text-slot-undo-cancel-renew-date"
          className="mb-4"
        >
          {t('zimbra_slot_modal_renew_date', {
            renewDate: format({
              date: slotWithService?.service?.nextBillingDate,
              format: 'P',
            }),
          })}
        </Text>
        <Text
          preset={TEXT_PRESET.paragraph}
          data-testid="text-slot-undo-cancel-confirm"
          className="mb-4"
        >
          {t('zimbra_slot_undo_cancel_modal_confirm')}
        </Text>
      </>
    </Modal>
  );
};

export default UndoCancelSlotModal;
