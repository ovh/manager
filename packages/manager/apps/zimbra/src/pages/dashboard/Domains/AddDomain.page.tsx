import React, { useCallback, useEffect, useState } from 'react';
import {
  LinkType,
  Links,
  Subtitle,
  useNotifications,
  IconLinkAlignmentType,
} from '@ovh-ux/manager-react-components';

import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  OdsFormField,
  OdsRadio,
  OdsSelect,
  OdsSpinner,
  OdsText,
  OdsButton,
  OdsInput,
  OdsMessage,
  OdsCheckbox,
} from '@ovhcloud/ods-components/react';

import {
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
  OdsCheckboxChangeEventDetail,
  OdsInputChangeEvent,
  OdsSelectChangeEventDetail,
  OdsCheckboxCustomEvent,
  OdsRadioCustomEvent,
  OdsSelectCustomEvent,
  ODS_SPINNER_COLOR,
  ODS_MESSAGE_COLOR,
  ODS_BUTTON_COLOR,
  OdsRadioChangeEventDetail,
  ODS_LINK_COLOR,
} from '@ovhcloud/ods-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
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
import { DomainType } from '@/api/domain/type';
import { DNS_CONFIG_TYPE, DnsRecordType } from '@/utils';
import { ADD_DOMAIN, CONFIRM, BACK_PREVIOUS_PAGE } from '@/tracking.constant';
import { ResourceStatus } from '@/api/api.type';

export enum DomainOwnership {
  OVH = 'ovhDomain',
  EXTERNAL = 'externalDomain',
}

const defaultExpertConfState = {
  [DnsRecordType.MX]: true,
  [DnsRecordType.SPF]: true,
  [DnsRecordType.DKIM]: true,
};

export default function AddDomain() {
  const { t } = useTranslation('domains/addDomain');
  const navigate = useNavigate();
  const { trackClick, trackPage } = useOvhTracking();
  const { addError, addSuccess } = useNotifications();

  const { platformId } = usePlatform();
  const { data: organization } = useOrganization();
  const { data: organizations, isLoading } = useOrganizationList({
    shouldFetchAll: true,
  });

  const [selectedOrganization, setSelectedOrganization] = useState(
    organization?.id || '',
  );

  const goBackUrl = useGenerateUrl('..', 'path');
  const onClose = () => navigate(goBackUrl);
  const backLinkUrl = useGenerateUrl('..', 'href');

  const { data: domains, isLoading: isLoadingDomain } = useQuery({
    queryKey: getDomainsZoneListQueryKey,
    queryFn: () => getDomainsZoneList(),
  });

  const [domainType, setDomainType] = useState(DomainOwnership.OVH);

  const [selectedDomainName, setSelectedDomainName] = useState('');
  const [domainToVerify, setDomainToVerify] = useState('');

  const verifyUrl = useGenerateUrl('../verify', 'path', {
    domainId: domainToVerify,
  });

  useEffect(() => {
    if (domainToVerify) {
      navigate(verifyUrl);
    }
  }, [domainToVerify]);

  const [configurationType, setConfigurationType] = useState(
    DNS_CONFIG_TYPE.STANDARD,
  );

  const [expertConfState, setExpertConfState] = useState<
    Record<string, boolean>
  >(defaultExpertConfState);

  const expertConfigItems = [
    {
      name: DnsRecordType.MX,
      label: t('zimbra_domains_add_domain_configuration_expert_configure_mx'),
    },
    {
      name: DnsRecordType.SPF,
      label: t('zimbra_domains_add_domain_configuration_expert_configure_spf'),
    },
    {
      name: DnsRecordType.SRV,
      label: t('zimbra_domains_add_domain_configuration_expert_configure_srv'),
      isDisabled: true,
    },
    {
      name: DnsRecordType.DKIM,
      label: t('zimbra_domains_add_domain_configuration_expert_configure_dkim'),
    },
  ];

  const handleOrganizationChange = (
    event: OdsSelectCustomEvent<OdsSelectChangeEventDetail>,
  ) => {
    setSelectedOrganization(event.detail.value);
  };
  const handleDomainOvhChange = (
    event: OdsSelectCustomEvent<OdsSelectChangeEventDetail>,
  ) => {
    setSelectedDomainName(event.detail.value);
    setConfigurationType(DNS_CONFIG_TYPE.STANDARD);
    setExpertConfState(defaultExpertConfState);
  };

  const ovhDomain = domainType === DomainOwnership.OVH;

  const isExpertConfSelected = configurationType === DNS_CONFIG_TYPE.EXPERT;

  const handleDomainTypeChange = useCallback(
    (event: OdsRadioCustomEvent<OdsRadioChangeEventDetail>) => {
      const newValue = event.detail.value as DomainOwnership;
      setDomainType(newValue);
      setSelectedDomainName('');
      setConfigurationType(DNS_CONFIG_TYPE.STANDARD);
      setExpertConfState(defaultExpertConfState);
    },
    [setDomainType],
  );

  const handleConfigurationTypeChange = useCallback(
    (event: OdsRadioCustomEvent<OdsRadioChangeEventDetail>) => {
      const type = `${event.detail.value}` || '';
      setConfigurationType(type);
      setExpertConfState(defaultExpertConfState);
    },
    [setConfigurationType],
  );

  const handleExpertConfChange = useCallback(
    (event: OdsCheckboxCustomEvent<OdsCheckboxChangeEventDetail>) => {
      setExpertConfState((prev) => ({
        ...prev,
        [event.target.name]: event.detail.checked,
      }));
    },
    [expertConfState],
  );

  const { mutate: addDomain, isPending: isSending } = useMutation({
    mutationFn: (params: DomainBodyParamsType) => {
      return postZimbraDomain(platformId, params);
    },
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: ADD_DOMAIN,
      });
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_domains_add_domain_success_message')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: ADD_DOMAIN,
      });
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_domains_add_domain_error_message', {
            error: error?.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
    onSettled: (domain: DomainType) => {
      queryClient.invalidateQueries({
        queryKey: getZimbraPlatformDomainsQueryKey(platformId),
      });

      if (!domain?.currentState?.expectedDNSConfig?.ownership?.cname) {
        onClose();
      } else {
        setDomainToVerify(domain?.id);
      }
    },
  });

  const handleAddDomainClick = () => {
    const formData = {
      organizationId: selectedOrganization,
      name: selectedDomainName,
      autoConfigureMX:
        (configurationType === DNS_CONFIG_TYPE.STANDARD && ovhDomain) ||
        (configurationType === DNS_CONFIG_TYPE.EXPERT &&
          expertConfState[DnsRecordType.MX]) ||
        false,
      autoConfigureSPF:
        (configurationType === DNS_CONFIG_TYPE.STANDARD && ovhDomain) ||
        (configurationType === DNS_CONFIG_TYPE.EXPERT &&
          expertConfState[DnsRecordType.SPF]) ||
        false,
      autoConfigureDKIM:
        (configurationType === DNS_CONFIG_TYPE.STANDARD && ovhDomain) ||
        (configurationType === DNS_CONFIG_TYPE.EXPERT &&
          expertConfState[DnsRecordType.DKIM]) ||
        false,
    };
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [ADD_DOMAIN, CONFIRM],
    });
    addDomain(formData);
  };

  const handleInputChange = (event: OdsInputChangeEvent) => {
    setSelectedDomainName(event.detail.value as string);
  };

  return (
    <div
      className="flex flex-col items-start w-full md:w-1/2 gap-4"
      data-testid="add-domain-page"
    >
      <Links
        iconAlignment={IconLinkAlignmentType.left}
        type={LinkType.back}
        href={backLinkUrl}
        onClickReturn={() => {
          trackClick({
            location: PageLocation.page,
            buttonType: ButtonType.button,
            actionType: 'navigation',
            actions: [ADD_DOMAIN, BACK_PREVIOUS_PAGE],
          });
        }}
        color={ODS_LINK_COLOR.primary}
        label={t('zimbra_domains_add_domain_cta_back')}
      />
      <Subtitle>{t('zimbra_domains_add_domain_title_select')}</Subtitle>
      <OdsFormField className="w-full mt-6">
        <label htmlFor="organization" slot="label">
          {t('zimbra_domains_add_domain_organization')}
        </label>
        <OdsSelect
          id="organization"
          name="organization"
          value={selectedOrganization}
          defaultValue=""
          onOdsChange={(event) => handleOrganizationChange(event)}
          isDisabled={isLoading || organization?.id}
          className="mt-2"
          data-testid="select-organization"
          placeholder={t('zimbra_domains_add_domain_organization_select')}
        >
          {organizations
            ?.filter((org) => org.resourceStatus === ResourceStatus.READY)
            .map((item) => (
              <option key={item.id} value={item.id}>
                {item.targetSpec?.name}
              </option>
            ))}
        </OdsSelect>
        {isLoading && (
          <div slot="helper">
            <OdsSpinner
              color={ODS_SPINNER_COLOR.primary}
              size={ODS_SPINNER_SIZE.sm}
            />
          </div>
        )}
      </OdsFormField>
      {selectedOrganization && !isLoadingDomain && (
        <OdsFormField className="w-full gap-4">
          <div className="flex leading-none gap-4">
            <OdsRadio
              value={DomainOwnership.OVH}
              inputId={DomainOwnership.OVH}
              name="radio-ovhDomain"
              isChecked={domainType === DomainOwnership.OVH}
              onOdsChange={(value) => handleDomainTypeChange(value)}
            ></OdsRadio>
            <label htmlFor={DomainOwnership.OVH}>
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {t('zimbra_domains_add_domain_select_title')}
              </OdsText>
            </label>
          </div>
          <div className="flex leading-none gap-4">
            <OdsRadio
              value={DomainOwnership.EXTERNAL}
              inputId={DomainOwnership.EXTERNAL}
              name="radio-externalDomain"
              isChecked={domainType === DomainOwnership.EXTERNAL}
              onOdsChange={(value) => handleDomainTypeChange(value)}
            ></OdsRadio>
            <label htmlFor={DomainOwnership.EXTERNAL}>
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {t('zimbra_domains_add_domain_input_title')}
              </OdsText>
            </label>
          </div>
          {isLoadingDomain && (
            <div slot="helper">
              <OdsSpinner
                color={ODS_SPINNER_COLOR.primary}
                size={ODS_SPINNER_SIZE.sm}
              />
            </div>
          )}
        </OdsFormField>
      )}
      {selectedOrganization && domainType && (
        <OdsFormField className="w-full">
          <label htmlFor="form-field-input" slot="label">
            {t('zimbra_domains_add_domain_title')}
          </label>
          {ovhDomain && domains ? (
            <OdsSelect
              name={'domain'}
              value={selectedDomainName}
              defaultValue=""
              data-testid="select-domain"
              onOdsChange={(
                event: OdsSelectCustomEvent<OdsSelectChangeEventDetail>,
              ) => handleDomainOvhChange(event)}
              placeholder={t('zimbra_domains_add_domain_select')}
            >
              {domains.map((domain: string) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </OdsSelect>
          ) : (
            <>
              <OdsInput
                type={ODS_INPUT_TYPE.text}
                value={selectedDomainName}
                onOdsChange={handleInputChange}
                defaultValue=""
                data-testid="input-external-domain"
                placeholder={t('zimbra_domains_add_domain_input')}
                name="ext-domain"
              />
              <OdsMessage
                isDismissible={false}
                className="mt-6"
                color={ODS_MESSAGE_COLOR.information}
              >
                <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                  {t('zimbra_domains_add_domain_warning_modification_domain')}
                </OdsText>
              </OdsMessage>
            </>
          )}
        </OdsFormField>
      )}
      {domainType && ovhDomain && selectedDomainName && (
        <OdsFormField className="w-full">
          <label htmlFor="form-field-input" slot="label">
            {t('zimbra_domains_add_domain_configuration_title')}
          </label>
          <OdsText className="mb-4" preset={ODS_TEXT_PRESET.paragraph}>
            {t('zimbra_domains_add_domain_configuration_description')}
          </OdsText>
          {[DNS_CONFIG_TYPE.STANDARD, DNS_CONFIG_TYPE.EXPERT].map((type) => (
            <div key={type} className="flex leading-none gap-4">
              <OdsRadio
                key={type}
                inputId={type}
                name="domainConfigurationType"
                value={type}
                isChecked={type === configurationType}
                onOdsChange={(value) => handleConfigurationTypeChange(value)}
                data-testid={`radio-config-${type}`}
              ></OdsRadio>
              <label htmlFor={type} className="flex flex-col w-full">
                <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                  {t(`zimbra_domains_add_domain_configuration_choice_${type}`)}
                </OdsText>
                <OdsText preset={ODS_TEXT_PRESET.caption}>
                  {t(
                    `zimbra_domains_add_domain_configuration_choice_${type}_info`,
                  )}
                </OdsText>
              </label>
            </div>
          ))}
        </OdsFormField>
      )}
      {isExpertConfSelected && (
        <OdsFormField className="w-full space-y-4">
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            <Trans
              t={t}
              i18nKey="zimbra_domains_add_domain_configuration_expert_title"
              values={{ domain: selectedDomainName }}
            />
          </OdsText>
          {expertConfigItems.map(({ name, label, isDisabled }) =>
            isDisabled ? null : (
              <div key={name} className="flex leading-none gap-4">
                <OdsCheckbox
                  inputId={name}
                  key={name}
                  isChecked={expertConfState[name]}
                  name={name}
                  onOdsChange={handleExpertConfChange}
                  isDisabled={isDisabled}
                ></OdsCheckbox>
                <label htmlFor={name}>
                  <OdsText preset={ODS_TEXT_PRESET.paragraph}>{label}</OdsText>
                </label>
              </div>
            ),
          )}
        </OdsFormField>
      )}
      <OdsFormField>
        <OdsButton
          data-testid="add-domain-submit-btn"
          color={ODS_BUTTON_COLOR.primary}
          onClick={handleAddDomainClick}
          isDisabled={
            !selectedOrganization ||
            !selectedDomainName ||
            (!configurationType && ovhDomain)
          }
          isLoading={isSending}
          label={t('zimbra_domains_add_domain_cta_confirm')}
        ></OdsButton>
      </OdsFormField>
    </div>
  );
}
