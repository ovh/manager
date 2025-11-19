import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import { MODAL_COLOR, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Modal, useFormatDate, useNotifications } from '@ovh-ux/muk';

import {
  SlotServiceTerminationPolicy,
  getZimbraPlatformListQueryKey,
  putService,
} from '@/data/api';
import { useSlotWithService } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import queryClient from '@/queryClient';
import { CANCEL, CANCEL_SLOT, CONFIRM } from '@/tracking.constants';
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
        terminationPolicy: SlotServiceTerminationPolicy.terminateAtExpirationDate,
      });
    },
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: CANCEL_SLOT,
      });
      addSuccess(
        <Text preset={TEXT_PRESET.paragraph}>{t('common:cancel_slot_success_message')}</Text>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: CANCEL_SLOT,
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
      heading={t('common:cancel_slot_title', {
        offer: capitalize(slotWithService?.offer),
      })}
      type={MODAL_COLOR.critical}
      onOpenChange={onClose}
      loading={isLoading}
      open
      primaryButton={{
        label: t('common:cancel_slot'),
        loading: isSending || isLoading,
        onClick: handleSlotCancelClick,
        testId: 'primary-btn',
      }}
      secondaryButton={{
        label: t(`common:cancel_slot_refuse`),
        onClick: handleCancelClick,
      }}
    >
      <>
        <Text
          preset={TEXT_PRESET.paragraph}
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
        </Text>
        <Text
          preset={TEXT_PRESET.span}
          data-testid="text-slot-cancel-renew-date"
          className="mb-4 font-bold"
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
          data-testid="text-slot-cancel-confirm"
          className="mb-4"
        >
          {t('zimbra_slot_cancel_modal_confirm')}
        </Text>
      </>
    </Modal>
  );
};

export default CancelSlotModal;
