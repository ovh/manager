import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  ODS_INPUT_TYPE,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsFormField,
  OdsInput,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation } from '@tanstack/react-query';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  useDomain,
  useGenerateUrl,
  useOrganizationList,
  usePlatform,
} from '@/hooks';
import {
  getZimbraPlatformDomainsQueryKey,
  putZimbraDomain,
} from '@/api/domain';
import Modal from '@/components/Modals/Modal';
import queryClient from '@/queryClient';
import { CANCEL, CONFIRM, EDIT_DOMAIN } from '@/tracking.constant';

export default function ModalEditDomain() {
  const { t } = useTranslation(['domains', 'common']);
  const navigate = useNavigate();
  const { trackClick, trackPage } = useOvhTracking();
  const [searchParams] = useSearchParams();
  const editDomainId = searchParams.get('editDomainId');
  const [selectedOrganization, setSelectedOrganization] = useState('');

  const { platformId } = usePlatform();

  const { data: detailDomain, isLoading: isLoadingDomain } = useDomain({
    domainId: editDomainId,
  });
  const {
    data: organizationsList,
    isLoading: isLoadingOrganizations,
  } = useOrganizationList({ shouldFetchAll: true });

  const { addError, addSuccess } = useNotifications();

  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);

  const { mutate: editDomain, isPending: isSending } = useMutation({
    mutationFn: (organization: string) =>
      putZimbraDomain(platformId, detailDomain.id, {
        organizationId: organization,
      }),
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: EDIT_DOMAIN,
      });
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('common:edit_success_message')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: EDIT_DOMAIN,
      });
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('common:edit_error_message', {
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

  const handleCancelClick = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [EDIT_DOMAIN, CANCEL],
    });
    onClose();
  };

  const handleConfirmClick = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [EDIT_DOMAIN, CONFIRM],
    });
    editDomain(selectedOrganization);
  };

  useEffect(() => {
    if (detailDomain && organizationsList) {
      setSelectedOrganization(detailDomain.currentState.organizationId);
    }
  }, [detailDomain, organizationsList]);

  return (
    <Modal
      title={t('common:edit_domain')}
      color={ODS_MODAL_COLOR.information}
      onClose={onClose}
      isOpen
      isDismissible
      isLoading={isLoadingDomain || isLoadingOrganizations}
      primaryButton={{
        label: t('common:confirm'),
        action: handleConfirmClick,
        isDisabled:
          detailDomain?.currentState?.organizationId === selectedOrganization,
        isLoading: isSending,
        testid: 'edit-btn',
      }}
      secondaryButton={{
        label: t('common:cancel'),
        action: handleCancelClick,
        testid: 'cancel-btn',
      }}
    >
      <>
        <OdsFormField className="mt-5">
          <label htmlFor="domain" slot="label">
            {t('common:domain')}
          </label>
          <OdsInput
            type={ODS_INPUT_TYPE.text}
            isDisabled
            id="domain"
            name="domain"
            defaultValue={detailDomain?.currentState?.name}
            value={detailDomain?.currentState?.name}
            data-testid="input-domain"
          ></OdsInput>
        </OdsFormField>
        <OdsFormField className="mt-5">
          <label slot="label">{t('common:organization')}</label>
          <OdsSelect
            name="organization"
            value={selectedOrganization}
            onOdsChange={(e) => setSelectedOrganization(e.detail.value)}
            data-testid="select-organization"
          >
            {organizationsList?.map((organization) => (
              <option key={organization.id} value={organization.id}>
                {organization.currentState.label}
              </option>
            ))}
          </OdsSelect>
        </OdsFormField>
      </>
    </Modal>
  );
}
