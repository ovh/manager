import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ODS_MESSAGE_COLOR,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation } from '@tanstack/react-query';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useAccounts, useGenerateUrl } from '@/hooks';
import {
  deleteZimbraPlatformDomain,
  getZimbraPlatformDomainsQueryKey,
} from '@/api/domain';
import Modal from '@/components/Modals/Modal';
import queryClient from '@/queryClient';
import { CANCEL, CONFIRM, DELETE_DOMAIN } from '@/tracking.constant';

export default function ModalDeleteDomain() {
  const { t } = useTranslation(['domains', 'common']);
  const navigate = useNavigate();
  const { trackClick, trackPage } = useOvhTracking();
  const { platformId, domainId } = useParams();
  const { data: accounts, isLoading } = useAccounts({
    domainId,
  });

  const { addError, addSuccess } = useNotifications();

  const goBackUrl = useGenerateUrl('../..', 'path');
  const onClose = () => navigate(goBackUrl);

  const { mutate: deleteDomain, isPending: isSending } = useMutation({
    mutationFn: (id: string) => {
      return deleteZimbraPlatformDomain(platformId, id);
    },
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: DELETE_DOMAIN,
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
        pageName: DELETE_DOMAIN,
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
      queryClient.invalidateQueries({
        queryKey: getZimbraPlatformDomainsQueryKey(platformId),
      });

      onClose();
    },
  });

  const handleDeleteClick = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [DELETE_DOMAIN, CONFIRM],
    });
    deleteDomain(domainId);
  };

  const handleCancelClick = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [DELETE_DOMAIN, CANCEL],
    });
    onClose();
  };

  return (
    <Modal
      title={t('common:delete_domain')}
      color={ODS_MODAL_COLOR.critical}
      onClose={onClose}
      isDismissible
      isLoading={isLoading}
      isOpen
      secondaryButton={{
        label: t('common:cancel'),
        onClick: handleCancelClick,
      }}
      primaryButton={{
        label: t('common:delete'),
        onClick: handleDeleteClick,
        isDisabled: accounts?.length > 0 || !domainId,
        isLoading: isSending,
        testid: 'delete-btn',
      }}
    >
      <>
        <OdsText preset={ODS_TEXT_PRESET.span} className="mb-4">
          {t('zimbra_domains_delete_modal_content')}
        </OdsText>
        {accounts?.length > 0 && (
          <OdsMessage
            className="mt-4"
            color={ODS_MESSAGE_COLOR.critical}
            isDismissible={false}
            data-testid="banner-message"
          >
            <div className="flex flex-col text-left ml-4">
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {t('zimbra_domains_delete_modal_message_disabled_part1')}
              </OdsText>
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {t('zimbra_domains_delete_modal_message_disabled_part2')}
              </OdsText>
            </div>
          </OdsMessage>
        )}
      </>
    </Modal>
  );
}
