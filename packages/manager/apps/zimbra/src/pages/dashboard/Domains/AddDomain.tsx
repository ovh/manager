import React, { useCallback, useContext, useState } from 'react';
import {
  LinkType,
  Links,
  Subtitle,
  useNotifications,
  Clipboard,
} from '@ovh-ux/manager-react-components';

import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  OsdsFormField,
  OsdsRadio,
  OsdsRadioButton,
  OsdsRadioGroup,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
  OsdsButton,
  OsdsInput,
  OsdsMessage,
  OsdsLink,
  OsdsIcon,
  OsdsCheckboxButton,
  OsdsCheckbox,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_TYPE,
  ODS_RADIO_BUTTON_SIZE,
  ODS_SPINNER_MODE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OdsCheckboxCheckedChangeEventDetail,
  OdsInputValueChangeEvent,
  OdsSelectValueChangeEventDetail,
  OsdsCheckboxCustomEvent,
  OsdsRadioGroupCustomEvent,
  OsdsSelectCustomEvent,
} from '@ovhcloud/ods-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
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

export default function AddDomain() {
  const { t } = useTranslation('domains/addDomain');
  const navigate = useNavigate();
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  const { addError, addSuccess } = useNotifications();

  const { platformId } = usePlatform();
  const { data, isLoading } = useOrganizationList();
  const { data: organization } = useOrganization();
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

  const [selectedRadioDomain, setSelectedRadioDomain] = useState('');
  const [selectedDomainName, setSelectedDomainName] = useState('');
  const [cnameToCheck, setCnameToCheck] = useState('');
  const [
    selectedRadioConfigurationType,
    setSelectedRadioConfigurationType,
  ] = useState('');
  const [expertConfigItemsState, setExpertConfigItemsState] = useState({});

  const expertConfigItems = [
    {
      name: 'SRV',
      key: 'SRV',
      label: t('zimbra_domains_add_domain_configuration_expert_configure_srv'),
    },
    {
      name: 'MX',
      key: 'MX',
      label: t('zimbra_domains_add_domain_configuration_expert_configure_mx'),
    },
    {
      name: 'SPF',
      key: 'SPF',
      label: t('zimbra_domains_add_domain_configuration_expert_configure_spf'),
    },
    {
      name: 'DKIM',
      key: 'DKIM',
      label: t('zimbra_domains_add_domain_configuration_expert_configure_dkim'),
    },
  ];

  const handleOrganizationChange = (
    event: OsdsSelectCustomEvent<OdsSelectValueChangeEventDetail>,
  ) => {
    setSelectedOrganization(event.detail.value);
  };
  const handleDomainOvhChange = (
    event: OsdsSelectCustomEvent<OdsSelectValueChangeEventDetail>,
  ) => {
    setSelectedDomainName(event.detail.value as string);
    setSelectedRadioConfigurationType('');
    setExpertConfigItemsState({});
  };

  const ovhDomain = selectedRadioDomain === 'ovhDomain';

  const isExpertConfigurationSelected =
    selectedRadioConfigurationType === 'expertConfiguration';

  const handleRadioDomainChange = useCallback(
    (
      event: OsdsRadioGroupCustomEvent<{
        newValue?: string;
        previousValue?: string;
      }>,
    ) => {
      const type = `${event.detail.newValue}` || '';
      setSelectedRadioDomain(type);
      setSelectedDomainName('');
    },
    [setSelectedRadioDomain],
  );

  const handleRadioConfigurationTypeChange = useCallback(
    (
      event: OsdsRadioGroupCustomEvent<{
        newValue?: string;
        previousValue?: string;
      }>,
    ) => {
      const type = `${event.detail.newValue}` || '';
      setSelectedRadioConfigurationType(type);
      setExpertConfigItemsState({});
    },
    [setSelectedRadioConfigurationType],
  );

  const handleExpertConfigItemsChange = useCallback(
    (event: OsdsCheckboxCustomEvent<OdsCheckboxCheckedChangeEventDetail>) => {
      setExpertConfigItemsState((prev) => ({
        ...prev,
        [event.target.name as string]: event.detail.checked,
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
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._100}
          level={ODS_TEXT_LEVEL.body}
        >
          {t('zimbra_domains_add_domain_success_message')}
        </OsdsText>,
        true,
      );
      if (domain.currentState.expectedDNSConfig.ownership.cname) {
        setCnameToCheck(domain.currentState.expectedDNSConfig.ownership.cname);
      }
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
      autoConfigureMX: selectedRadioDomain !== 'externalDomain',
    };
    addDomain(formData);
  };

  const handleInputChange = (event: OdsInputValueChangeEvent) => {
    setSelectedDomainName(event.detail.value as string);
  };

  return (
    <div
      className="flex flex-col items-start w-full"
      data-testid="add-domain-page"
    >
      <Links
        type={LinkType.back}
        href={backLinkUrl}
        label={t('zimbra_domains_add_domain_cta_back')}
      />
      {!cnameToCheck ? (
        <>
          <Subtitle className="mt-8">
            {t('zimbra_domains_add_domain_title_select')}
          </Subtitle>

          <OsdsFormField className="w-full mt-8">
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
              disabled={isLoading || organization?.id}
              value={selectedOrganization}
              onOdsValueChange={(event) => handleOrganizationChange(event)}
              className="mt-2 w-1/2"
              data-testid="select-organization"
            >
              <span slot="placeholder">
                {t('zimbra_domains_add_domain_organization_select')}
              </span>
              {data?.map((item) => (
                <OsdsSelectOption key={item.id} value={item.id}>
                  {item.targetSpec?.name}
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
            <OsdsFormField className="w-full mt-8">
              <OsdsRadioGroup
                value={selectedRadioDomain}
                data-testid="radio-group"
                onOdsValueChange={(value) => handleRadioDomainChange(value)}
              >
                <OsdsRadio value="ovhDomain">
                  <OsdsRadioButton
                    color={ODS_THEME_COLOR_INTENT.primary}
                    size={ODS_RADIO_BUTTON_SIZE.sm}
                  >
                    <span slot="end">
                      <OsdsText
                        color={ODS_THEME_COLOR_INTENT.text}
                        size={ODS_TEXT_SIZE._400}
                        level={ODS_TEXT_LEVEL.body}
                      >
                        {t('zimbra_domains_add_domain_select_title')}
                      </OsdsText>
                    </span>
                  </OsdsRadioButton>
                </OsdsRadio>
                <OsdsRadio value="externalDomain">
                  <OsdsRadioButton
                    color={ODS_THEME_COLOR_INTENT.primary}
                    size={ODS_RADIO_BUTTON_SIZE.sm}
                  >
                    <span slot="end">
                      <OsdsText
                        color={ODS_THEME_COLOR_INTENT.text}
                        size={ODS_TEXT_SIZE._400}
                        level={ODS_TEXT_LEVEL.body}
                      >
                        {t('zimbra_domains_add_domain_input_title')}
                      </OsdsText>
                    </span>
                  </OsdsRadioButton>
                </OsdsRadio>
              </OsdsRadioGroup>
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
          {selectedRadioDomain && (
            <OsdsFormField className="w-full mt-8">
              <div slot="label">
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  size={ODS_TEXT_SIZE._100}
                  level={ODS_TEXT_LEVEL.heading}
                >
                  {t('zimbra_domains_add_domain_title')}
                </OsdsText>
              </div>
              {ovhDomain ? (
                <OsdsSelect
                  className="w-1/2"
                  value={selectedDomainName}
                  data-testid="select-domain"
                  onOdsValueChange={(event) => handleDomainOvhChange(event)}
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
                  {domains.map((domain: string) => (
                    <OsdsSelectOption key={domain} value={domain}>
                      {domain}
                    </OsdsSelectOption>
                  ))}
                </OsdsSelect>
              ) : (
                <>
                  <OsdsInput
                    type={ODS_INPUT_TYPE.text}
                    onOdsValueChange={handleInputChange}
                    data-testid="input-external-domain"
                    placeholder={t('zimbra_domains_add_domain_input')}
                    className="w-1/2"
                  />
                  <OsdsMessage
                    className="mt-6 w-3/5"
                    color={ODS_THEME_COLOR_INTENT.primary}
                    icon={ODS_ICON_NAME.INFO_CONCEPT}
                    type={ODS_MESSAGE_TYPE.info}
                  >
                    <OsdsText
                      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                      color={ODS_THEME_COLOR_INTENT.text}
                      size={ODS_THEME_TYPOGRAPHY_SIZE._100}
                    >
                      {t(
                        'zimbra_domains_add_domain_warning_modification_domain',
                      )}
                    </OsdsText>
                  </OsdsMessage>
                </>
              )}
            </OsdsFormField>
          )}
          {selectedRadioDomain && ovhDomain && selectedDomainName && (
            <OsdsFormField className="w-full mt-8 space-y-5">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.primary}
                size={ODS_TEXT_SIZE._600}
                level={ODS_TEXT_LEVEL.body}
                hue={ODS_THEME_COLOR_HUE._800}
              >
                {t('zimbra_domains_add_domain_configuration_title')}
              </OsdsText>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._400}
                level={ODS_TEXT_LEVEL.body}
              >
                {t('zimbra_domains_add_domain_configuration_description')}
              </OsdsText>
              <OsdsRadioGroup
                className="space-y-5"
                value={selectedRadioConfigurationType}
                data-testid="radio-group-config"
                onOdsValueChange={(value) =>
                  handleRadioConfigurationTypeChange(value)
                }
              >
                <OsdsRadio value="standardConfiguration">
                  <OsdsRadioButton
                    color={ODS_THEME_COLOR_INTENT.primary}
                    size={ODS_RADIO_BUTTON_SIZE.sm}
                  >
                    <div slot="end" className="flex flex-col">
                      <OsdsText
                        color={ODS_THEME_COLOR_INTENT.text}
                        size={ODS_TEXT_SIZE._400}
                        level={ODS_TEXT_LEVEL.body}
                      >
                        {t(
                          'zimbra_domains_add_domain_configuration_choice_standard',
                        )}
                      </OsdsText>
                      <OsdsText
                        color={ODS_THEME_COLOR_INTENT.text}
                        size={ODS_TEXT_SIZE._100}
                        level={ODS_TEXT_LEVEL.body}
                      >
                        {t(
                          'zimbra_domains_add_domain_configuration_choice_standard_info',
                        )}
                      </OsdsText>
                    </div>
                  </OsdsRadioButton>
                </OsdsRadio>
                <OsdsRadio value="expertConfiguration">
                  <OsdsRadioButton
                    color={ODS_THEME_COLOR_INTENT.primary}
                    size={ODS_RADIO_BUTTON_SIZE.sm}
                  >
                    <div slot="end" className="flex flex-col">
                      <OsdsText
                        color={ODS_THEME_COLOR_INTENT.text}
                        size={ODS_TEXT_SIZE._400}
                        level={ODS_TEXT_LEVEL.body}
                      >
                        {t(
                          'zimbra_domains_add_domain_configuration_choice_expert',
                        )}
                      </OsdsText>
                      <OsdsText
                        color={ODS_THEME_COLOR_INTENT.text}
                        size={ODS_TEXT_SIZE._100}
                        level={ODS_TEXT_LEVEL.body}
                      >
                        {t(
                          'zimbra_domains_add_domain_configuration_choice_expert_info',
                        )}
                      </OsdsText>
                    </div>
                  </OsdsRadioButton>
                </OsdsRadio>
              </OsdsRadioGroup>
            </OsdsFormField>
          )}
          {isExpertConfigurationSelected && (
            <OsdsFormField className="w-full mt-8 space-y-5">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._400}
                level={ODS_TEXT_LEVEL.body}
              >
                <Trans
                  t={t}
                  i18nKey="zimbra_domains_add_domain_configuration_expert_title"
                  values={{ domain: selectedDomainName }}
                  components={{ bold: <strong /> }}
                />
              </OsdsText>
              {expertConfigItems.map(({ name, label, key }) => (
                <OsdsCheckbox
                  key={key}
                  checked={expertConfigItemsState[name]}
                  name={name}
                  onOdsCheckedChange={handleExpertConfigItemsChange}
                >
                  <OsdsCheckboxButton color={ODS_THEME_COLOR_INTENT.primary}>
                    <span slot="end">
                      <OsdsText
                        color={ODS_THEME_COLOR_INTENT.text}
                        size={ODS_TEXT_SIZE._400}
                        level={ODS_TEXT_LEVEL.body}
                      >
                        {label}
                      </OsdsText>
                    </span>
                  </OsdsCheckboxButton>
                </OsdsCheckbox>
              ))}
            </OsdsFormField>
          )}
        </>
      ) : (
        <>
          <Subtitle>
            {t('zimbra_domains_add_domain_configuration_cname_title')}
          </Subtitle>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._100}
            level={ODS_TEXT_LEVEL.body}
          >
            {t('zimbra_domains_add_domain_configuration_cname_description')}
          </OsdsText>
          <Clipboard value={cnameToCheck} />
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._100}
            level={ODS_TEXT_LEVEL.body}
          >
            {t('zimbra_domains_add_domain_configuration_info')}
          </OsdsText>
          <OsdsMessage
            className="mt-6"
            color={ODS_THEME_COLOR_INTENT.primary}
            icon={ODS_ICON_NAME.INFO_CONCEPT}
            type={ODS_MESSAGE_TYPE.info}
          >
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_THEME_TYPOGRAPHY_SIZE._100}
            >
              {t('zimbra_domains_add_domain_configuration_part_1')}
              {t('zimbra_domains_add_domain_configuration_part_2')}
              <span className="block mt-2">
                <OsdsLink
                  color={ODS_THEME_COLOR_INTENT.primary}
                  target={OdsHTMLAnchorElementTarget._blank}
                  href={
                    GUIDES_LIST.cname_guide.url[ovhSubsidiary] ||
                    GUIDES_LIST.cname_guide.url.DEFAULT
                  }
                >
                  <OsdsIcon
                    name={ODS_ICON_NAME.GUIDES}
                    color={ODS_THEME_COLOR_INTENT.primary}
                    size={ODS_ICON_SIZE.xxs}
                    className="mr-2"
                  />
                  {t('zimbra_domains_add_domain_configuration_guides_referee')}
                </OsdsLink>
              </span>
            </OsdsText>
          </OsdsMessage>
          <OsdsButton color={ODS_THEME_COLOR_INTENT.primary} onClick={onClose}>
            {t('zimbra_domains_add_domain_cta_access_domains')}
          </OsdsButton>
        </>
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
              />
            )}
            {t('zimbra_domains_add_domain_cta_confirm')}
          </span>
        </OsdsButton>
      </OsdsFormField>
    </div>
  );
}
