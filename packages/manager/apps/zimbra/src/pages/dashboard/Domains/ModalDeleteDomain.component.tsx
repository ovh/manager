import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_COLOR,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation } from '@tanstack/react-query';
import { useAccountList, useGenerateUrl, usePlatform } from '@/hooks';
import {
  deleteZimbraPlatformDomain,
  getZimbraPlatformDomainsQueryKey,
} from '@/api/domain';
import Modal from '@/components/Modals/Modal';
import queryClient from '@/queryClient';

export default function ModalDeleteDomain() {
  const { t } = useTranslation('domains/delete');
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const deleteDomainId = searchParams.get('deleteDomainId');

  const { platformId } = usePlatform();
  const { data: accounts, isLoading } = useAccountList({
    domainId: deleteDomainId,
  });

  const { addError, addSuccess } = useNotifications();

  const goBackUrl = useGenerateUrl('..', 'path');
  const goBack = () => navigate(goBackUrl);

  const { mutate: deleteDomain, isPending: isSending } = useMutation({
    mutationFn: (domainId: string) => {
      return deleteZimbraPlatformDomain(platformId, domainId);
    },
    onSuccess: () => {
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_domain_delete_success_message')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_domain_delete_error_message', {
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

      goBack();
    },
  });

  const handleDeleteClick = () => {
    deleteDomain(deleteDomainId);
  };

  return (
    <Modal
      title={t('zimbra_domain_delete_modal_title')}
      color={ODS_MODAL_COLOR.critical}
      onClose={goBack}
      isDismissible={true}
      isLoading={isLoading}
      isOpen
      primaryButton={{
        label: t('zimbra_domain_delete'),
        variant: ODS_BUTTON_VARIANT.default,
        action: handleDeleteClick,
        isDisabled: accounts?.length > 0 || !deleteDomainId,
        isLoading: isSending,
        testid: 'delete-btn',
      }}
    >
      <>
        <OdsText preset={ODS_TEXT_PRESET.span} className="mb-4">
          {t('zimbra_domain_delete_modal_content')}
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
                {t('zimbra_domain_delete_modal_message_disabled_part1')}
              </OdsText>
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {t('zimbra_domain_delete_modal_message_disabled_part2')}
              </OdsText>
            </div>
          </OdsMessage>
        )}
      </>
    </Modal>
  );
}
