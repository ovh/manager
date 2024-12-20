import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_VARIANT,
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

export default function ModalEditDomain() {
  const { t } = useTranslation('domains/edit');
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const editDomainId = searchParams.get('editDomainId');
  const [selectedOrganization, setSelectedOrganization] = useState('');

  const { platformId } = usePlatform();

  const { data: detailDomain, isLoading: isLoadingDomain } = useDomain(
    editDomainId,
  );
  const {
    data: organizationsList,
    isLoading: isLoadingOrganizations,
  } = useOrganizationList({ shouldFetchAll: true });

  const { addError, addSuccess } = useNotifications();

  const goBackUrl = useGenerateUrl('..', 'path');
  const goBack = () => navigate(goBackUrl);

  const { mutate: handleEditDomain, isPending: isSending } = useMutation({
    mutationFn: () =>
      putZimbraDomain(platformId, detailDomain.id, {
        organizationId: selectedOrganization,
      }),
    onSuccess: () => {
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_domain_edit_success_message')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_domain_edit_error_message', {
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

  useEffect(() => {
    if (detailDomain && organizationsList) {
      setSelectedOrganization(detailDomain.currentState.organizationId);
    }
  }, [detailDomain, organizationsList]);

  return (
    <Modal
      title={t('zimbra_domain_edit_modal_title')}
      color={ODS_MODAL_COLOR.information}
      onClose={goBack}
      isOpen
      isDismissible={true}
      isLoading={isLoadingDomain || isLoadingOrganizations}
      primaryButton={{
        label: t('zimbra_domain_edit_confirm'),
        action: handleEditDomain,
        variant: ODS_BUTTON_VARIANT.default,
        isDisabled:
          detailDomain?.currentState?.organizationId === selectedOrganization,
        isLoading: isSending,
        testid: 'edit-btn',
      }}
      secondaryButton={{
        label: t('zimbra_domain_edit_cancel'),
        action: goBack,
        testid: 'cancel-btn',
      }}
    >
      <>
        <OdsFormField className="mt-5">
          <label htmlFor="domain" slot="label">
            {t('zimbra_domain_edit_domain_label')}
          </label>
          <OdsInput
            type={ODS_INPUT_TYPE.text}
            isDisabled={true}
            id="domain"
            name="domain"
            defaultValue={detailDomain?.currentState?.name}
            value={detailDomain?.currentState?.name}
            data-testid="input-domain"
          ></OdsInput>
        </OdsFormField>
        <OdsFormField className="mt-5">
          <label slot="label">
            {t('zimbra_domain_edit_organization_label')}
          </label>
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
