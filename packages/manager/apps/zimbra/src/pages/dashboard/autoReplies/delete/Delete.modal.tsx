import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation } from '@tanstack/react-query';
import { ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useGenerateUrl } from '@/hooks';
import { Modal } from '@/components';
import {
  CANCEL,
  CONFIRM,
  DELETE_AUTO_REPLY,
  EMAIL_ACCOUNT_DELETE_AUTO_REPLY,
} from '@/tracking.constants';

export const DeleteAutoReplyModal = () => {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation(['auto-replies', 'common']);
  const navigate = useNavigate();
  const { accountId, autoReplyId } = useParams();

  const trackingName = accountId
    ? EMAIL_ACCOUNT_DELETE_AUTO_REPLY
    : DELETE_AUTO_REPLY;

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
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('common:delete_success_message')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: trackingName,
      });
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('common:delete_error_message', {
            error: error?.response?.data?.message,
          })}
        </OdsText>,
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
      title={t('common:delete_auto_reply')}
      color={ODS_MODAL_COLOR.critical}
      onClose={onClose}
      isDismissible
      isOpen
      secondaryButton={{
        label: t('common:cancel'),
        onClick: handleCancelClick,
        testid: 'cancel-btn',
      }}
      primaryButton={{
        label: t('common:delete'),
        onClick: handleDeleteClick,
        isLoading: isSending,
        testid: 'delete-btn',
      }}
    >
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {t('zimbra_auto_replies_delete_modal_content')}
      </OdsText>
    </Modal>
  );
};

export default DeleteAutoReplyModal;
