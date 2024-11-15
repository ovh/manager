import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation } from '@tanstack/react-query';
import {
  ODS_BUTTON_VARIANT,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useGenerateUrl } from '@/hooks';
import Modal from '@/components/Modals/Modal';

export default function ModalDeleteAutoReply() {
  const { t } = useTranslation('autoReplies/delete');
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  delete params.deleteAutoReplyId;

  const deleteAutoReplyId = searchParams.get('deleteAutoReplyId');

  const { addError, addSuccess } = useNotifications();

  const goBackUrl = useGenerateUrl('..', 'path', params);
  const onClose = () => navigate(goBackUrl);

  const { mutate: deleteAutoReply, isPending: isSending } = useMutation({
    mutationFn: (autoReplyId: string) => {
      // call api
      return Promise.resolve(autoReplyId);
    },
    onSuccess: () => {
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_auto_replies_delete_success_message')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_auto_replies_delete_error_message', {
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
    deleteAutoReply(deleteAutoReplyId);
  };

  return (
    <Modal
      title={t('zimbra_auto_replies_delete_modal_title')}
      color={ODS_MODAL_COLOR.critical}
      onClose={onClose}
      isDismissible
      isOpen
      secondaryButton={{
        label: t('zimbra_auto_replies_delete_cancel'),
        action: onClose,
        testid: 'cancel-btn',
        variant: ODS_BUTTON_VARIANT.outline,
      }}
      primaryButton={{
        label: t('zimbra_auto_replies_delete_cta'),
        action: handleDeleteClick,
        isDisabled: !deleteAutoReplyId,
        isLoading: isSending,
        testid: 'delete-btn',
      }}
    >
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
        {t('zimbra_auto_replies_delete_modal_content')}
      </OdsText>
    </Modal>
  );
}
