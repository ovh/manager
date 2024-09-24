import React, { useEffect, useState } from 'react';
import {
  LinkType,
  Links,
  Subtitle,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  OsdsFormField,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
  OsdsButton,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_SPINNER_MODE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useMutation, useQuery } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';
import {
  useOrganization,
  useOrganizationList,
  usePlatform,
  useGenerateUrl,
} from '@/hooks';
import {
  DomainBodyParamsType,
  getDomainsZoneList,
  getDomainsZoneListQueryKey,
  getZimbraPlatformDomainsQueryKey,
  postZimbraDomain,
} from '@/api/domain';
import queryClient from '@/queryClient';

export default function AddDomain() {
  const { t } = useTranslation('domains/addDomain');
  const { platformId } = usePlatform();

  const { data, isLoading } = useOrganizationList();
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();

  const { data: organization } = useOrganization();
  const [selectedOrganization, setSelectedOrganization] = useState(
    organization?.id || '',
  );
  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);

  const { data: domains, isLoading: isLoadingDomain } = useQuery({
    queryKey: getDomainsZoneListQueryKey,
    queryFn: () => getDomainsZoneList(),
  });

  const [selectedDomainName, setSelectedDomainName] = useState('');

  const { mutate: addDomain, isPending: isSending } = useMutation({
    mutationFn: (params: DomainBodyParamsType) => {
      return postZimbraDomain(platformId, params);
    },
    onSuccess: () => {
      addSuccess(
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._100}
          level={ODS_TEXT_LEVEL.body}
        >
          {t('zimbra_domains_add_domain_success_message')}
        </OsdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._100}
          level={ODS_TEXT_LEVEL.body}
        >
          {t('zimbra_domains_add_domain_error_message', {
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

  const handleAddDomainClick = () => {
    const formData = {
      organizationId: selectedOrganization,
      name: selectedDomainName,
      autoConfigureMX: true,
    };
    addDomain(formData);
  };

  useEffect(() => {
    if (organization && !isLoading) {
      setSelectedOrganization(organization?.id);
    }
  }, [organization, isLoading]);

  const backLinkUrl = useGenerateUrl('..', 'href');

  return (
    <div
      className="flex flex-col items-start w-full md:w-3/4 space-y-4"
      data-testid="add-domain-page"
    >
      <Links
        type={LinkType.back}
        href={backLinkUrl}
        label={t('zimbra_domains_add_domain_cta_back')}
      />

      <Subtitle>{t('zimbra_domains_add_domain_title_select')}</Subtitle>

      <OsdsFormField className="w-full">
        <div slot="label">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._100}
            level={ODS_TEXT_LEVEL.heading}
          >
            {t('zimbra_domains_add_domain_organization')}
          </OsdsText>
        </div>
        <OsdsSelect
          name="organization"
          {...(isLoading || organization?.id ? { disabled: true } : {})}
          value={selectedOrganization}
          onOdsValueChange={(e) =>
            setSelectedOrganization(e.detail.value as string)
          }
          className="mt-2 w-1/2"
          data-testid="select-organization"
        >
          <span slot="placeholder">
            {t('zimbra_domains_add_domain_organization_select')}
          </span>
          {data?.map((item) => (
            <OsdsSelectOption key={item.id} value={item.id}>
              {item.currentState?.name}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
        {isLoading && (
          <div slot="helper">
            <OsdsSpinner
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_SPINNER_SIZE.sm}
              inline
            />
          </div>
        )}
      </OsdsFormField>

      {selectedOrganization && !isLoadingDomain && (
        <OsdsFormField className="w-full">
          <div slot="label">
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._100}
              level={ODS_TEXT_LEVEL.heading}
            >
              {t('zimbra_domains_add_domain_title')}
            </OsdsText>
          </div>
          <OsdsSelect
            data-testid="select-domain"
            name="domain"
            className="w-1/2"
            value={selectedDomainName}
            onOdsValueChange={(e) =>
              setSelectedDomainName(e.detail.value as string)
            }
            {...(isLoadingDomain ? { disabled: true } : {})}
          >
            <span slot="placeholder">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._100}
                level={ODS_TEXT_LEVEL.body}
              >
                {t('zimbra_domains_add_domain_select')}
              </OsdsText>
            </span>
            {domains?.map((domain: string) => (
              <OsdsSelectOption key={domain} value={domain}>
                {domain}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
          {isLoadingDomain && (
            <div slot="helper">
              <OsdsSpinner
                color={ODS_THEME_COLOR_INTENT.primary}
                size={ODS_SPINNER_SIZE.sm}
                inline
              />
            </div>
          )}
        </OsdsFormField>
      )}
      <OsdsFormField className="w-full">
        <OsdsSpinner
          mode={ODS_SPINNER_MODE.indeterminate}
          size={ODS_SPINNER_SIZE.sm}
          inline
          contrasted
        ></OsdsSpinner>
        <OsdsButton
          data-testid="add-domain-submit-btn"
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={handleAddDomainClick}
          className="mt-8 w-1/2"
          {...(!selectedOrganization || !selectedDomainName || isSending
            ? { disabled: true }
            : {})}
        >
          <span slot="start">
            {isSending && (
              <OsdsSpinner
                inline
                contrasted
                mode={ODS_SPINNER_MODE.indeterminate}
                size={ODS_SPINNER_SIZE.sm}
              ></OsdsSpinner>
            )}
          </span>
          {t('zimbra_domains_add_domain_cta_confirm')}
        </OsdsButton>
      </OsdsFormField>
    </div>
  );
}
