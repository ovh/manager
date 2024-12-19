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
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useDomains, usePlatform } from '@/hooks';
import {
  deleteZimbraPlatformOrganization,
  getZimbraPlatformOrganizationQueryKey,
} from '@/api/organization';
import Modal from '@/components/Modals/Modal';
import queryClient from '@/queryClient';
import { CANCEL, CONFIRM, DELETE_ORGANIZATION } from '@/tracking.constant';

export default function ModalDeleteOrganization() {
  const [searchParams] = useSearchParams();
  const { trackClick, trackPage } = useOvhTracking();
  const deleteOrganizationId = searchParams.get('deleteOrganizationId');
  const { t } = useTranslation('organizations/delete');
  const { platformId } = usePlatform();
  const { data: domains, isLoading } = useDomains({
    organizationId: deleteOrganizationId,
  });

  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();

  const onClose = () => navigate('..');

  const { mutate: deleteOrganization, isPending: isSending } = useMutation({
    mutationFn: (organizationId: string) =>
      deleteZimbraPlatformOrganization(platformId, organizationId),
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: DELETE_ORGANIZATION,
      });
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_organization_delete_success_message')}
        </OdsText>,
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
          {t('zimbra_organization_delete_error_message', {
            error: error?.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
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
    deleteOrganization(deleteOrganizationId);
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
      isOpen
      title={t('zimbra_organization_delete_modal_title')}
      color={ODS_MODAL_COLOR.critical}
      onClose={onClose}
      isDismissible
      isLoading={isLoading}
      secondaryButton={{
        label: t('zimbra_organization_delete_cancel'),
        action: handleCancelClick,
      }}
      primaryButton={{
        testid: 'delete-btn',
        variant: ODS_BUTTON_VARIANT.default,
        label: t('zimbra_organization_delete'),
        action: handleDeleteClick,
        isLoading: isSending || isLoading,
        isDisabled: domains?.length > 0 || !deleteOrganizationId,
      }}
    >
      <>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_organization_delete_modal_content')}
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
}
