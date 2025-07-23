import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR, ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { deleteZimbraPlatformDomain, getZimbraPlatformDomainsQueryKey } from '@/data/api';
import { useAccounts, useDomain } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import queryClient from '@/queryClient';
import { CANCEL, CONFIRM, DELETE_DOMAIN } from '@/tracking.constants';

export const DeleteDomainModal = () => {
  const { t } = useTranslation(['domains', 'common', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const { trackClick, trackPage } = useOvhTracking();
  const { platformId, domainId } = useParams();
  const { data: domain, isLoading: isDomainLoading } = useDomain({
    domainId,
  });
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts({
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
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t('common:delete_success_message')}</OdsText>,
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
    onSettled: async () => {
      await queryClient.invalidateQueries({
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
      heading={t('common:delete_domain')}
      type={ODS_MODAL_COLOR.critical}
      onDismiss={onClose}
      isLoading={isDomainLoading || isAccountsLoading}
      isOpen
      primaryLabel={t(`${NAMESPACES.ACTIONS}:delete`)}
      primaryButtonTestId="delete-btn"
      isPrimaryButtonLoading={isSending}
      isPrimaryButtonDisabled={accounts?.length > 0 || !domainId}
      onPrimaryButtonClick={handleDeleteClick}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={handleCancelClick}
    >
      <>
        <OdsText preset={ODS_TEXT_PRESET.span} className="mb-4">
          <Trans
            t={t}
            i18nKey={'zimbra_domains_delete_modal_content'}
            values={{
              domain: domain?.currentState.name,
            }}
          />
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
};

export default DeleteDomainModal;
