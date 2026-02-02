import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import {
  ICON_NAME,
  MESSAGE_COLOR,
  MODAL_COLOR,
  Message,
  MessageBody,
  MessageIcon,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Modal, useNotifications } from '@ovh-ux/muk';

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
        <Text preset={TEXT_PRESET.paragraph}>{t('common:delete_success_message')}</Text>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: DELETE_DOMAIN,
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
      type={MODAL_COLOR.critical}
      onOpenChange={onClose}
      loading={isDomainLoading || isAccountsLoading}
      open
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:delete`),
        loading: isSending,
        disabled: accounts?.length > 0 || !domainId,
        onClick: handleDeleteClick,
        testId: 'delete-btn',
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: handleCancelClick,
      }}
    >
      <>
        <Text preset={TEXT_PRESET.span} className="mb-4">
          <Trans
            t={t}
            i18nKey={'zimbra_domains_delete_modal_content'}
            values={{
              domain: domain?.currentState.name,
            }}
          />
        </Text>
        {accounts?.length > 0 && (
          <Message
            className="mt-4"
            color={MESSAGE_COLOR.critical}
            dismissible={false}
            data-testid="banner-message"
          >
            <MessageIcon name={ICON_NAME.hexagonExclamation} />
            <MessageBody>
              <div className="ml-4 flex flex-col text-left">
                <Text preset={TEXT_PRESET.paragraph}>
                  {t('zimbra_domains_delete_modal_message_disabled_part1')}
                </Text>
                <Text preset={TEXT_PRESET.paragraph}>
                  {t('zimbra_domains_delete_modal_message_disabled_part2')}
                </Text>
              </div>
            </MessageBody>
          </Message>
        )}
      </>
    </Modal>
  );
};

export default DeleteDomainModal;
