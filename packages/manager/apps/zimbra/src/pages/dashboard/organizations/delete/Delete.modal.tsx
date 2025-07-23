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
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t('common:delete_success_message')}</OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: DELETE_ORGANIZATION,
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
      type={ODS_MODAL_COLOR.critical}
      onDismiss={onClose}
      isOpen
      isLoading={isOrganizationLoading || isDomainsLoading}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:delete`)}
      primaryButtonTestId="delete-btn"
      onPrimaryButtonClick={handleDeleteClick}
      isPrimaryButtonLoading={isSending || isOrganizationLoading || isDomainsLoading}
      isPrimaryButtonDisabled={domains?.length > 0 || !organizationId}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={handleCancelClick}
    >
      <>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          <Trans
            t={t}
            i18nKey={'zimbra_organization_delete_modal_content'}
            values={{
              organization: organization?.currentState.label,
            }}
          />
        </OdsText>
        {domains?.length > 0 && (
          <OdsMessage
            color={ODS_MESSAGE_COLOR.critical}
            isDismissible={false}
            className="mt-4"
            data-testid="banner-message"
          >
            <div className="flex flex-col text-left ml-4">
              <OdsText preset={ODS_TEXT_PRESET.paragraph} className="font-bold">
                {t('zimbra_organization_delete_modal_message_disabled_part1')}
              </OdsText>
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {t('zimbra_organization_delete_modal_message_disabled_part2')}
              </OdsText>
            </div>
          </OdsMessage>
        )}
      </>
    </Modal>
  );
};

export default DeleteOrganizationModal;
