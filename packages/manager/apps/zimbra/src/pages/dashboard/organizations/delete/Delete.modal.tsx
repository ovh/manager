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

import {
  deleteZimbraPlatformOrganization,
  getZimbraPlatformOrganizationQueryKey,
} from '@/data/api';
import { useDomains, useOrganization } from '@/data/hooks';
import queryClient from '@/queryClient';
import { CANCEL, CONFIRM, DELETE_ORGANIZATION } from '@/tracking.constants';

export const DeleteOrganizationModal = () => {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation(['organizations', 'common', NAMESPACES.ACTIONS]);
  const { platformId, organizationId } = useParams();
  const { data: organization, isLoading: isOrganizationLoading } = useOrganization({
    organizationId,
  });
  const { data: domains, isLoading: isDomainsLoading } = useDomains({
    organizationId,
    gcTime: 0,
  });

  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();

  const onClose = () => navigate('../..');

  const { mutate: deleteOrganization, isPending: isSending } = useMutation({
    mutationFn: (id: string) => deleteZimbraPlatformOrganization(platformId, id),
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: DELETE_ORGANIZATION,
      });
      addSuccess(
        <Text preset={TEXT_PRESET.paragraph}>{t('common:delete_success_message')}</Text>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: DELETE_ORGANIZATION,
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
        queryKey: getZimbraPlatformOrganizationQueryKey(platformId),
      });

      onClose();
    },
  });

  const handleDeleteClick = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [DELETE_ORGANIZATION, CONFIRM],
    });
    deleteOrganization(organizationId);
  };

  const handleCancelClick = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [DELETE_ORGANIZATION, CANCEL],
    });
    onClose();
  };

  return (
    <Modal
      heading={t('common:delete_organization')}
      type={MODAL_COLOR.critical}
      onOpenChange={onClose}
      open
      loading={isOrganizationLoading || isDomainsLoading}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:delete`),
        testId: 'delete-btn',
        onClick: handleDeleteClick,
        loading: isSending || isOrganizationLoading || isDomainsLoading,
        disabled: domains?.length > 0 || !organizationId,
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: handleCancelClick,
      }}
    >
      <>
        <Text preset={TEXT_PRESET.paragraph}>
          <Trans
            t={t}
            i18nKey={'zimbra_organization_delete_modal_content'}
            values={{
              organization: organization?.currentState.label,
            }}
          />
        </Text>
        {domains?.length > 0 && (
          <Message
            color={MESSAGE_COLOR.critical}
            dismissible={false}
            className="mt-4"
            data-testid="banner-message"
          >
            <MessageIcon name={ICON_NAME.hexagonExclamation} />
            <MessageBody>
              <div className="ml-4 flex flex-col text-left">
                <Text preset={TEXT_PRESET.paragraph} className="font-bold">
                  {t('zimbra_organization_delete_modal_message_disabled_part1')}
                </Text>
                <Text preset={TEXT_PRESET.paragraph}>
                  {t('zimbra_organization_delete_modal_message_disabled_part2')}
                </Text>
              </div>
            </MessageBody>
          </Message>
        )}
      </>
    </Modal>
  );
};

export default DeleteOrganizationModal;
