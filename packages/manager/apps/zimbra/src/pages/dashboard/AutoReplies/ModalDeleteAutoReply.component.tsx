import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_COLOR_HUE,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation } from '@tanstack/react-query';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useGenerateUrl } from '@/hooks';
import Modal from '@/components/Modals/Modal';

export default function ModalDeleteDomain() {
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
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          hue={ODS_THEME_COLOR_HUE._500}
        >
          {t('zimbra_auto_replies_delete_success_message')}
        </OsdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          hue={ODS_THEME_COLOR_HUE._500}
        >
          {t('zimbra_auto_replies_delete_error_message', {
            error: error?.response?.data?.message,
          })}
        </OsdsText>,
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
    deleteAutoReply(deleteAutoReplyId as string);
  };

  return (
    <Modal
      title={t('zimbra_auto_replies_delete_modal_title')}
      color={ODS_THEME_COLOR_INTENT.error}
      onDismissible={onClose}
      dismissible={true}
      secondaryButton={{
        label: t('zimbra_auto_replies_delete_cancel'),
        action: onClose,
        testid: 'cancel-btn',
        color: ODS_THEME_COLOR_INTENT.error,
        variant: ODS_BUTTON_VARIANT.stroked,
      }}
      primaryButton={{
        label: t('zimbra_auto_replies_delete_cta'),
        action: handleDeleteClick,
        disabled: isSending || !deleteAutoReplyId,
        testid: 'delete-btn',
        color: ODS_THEME_COLOR_INTENT.error,
        variant: ODS_BUTTON_VARIANT.flat,
      }}
    >
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        hue={ODS_THEME_COLOR_HUE._500}
      >
        {t('zimbra_auto_replies_delete_modal_content')}
      </OsdsText>
    </Modal>
  );
}
