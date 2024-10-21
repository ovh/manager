import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_COLOR_HUE,
} from '@ovhcloud/ods-common-theming';
import { ODS_INPUT_TYPE } from '@ovhcloud/ods-components';
import {
  OsdsFormField,
  OsdsInput,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
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
  } = useOrganizationList();

  const { addError, addSuccess } = useNotifications();

  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);

  const { mutate: handleEditDomain, isPending: isSending } = useMutation({
    mutationFn: () =>
      putZimbraDomain(platformId, detailDomain.id, {
        organizationId: selectedOrganization,
      }),
    onSuccess: () => {
      addSuccess(
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          hue={ODS_THEME_COLOR_HUE._500}
        >
          {t('zimbra_domain_edit_success_message')}
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
          {t('zimbra_domain_edit_error_message', {
            error: error?.response?.data?.message,
          })}
        </OsdsText>,
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

  useEffect(() => {
    if (detailDomain && organizationsList) {
      setSelectedOrganization(detailDomain.currentState.organizationId);
    }
  }, [detailDomain, organizationsList]);

  return (
    <Modal
      title={t('zimbra_domain_edit_modal_title')}
      color={ODS_THEME_COLOR_INTENT.info}
      onDismissible={onClose}
      dismissible={true}
      isLoading={isLoadingDomain || isLoadingOrganizations}
      primaryButton={{
        label: t('zimbra_domain_edit_confirm'),
        action: handleEditDomain,
        disabled:
          isSending ||
          detailDomain?.currentState?.organizationId === selectedOrganization,
        testid: 'edit-btn',
      }}
      secondaryButton={{
        label: t('zimbra_domain_edit_cancel'),
        action: onClose,
        disabled: isSending,
        testid: 'cancel-btn',
      }}
    >
      <>
        <OsdsFormField className="mt-5">
          <div slot="label">
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            >
              {t('zimbra_domain_edit_domain_label')}
            </OsdsText>
          </div>
          <OsdsInput
            type={ODS_INPUT_TYPE.text}
            disabled={true}
            value={detailDomain?.currentState?.name}
            data-testid="input-domain"
          ></OsdsInput>
        </OsdsFormField>
        <OsdsFormField className="mt-5">
          <div slot="label">
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            >
              {t('zimbra_domain_edit_organization_label')}
            </OsdsText>
          </div>
          <OsdsSelect
            name="organization"
            value={selectedOrganization}
            onOdsValueChange={(e) =>
              setSelectedOrganization(e.detail.value as string)
            }
            data-testid="select-organization"
          >
            {organizationsList?.map((organization) => (
              <OsdsSelectOption value={organization.id} key={organization.id}>
                {organization.currentState.label}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
        </OsdsFormField>
      </>
    </Modal>
  );
}
