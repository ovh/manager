import React, { useCallback, useEffect, useState } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_INPUT_TYPE,
  ODS_LINK_COLOR,
  ODS_MESSAGE_COLOR,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
  OdsRadioChangeEventDetail,
  OdsRadioCustomEvent,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsCheckbox,
  OdsFormField,
  OdsInput,
  OdsMessage,
  OdsRadio,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { IconLinkAlignmentType, LinkType, Links, Subtitle } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { Loading } from '@/components';
import {
  DomainBodyParamsType,
  DomainType,
  OrganizationType,
  ResourceStatus,
  getDomainsZoneList,
  getDomainsZoneListQueryKey,
  getZimbraPlatformDomainsQueryKey,
  postZimbraDomain,
} from '@/data/api';
import { useDomains, useOrganizations } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import queryClient from '@/queryClient';
import { ADD_DOMAIN, BACK_PREVIOUS_PAGE, CONFIRM } from '@/tracking.constants';
import { DNS_CONFIG_TYPE, DomainSchema, domainSchema } from '@/utils';

export enum DomainOwnership {
  OVH = 'ovhDomain',
  EXTERNAL = 'externalDomain',
}

export const DomainForm = ({
  showOrganization = true,
  backUrl,
  onSuccess,
  onError,
  onSettled,
  pageTrackingName = ADD_DOMAIN,
  submitButtonLabel = '',
  subtitle,
}: {
  showOrganization?: boolean;
  backUrl?: string;
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
  onSettled?: (domain: DomainType, error: ApiError) => void;
  pageTrackingName: string;
  submitButtonLabel?: string;
  subtitle?: React.ReactNode;
}) => {
  const { t } = useTranslation(['domains/form', 'common', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const { platformId } = useParams();

  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('organization') || searchParams.get('organizationId');

  const { data: organizations, isLoading } = useOrganizations({
    shouldFetchAll: true,
    gcTime: 0,
  });

  // @TODO: remove this when OdsSelect is fixed ODS-1565
  const [hackOrgs, setHackOrgs] = useState<OrganizationType[]>([]);
  const [hackKeyOrg, setHackKeyOrg] = useState(Date.now());

  useEffect(() => {
    setHackOrgs(organizations?.filter((org) => org.resourceStatus === ResourceStatus.READY));
    setHackKeyOrg(Date.now());
  }, [organizations]);
  const backLinkUrl = useGenerateUrl(backUrl, 'href');

  const { data: domainZones, isLoading: isLoadingDomainZones } = useQuery<string[]>({
    queryKey: getDomainsZoneListQueryKey,
    queryFn: () => getDomainsZoneList(),
  });

  const { data: existingDomains, isLoading: isLoadingExistingDomains } = useDomains({
    shouldFetchAll: true,
  });

  // @TODO: remove this when OdsSelect is fixed ODS-1565
  const [hackDomains, setHackDomains] = useState([]);
  const [hackKeyDomains, setHackKeyDomains] = useState(Date.now());

  useEffect(() => {
    setHackDomains(
      (domainZones || []).filter(
        (zone: string) => !(existingDomains || []).find((d) => zone === d.currentState.name),
      ),
    );
    setHackKeyDomains(Date.now());
  }, [domainZones, existingDomains]);

  const isLoadingDomains = isLoadingDomainZones || isLoadingExistingDomains;

  const [domainType, setDomainType] = useState(DomainOwnership.OVH);

  const [configurationType, setConfigurationType] = useState(DNS_CONFIG_TYPE.STANDARD);

  const isOvhDomain = domainType === DomainOwnership.OVH;

  const isExpertConf = configurationType === DNS_CONFIG_TYPE.EXPERT;

  const { mutate: addDomain, isPending: isSending } = useMutation({
    mutationFn: (params: DomainBodyParamsType) => {
      return postZimbraDomain(platformId, params);
    },
    onSuccess,
    onError,
    onSettled: async (domain: DomainType, error: ApiError) => {
      await queryClient.invalidateQueries({
        queryKey: getZimbraPlatformDomainsQueryKey(platformId),
      });

      // domain needs verification, redirect to verify page
      if (domain?.currentState?.expectedDNSConfig?.ownership?.cname) {
        return navigate(`/${platformId}/domains/${domain.id}/verify`);
      }

      return onSettled?.(domain, error);
    },
  });

  const {
    control,
    handleSubmit,
    resetField,
    watch,
    formState: { isDirty, isValid, errors },
  } = useForm({
    defaultValues: {
      name: '',
      organizationId: organizationId || '',
      autoConfigureMX: true,
      autoConfigureSPF: true,
      autoConfigureDKIM: true,
    },
    mode: 'onTouched',
    resolver: zodResolver(domainSchema),
  });

  const formValues = watch();

  const handleDomainTypeChange = useCallback(
    (event: OdsRadioCustomEvent<OdsRadioChangeEventDetail>) => {
      setDomainType(event.detail.value as DomainOwnership);
      setConfigurationType(DNS_CONFIG_TYPE.STANDARD);
      resetField('name');
    },
    [setDomainType],
  );

  const handleConfigurationTypeChange = useCallback(
    (event: OdsRadioCustomEvent<OdsRadioChangeEventDetail>) => {
      setConfigurationType(event.detail.value || '');
    },
    [setConfigurationType],
  );

  const handleAddDomainClick: SubmitHandler<DomainSchema> = (data) => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [pageTrackingName, CONFIRM],
    });

    addDomain({
      ...data,
      autoConfigureMX:
        (configurationType === DNS_CONFIG_TYPE.STANDARD && isOvhDomain) ||
        (configurationType === DNS_CONFIG_TYPE.EXPERT && data.autoConfigureMX) ||
        false,
      autoConfigureSPF:
        (configurationType === DNS_CONFIG_TYPE.STANDARD && isOvhDomain) ||
        (configurationType === DNS_CONFIG_TYPE.EXPERT && data.autoConfigureSPF) ||
        false,
      autoConfigureDKIM:
        (configurationType === DNS_CONFIG_TYPE.STANDARD && isOvhDomain) ||
        (configurationType === DNS_CONFIG_TYPE.EXPERT && data.autoConfigureDKIM) ||
        false,
    } as DomainBodyParamsType);
  };

  return (
    <form
      onSubmit={handleSubmit(handleAddDomainClick)}
      className="flex flex-col items-start w-full md:w-1/2 gap-4"
      data-testid="add-domain-page"
    >
      {backUrl && (
        <Links
          iconAlignment={IconLinkAlignmentType.left}
          type={LinkType.back}
          href={backLinkUrl}
          onClickReturn={() => {
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'navigation',
              actions: [pageTrackingName, BACK_PREVIOUS_PAGE],
            });
          }}
          color={ODS_LINK_COLOR.primary}
          label={t('zimbra_domains_add_domain_cta_back')}
        />
      )}
      {subtitle || <Subtitle>{t('common:add_domain')}</Subtitle>}
      {showOrganization && (
        <Controller
          control={control}
          name="organizationId"
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField className="w-full" error={errors?.[name]?.message}>
              <label htmlFor={name} slot="label">
                {t('common:organization')} *
              </label>
              <div className="flex">
                <OdsSelect
                  key={hackKeyOrg}
                  data-testid="select-organization"
                  placeholder={t('common:select_organization')}
                  className="mt-2 flex-1"
                  id={name}
                  name={name}
                  value={value || organizationId /* @TODO remove when OdsSelect is fixed */}
                  hasError={!!errors[name]}
                  isDisabled={isLoading || !!organizationId}
                  onOdsChange={onChange}
                  onOdsBlur={onBlur}
                >
                  {hackOrgs?.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.targetSpec?.name}
                    </option>
                  ))}
                </OdsSelect>
                {isLoading && (
                  <Loading className="flex justify-center" size={ODS_SPINNER_SIZE.sm} />
                )}
              </div>
            </OdsFormField>
          )}
        />
      )}
      {formValues.organizationId && (
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
        </OdsFormField>
      )}
      {formValues.organizationId && domainType && (
        <Controller
          control={control}
          name="name"
          render={({ field: { name, value, onChange, onBlur } }) => (
            <OdsFormField className="w-full" error={errors?.[name]?.message}>
              <label htmlFor={name} slot="label">
                {t('common:domain_name')} *
              </label>
              {isOvhDomain ? (
                <div className="flex">
                  <OdsSelect
                    key={hackKeyDomains}
                    className="flex-1"
                    data-testid="select-domain"
                    placeholder={t('common:select_domain')}
                    id={name}
                    name={name}
                    value={value}
                    hasError={!!errors[name]}
                    isDisabled={isLoadingDomains}
                    onOdsChange={onChange}
                    onOdsBlur={onBlur}
                  >
                    {hackDomains?.map((domain: string, index: number) => (
                      <option key={index} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </OdsSelect>
                  {(isLoadingExistingDomains || isLoadingDomainZones) && (
                    <Loading className="flex justify-center" size={ODS_SPINNER_SIZE.sm} />
                  )}
                </div>
              ) : (
                <OdsInput
                  type={ODS_INPUT_TYPE.text}
                  value={value}
                  hasError={!!errors[name]}
                  onOdsChange={onChange}
                  onBlur={onBlur}
                  data-testid="input-external-domain"
                  placeholder={t('zimbra_domains_add_domain_input')}
                  name={name}
                  id={name}
                />
              )}
            </OdsFormField>
          )}
        />
      )}
      {!isOvhDomain && (
        <OdsMessage isDismissible={false} className="w-full" color={ODS_MESSAGE_COLOR.information}>
          {t('zimbra_domains_add_domain_warning_modification_domain')}
        </OdsMessage>
      )}
      {isOvhDomain && formValues.name && (
        <>
          <OdsFormField className="w-full">
            <label htmlFor="form-field-input" slot="label">
              {t('common:configuration')}
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
                    {t(`zimbra_domains_add_domain_configuration_choice_${type}_info`)}
                  </OdsText>
                </label>
              </div>
            ))}
          </OdsFormField>
          {isExpertConf ? (
            <OdsFormField className="w-full space-y-4">
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                <Trans
                  t={t}
                  i18nKey="zimbra_domains_add_domain_configuration_expert_title"
                  values={{ domain: formValues.name }}
                />
              </OdsText>
              <Controller
                control={control}
                name="autoConfigureMX"
                render={({ field: { name, value, onChange } }) => (
                  <div key={name} className="flex leading-none gap-4">
                    <OdsCheckbox
                      inputId={name}
                      key={name}
                      isChecked={value}
                      name={name}
                      onOdsChange={() => onChange(!value)}
                    ></OdsCheckbox>
                    <label htmlFor={name}>
                      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                        {t('zimbra_domains_add_domain_configuration_expert_configure_mx')}
                      </OdsText>
                    </label>
                  </div>
                )}
              />
              <Controller
                control={control}
                name="autoConfigureSPF"
                render={({ field: { name, value, onChange } }) => (
                  <div key={name} className="flex leading-none gap-4">
                    <OdsCheckbox
                      inputId={name}
                      key={name}
                      isChecked={value}
                      name={name}
                      onOdsChange={() => onChange(!value)}
                    ></OdsCheckbox>
                    <label htmlFor={name}>
                      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                        {t('zimbra_domains_add_domain_configuration_expert_configure_spf')}
                      </OdsText>
                    </label>
                  </div>
                )}
              />
              <Controller
                control={control}
                name="autoConfigureDKIM"
                render={({ field: { name, value, onChange } }) => (
                  <div key={name} className="flex leading-none gap-4">
                    <OdsCheckbox
                      inputId={name}
                      key={name}
                      isChecked={value}
                      name={name}
                      onOdsChange={() => onChange(!value)}
                    ></OdsCheckbox>
                    <label htmlFor={name}>
                      <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                        {t('zimbra_domains_add_domain_configuration_expert_configure_dkim')}
                      </OdsText>
                    </label>
                  </div>
                )}
              />
            </OdsFormField>
          ) : (
            <OdsMessage isDismissible={false} className="w-full" color={ODS_MESSAGE_COLOR.warning}>
              {t('zimbra_domains_add_domain_warning_configuration_standard')}
            </OdsMessage>
          )}
        </>
      )}
      <OdsFormField>
        <OdsButton
          data-testid="add-domain-submit-btn"
          type="submit"
          color={ODS_BUTTON_COLOR.primary}
          isDisabled={!isDirty || !isValid}
          isLoading={isSending}
          label={submitButtonLabel || t(`${NAMESPACES.ACTIONS}:confirm`)}
        ></OdsButton>
      </OdsFormField>
    </form>
  );
};

export default DomainForm;
