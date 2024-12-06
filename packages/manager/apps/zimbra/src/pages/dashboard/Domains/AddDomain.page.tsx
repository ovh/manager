import React, { useCallback, useState } from 'react';
import {
  LinkType,
  Links,
  Subtitle,
  useNotifications,
  Clipboard,
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
import { GUIDES_LIST } from '@/guides.constants';
import { DomainType } from '@/api/domain/type';
import { DNS_CONFIG_TYPE, DnsRecordType, FEATURE_FLAGS } from '@/utils';
import GuideLink from '@/components/GuideLink';

export default function AddDomain() {
  const { t } = useTranslation('domains/addDomain');
  const navigate = useNavigate();

  const { addError, addSuccess } = useNotifications();

  const { platformId } = usePlatform();
  const { data: organization } = useOrganization();
  const { data: organizations, isLoading } = useOrganizationList();

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

  const [selectedRadioDomain, setSelectedRadioDomain] = useState(
    !FEATURE_FLAGS.DOMAIN_NOT_OVH ? 'ovhDomain' : '',
  );

  const [selectedDomainName, setSelectedDomainName] = useState('');
  const [cnameToCheck, setCnameToCheck] = useState('');
  const [
    selectedRadioConfigurationType,
    setSelectedRadioConfigurationType,
  ] = useState(
    !FEATURE_FLAGS.DOMAIN_DNS_CONFIGURATION ? DNS_CONFIG_TYPE.STANDARD : '',
  );

  const [expertConfigItemsState, setExpertConfigItemsState] = useState<
    Record<string, boolean>
  >({});

  const expertConfigItems = [
    {
      name: DnsRecordType.SRV,
      label: t('zimbra_domains_add_domain_configuration_expert_configure_srv'),
    },
    {
      name: DnsRecordType.MX,
      label: t('zimbra_domains_add_domain_configuration_expert_configure_mx'),
    },
    {
      name: DnsRecordType.SPF,
      label: t('zimbra_domains_add_domain_configuration_expert_configure_spf'),
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
    if (FEATURE_FLAGS.DOMAIN_DNS_CONFIGURATION) {
      setSelectedRadioConfigurationType('');
    }
    setExpertConfigItemsState({});
  };

  const ovhDomain = selectedRadioDomain === 'ovhDomain';

  const isExpertConfigurationSelected =
    selectedRadioConfigurationType === 'expertConfiguration';

  const handleRadioDomainChange = useCallback(
    (event: OdsRadioCustomEvent<OdsRadioChangeEventDetail>) => {
      const newValue = event.detail.value || '';
      setSelectedRadioDomain(newValue);
      setSelectedDomainName('');
    },
    [setSelectedRadioDomain],
  );

  const handleRadioConfigurationTypeChange = useCallback(
    (event: OdsRadioCustomEvent<OdsRadioChangeEventDetail>) => {
      const type = `${event.detail.value}` || '';
      setSelectedRadioConfigurationType(type);
      setExpertConfigItemsState({});
    },
    [setSelectedRadioConfigurationType],
  );

  const handleExpertConfigItemsChange = useCallback(
    (event: OdsCheckboxCustomEvent<OdsCheckboxChangeEventDetail>) => {
      setExpertConfigItemsState((prev) => ({
        ...prev,
        [event.target.name]: event.detail.checked,
      }));
    },
    [expertConfigItemsState],
  );

  const { mutate: addDomain, isPending: isSending } = useMutation({
    mutationFn: (params: DomainBodyParamsType) => {
      return postZimbraDomain(platformId, params);
    },
    onSuccess: (domain: DomainType) => {
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_domains_add_domain_success_message')}
        </OdsText>,
        true,
      );
      if (domain.currentState.expectedDNSConfig.ownership.cname) {
        setCnameToCheck(domain.currentState.expectedDNSConfig.ownership.cname);
      }
    },
    onError: (error: ApiError) => {
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_domains_add_domain_error_message', {
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

  const handleAddDomainClick = () => {
    const formData = {
      organizationId: selectedOrganization,
      name: selectedDomainName,
      autoConfigureMX: selectedRadioDomain !== 'externalDomain',
    };
    addDomain(formData);
  };

  const handleInputChange = (event: OdsInputChangeEvent) => {
    setSelectedDomainName(event.detail.value as string);
  };

  return (
    <div
      className="flex flex-col items-start w-full gap-4"
      data-testid="add-domain-page"
    >
      <Links
        iconAlignment={IconLinkAlignmentType.left}
        type={LinkType.back}
        href={backLinkUrl}
        color={ODS_LINK_COLOR.primary}
        label={t('zimbra_domains_add_domain_cta_back')}
      />
      {!cnameToCheck ? (
        <>
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
              className="mt-2 w-1/2"
              data-testid="select-organization"
              placeholder={t('zimbra_domains_add_domain_organization_select')}
            >
              {organizations?.map((item) => (
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
          {FEATURE_FLAGS.DOMAIN_NOT_OVH &&
            selectedOrganization &&
            !isLoadingDomain && (
              <OdsFormField className="w-full gap-4">
                <div className="flex leading-none gap-4">
                  <OdsRadio
                    value="ovhDomain"
                    inputId="ovhDomain"
                    name="radio-ovhDomain"
                    isChecked={selectedRadioDomain === 'ovhDomain'}
                    onOdsChange={(value) => handleRadioDomainChange(value)}
                  ></OdsRadio>
                  <label htmlFor="ovhDomain">
                    <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                      {t('zimbra_domains_add_domain_select_title')}
                    </OdsText>
                  </label>
                </div>
                <div className="flex leading-none gap-4">
                  <OdsRadio
                    value="externalDomain"
                    inputId="externalDomain"
                    name="radio-externalDomain"
                    isChecked={selectedRadioDomain === 'externalDomain'}
                    onOdsChange={(value) => handleRadioDomainChange(value)}
                  ></OdsRadio>
                  <label htmlFor="externalDomain">
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
          {selectedOrganization && selectedRadioDomain && (
            <OdsFormField className="w-full">
              <label htmlFor="form-field-input" slot="label">
                {t('zimbra_domains_add_domain_title')}
              </label>
              {ovhDomain && domains ? (
                <OdsSelect
                  className="w-1/2"
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
                    className="w-1/2"
                    name="ext-domain"
                  />
                  <OdsMessage
                    className="mt-6 w-3/5"
                    color={ODS_MESSAGE_COLOR.information}
                  >
                    <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                      {t(
                        'zimbra_domains_add_domain_warning_modification_domain',
                      )}
                    </OdsText>
                  </OdsMessage>
                </>
              )}
            </OdsFormField>
          )}
          {FEATURE_FLAGS.DOMAIN_DNS_CONFIGURATION &&
            selectedRadioDomain &&
            ovhDomain &&
            selectedDomainName && (
              <OdsFormField className="w-full space-y-5">
                <label htmlFor="form-field-input" slot="label">
                  {t('zimbra_domains_add_domain_configuration_title')}
                </label>
                <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                  {t('zimbra_domains_add_domain_configuration_description')}
                </OdsText>
                {[DNS_CONFIG_TYPE.STANDARD, DNS_CONFIG_TYPE.EXPERT].map(
                  (type) => (
                    <div key={type} className="flex leading-none gap-4">
                      <OdsRadio
                        id={type}
                        key={type}
                        name="domainConfigurationType"
                        value={`${type}Configuration`}
                        onOdsChange={(value) =>
                          handleRadioConfigurationTypeChange(value)
                        }
                        data-testid={`radio-config-${type}Configuration`}
                      ></OdsRadio>
                      <label htmlFor={type} className="flex flex-col w-full">
                        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                          {t(
                            `zimbra_domains_add_domain_configuration_choice_${type}`,
                          )}
                        </OdsText>
                        <OdsText preset={ODS_TEXT_PRESET.caption}>
                          {t(
                            `zimbra_domains_add_domain_configuration_choice_${type}_info`,
                          )}
                        </OdsText>
                      </label>
                    </div>
                  ),
                )}
              </OdsFormField>
            )}
          {isExpertConfigurationSelected && (
            <OdsFormField className="w-full space-y-5">
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                <Trans
                  t={t}
                  i18nKey="zimbra_domains_add_domain_configuration_expert_title"
                  values={{ domain: selectedDomainName }}
                />
              </OdsText>
              {expertConfigItems.map(({ name, label }) => (
                <div key={name} className="flex leading-none gap-4">
                  <OdsCheckbox
                    inputId={name}
                    key={name}
                    isChecked={expertConfigItemsState[name]}
                    name={name}
                    onOdsChange={handleExpertConfigItemsChange}
                  ></OdsCheckbox>
                  <label htmlFor={name}>
                    <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                      {label}
                    </OdsText>
                  </label>
                </div>
              ))}
            </OdsFormField>
          )}
        </>
      ) : (
        <>
          <Subtitle>
            {t('zimbra_domains_add_domain_configuration_cname_title')}
          </Subtitle>
          <OdsText className="mt-6" preset={ODS_TEXT_PRESET.paragraph}>
            {t('zimbra_domains_add_domain_configuration_cname_description')}
          </OdsText>
          <Clipboard value={cnameToCheck} />
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('zimbra_domains_add_domain_configuration_info')}
          </OdsText>
          <OdsMessage className="mt-6" color={ODS_MESSAGE_COLOR.information}>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('zimbra_domains_add_domain_configuration_part_1')}
              {t('zimbra_domains_add_domain_configuration_part_2')}
              <span className="block mt-2">
                <GuideLink
                  guide={GUIDES_LIST.cname_guide}
                  label={t(
                    'zimbra_domains_add_domain_configuration_guides_referee',
                  )}
                />
              </span>
            </OdsText>
          </OdsMessage>
          <OdsButton
            color={ODS_BUTTON_COLOR.primary}
            onClick={onClose}
            label={t('zimbra_domains_add_domain_cta_access_domains')}
          ></OdsButton>
        </>
      )}
      {!cnameToCheck && (
        <OdsFormField>
          <OdsButton
            data-testid="add-domain-submit-btn"
            color={ODS_BUTTON_COLOR.primary}
            onClick={handleAddDomainClick}
            isDisabled={
              !selectedOrganization ||
              !selectedDomainName ||
              (!selectedRadioConfigurationType && ovhDomain)
            }
            isLoading={isSending}
            label={t('zimbra_domains_add_domain_cta_confirm')}
          ></OdsButton>
        </OdsFormField>
      )}
    </div>
  );
}
