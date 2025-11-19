import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

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
import { Modal, useNotifications } from '@ovh-ux/muk';

import { useGenerateUrl } from '@/hooks';
import {
  CANCEL,
  CONFIRM,
  DELETE_AUTO_REPLY,
  EMAIL_ACCOUNT_DELETE_AUTO_REPLY,
} from '@/tracking.constants';

export const DeleteAutoReplyModal = () => {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation(['auto-replies', 'common', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const { accountId, autoReplyId } = useParams();

  const trackingName = accountId ? EMAIL_ACCOUNT_DELETE_AUTO_REPLY : DELETE_AUTO_REPLY;

  const { addError, addSuccess } = useNotifications();

  const goBackUrl = useGenerateUrl('../..', 'path');
  const onClose = () => navigate(goBackUrl);

  const { mutate: deleteAutoReply, isPending: isSending } = useMutation({
    mutationFn: (id: string) => {
      // call api
      return Promise.resolve(id);
    },
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: trackingName,
      });
      addSuccess(
        <Text preset={TEXT_PRESET.paragraph}>{t('common:delete_success_message')}</Text>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: trackingName,
      });
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t('common:delete_error_message', {
            error: error?.response?.data?.message,
          })}
        </Text>,
        true,
      );
    },
    onSettled: () => {
      /* queryClient.invalidateQueries({
        queryKey: getZimbraPlatformAutoRepliesQueryKey(platformId),
      }); */

      onClose();
    },
  });

  const handleDeleteClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [trackingName, CONFIRM],
    });
    deleteAutoReply(autoReplyId);
  };

  const handleCancelClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [trackingName, CANCEL],
    });
    onClose();
  };

  return (
    <Modal
      heading={t('common:delete_auto_reply')}
      type={MODAL_COLOR.critical}
      onOpenChange={onClose}
      open
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:delete`),
        loading: isSending,
        onClick: handleDeleteClick,
        testId: 'delete-btn',
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: handleCancelClick,
        testId: 'cancel-btn',
      }}
    >
      <Text preset={TEXT_PRESET.paragraph}>{t('zimbra_auto_replies_delete_modal_content')}</Text>
    </Modal>
  );
};

export default DeleteAutoReplyModal;
