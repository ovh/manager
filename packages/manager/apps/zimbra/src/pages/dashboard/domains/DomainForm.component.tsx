import React, { useCallback, useState } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  Button,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  Combobox,
  ComboboxContent,
  ComboboxControl,
  FormField,
  FormFieldError,
  FormFieldLabel,
  ICON_NAME,
  INPUT_TYPE,
  Input,
  MESSAGE_COLOR,
  Message,
  MessageBody,
  MessageIcon,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  RadioValueChangeDetail,
  SPINNER_SIZE,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Link, LinkType } from '@ovh-ux/muk';

import { Loading } from '@/components';
import {
  DomainBodyParamsType,
  DomainType,
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
  const { t } = useTranslation(['domains/form', 'common', NAMESPACES.ACTIONS, NAMESPACES.FORM]);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const { platformId } = useParams();

  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('organization') || searchParams.get('organizationId');

  const { data: organizations, isLoading } = useOrganizations({
    shouldFetchAll: true,
    gcTime: 0,
  });

  const backLinkUrl = useGenerateUrl(backUrl, 'href');

  const { data: domainZones, isLoading: isLoadingDomainZones } = useQuery<string[]>({
    queryKey: getDomainsZoneListQueryKey,
    queryFn: () => getDomainsZoneList(),
  });

  const { data: existingDomains, isLoading: isLoadingExistingDomains } = useDomains({
    shouldFetchAll: true,
  });

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
      autoConfigureAutodiscover: true,
    },
    mode: 'onTouched',
    resolver: zodResolver(domainSchema),
  });

  const formValues = watch();

  const handleDomainTypeChange = useCallback(
    (detail: RadioValueChangeDetail) => {
      setDomainType(detail.value as DomainOwnership);
      setConfigurationType(DNS_CONFIG_TYPE.STANDARD);
      resetField('name');
    },
    [setDomainType],
  );

  const handleConfigurationTypeChange = useCallback(
    (detail: RadioValueChangeDetail) => {
      setConfigurationType(detail.value || '');
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
      autoConfigureAutodiscover:
        (configurationType === DNS_CONFIG_TYPE.STANDARD && isOvhDomain) ||
        (configurationType === DNS_CONFIG_TYPE.EXPERT && data.autoConfigureAutodiscover) ||
        false,
    } as DomainBodyParamsType);
  };

  return (
    <form
      onSubmit={handleSubmit(handleAddDomainClick)}
      className="flex w-full flex-col items-start gap-4 md:w-1/2"
      data-testid="add-domain-page"
    >
      {backUrl && (
        <Link
          type={LinkType.back}
          href={backLinkUrl}
          onClick={() => {
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'navigation',
              actions: [pageTrackingName, BACK_PREVIOUS_PAGE],
            });
          }}
        >
          {t('zimbra_domains_add_domain_cta_back')}
        </Link>
      )}
      {subtitle || <Text preset={TEXT_PRESET.heading3}>{t('common:add_domain')}</Text>}
      {showOrganization && (
        <Controller
          control={control}
          name="organizationId"
          render={({
            field: { name, value, onChange, onBlur },
            fieldState: { isDirty, isTouched },
          }) => (
            <FormField className="w-full" invalid={(isDirty || isTouched) && !!errors?.[name]}>
              <FormFieldLabel htmlFor={name} slot="label">
                {t('common:organization')} *
              </FormFieldLabel>
              <div className="flex">
                <Combobox
                  allowCustomValue={false}
                  items={
                    organizations
                      ?.filter((org) => org.resourceStatus === ResourceStatus.READY)
                      .map((org) => ({
                        label: org.targetSpec?.name,
                        value: org.id,
                      })) || []
                  }
                  data-testid="select-organization"
                  className="mt-2 flex-1"
                  value={value ? [value] : []}
                  name={name}
                  invalid={(isDirty || isTouched) && !!errors[name]}
                  disabled={isLoading || !!organizationId}
                  onValueChange={(detail) => onChange(detail.value[0])}
                  onBlur={onBlur}
                >
                  <ComboboxControl placeholder={t('common:select_organization')} />
                  <ComboboxContent />
                </Combobox>
                {isLoading && <Loading className="flex justify-center" size={SPINNER_SIZE.sm} />}
              </div>
              {(isDirty || isTouched) && errors?.[name]?.message && (
                <FormFieldError>{errors[name].message}</FormFieldError>
              )}
            </FormField>
          )}
        />
      )}
      {formValues.organizationId && (
        <FormField className="w-full gap-4">
          <RadioGroup
            value={domainType}
            onValueChange={handleDomainTypeChange}
            data-testid="radio-group"
          >
            <div data-testid="radio-ovh-domain">
              <Radio value={DomainOwnership.OVH}>
                <RadioControl />
                <RadioLabel>
                  <Text preset={TEXT_PRESET.paragraph}>
                    {t('zimbra_domains_add_domain_select_title')}
                  </Text>
                </RadioLabel>
              </Radio>
            </div>
            <div data-testid="radio-external-domain">
              <Radio value={DomainOwnership.EXTERNAL}>
                <RadioControl />
                <RadioLabel>
                  <Text preset={TEXT_PRESET.paragraph}>
                    {t('zimbra_domains_add_domain_input_title')}
                  </Text>
                </RadioLabel>
              </Radio>
            </div>
          </RadioGroup>
        </FormField>
      )}
      {formValues.organizationId && domainType && (
        <Controller
          control={control}
          name="name"
          render={({
            field: { name, value, onChange, onBlur },
            fieldState: { isDirty, isTouched },
          }) => (
            <FormField className="w-full" invalid={(isDirty || isTouched) && !!errors?.[name]}>
              <FormFieldLabel htmlFor={name} slot="label">
                {t('common:domain_name')} *
              </FormFieldLabel>
              {isOvhDomain ? (
                <>
                  <Combobox
                    allowCustomValue={false}
                    items={
                      domainZones
                        ?.filter(
                          (domain: string) =>
                            !existingDomains?.some(
                              (existingDomain) => existingDomain.currentState.name === domain,
                            ),
                        )
                        ?.map((domain) => ({
                          label: domain,
                          value: domain,
                        })) || []
                    }
                    className="flex-1"
                    data-testid="select-domain"
                    value={value ? [value] : []}
                    name={name}
                    invalid={(isDirty || isTouched) && !!errors[name]}
                    disabled={isLoadingDomains}
                    onValueChange={(detail) => onChange(detail.value[0])}
                    onBlur={onBlur}
                  >
                    <ComboboxControl placeholder={t('common:select_domain')} />
                    <ComboboxContent />
                  </Combobox>
                  {(isLoadingExistingDomains || isLoadingDomainZones) && (
                    <Loading className="flex justify-center" size={SPINNER_SIZE.sm} />
                  )}
                </>
              ) : (
                <Input
                  type={INPUT_TYPE.text}
                  value={value}
                  invalid={(isDirty || isTouched) && !!errors[name]}
                  onChange={onChange}
                  onBlur={onBlur}
                  data-testid="input-external-domain"
                  placeholder={t('zimbra_domains_add_domain_input')}
                  name={name}
                  id={name}
                />
              )}
              {(isDirty || isTouched) && errors[name]?.message && (
                <FormFieldError>{errors[name].message}</FormFieldError>
              )}
            </FormField>
          )}
        />
      )}
      {!isOvhDomain && (
        <Message dismissible={false} className="w-full" color={MESSAGE_COLOR.information}>
          <MessageIcon name={ICON_NAME.circleInfo} />
          <MessageBody>{t('zimbra_domains_add_domain_warning_modification_domain')}</MessageBody>
        </Message>
      )}
      {isOvhDomain && formValues.name && (
        <>
          <FormField className="w-full">
            <FormFieldLabel htmlFor="form-field-input" slot="label">
              {t('common:configuration')}
              <Text className="mb-4" preset={TEXT_PRESET.paragraph}>
                {t('zimbra_domains_add_domain_configuration_description')}
              </Text>
            </FormFieldLabel>
            <RadioGroup value={configurationType} onValueChange={handleConfigurationTypeChange}>
              {[DNS_CONFIG_TYPE.STANDARD, DNS_CONFIG_TYPE.EXPERT].map((type) => (
                <div key={type} className="flex gap-4 leading-none">
                  <Radio key={type} value={type} data-testid={`radio-config-${type}`}>
                    <RadioControl />
                    <RadioLabel>
                      <Text preset={TEXT_PRESET.paragraph}>
                        {t(`zimbra_domains_add_domain_configuration_choice_${type}`)}
                      </Text>
                      <Text preset={TEXT_PRESET.caption}>
                        {t(`zimbra_domains_add_domain_configuration_choice_${type}_info`)}
                      </Text>
                    </RadioLabel>
                  </Radio>
                </div>
              ))}
            </RadioGroup>
          </FormField>
          {isExpertConf ? (
            <FormField className="w-full space-y-4">
              <Text preset={TEXT_PRESET.paragraph}>
                <Trans
                  t={t}
                  i18nKey="zimbra_domains_add_domain_configuration_expert_title"
                  values={{ domain: formValues.name }}
                />
              </Text>
              <Controller
                control={control}
                name="autoConfigureAutodiscover"
                render={({ field: { name, value, onChange } }) => (
                  <div key={name} className="flex gap-4 leading-none">
                    <Checkbox
                      checked={value}
                      id={name}
                      name={name}
                      onCheckedChange={(detail) => onChange(detail.checked)}
                    >
                      <CheckboxControl />
                      <CheckboxLabel>
                        <Text preset={TEXT_PRESET.paragraph}>
                          {t('zimbra_domains_add_domain_configuration_expert_configure_srv')}
                        </Text>
                      </CheckboxLabel>
                    </Checkbox>
                  </div>
                )}
              />
              <Controller
                control={control}
                name="autoConfigureMX"
                render={({ field: { name, value, onChange } }) => (
                  <div key={name} className="flex gap-4 leading-none">
                    <Checkbox
                      checked={value}
                      id={name}
                      name={name}
                      onCheckedChange={(detail) => onChange(detail.checked)}
                    >
                      <CheckboxControl />
                      <CheckboxLabel>
                        <Text preset={TEXT_PRESET.paragraph}>
                          {t('zimbra_domains_add_domain_configuration_expert_configure_mx')}
                        </Text>
                      </CheckboxLabel>
                    </Checkbox>
                  </div>
                )}
              />
              <Controller
                control={control}
                name="autoConfigureSPF"
                render={({ field: { name, value, onChange } }) => (
                  <div key={name} className="flex gap-4 leading-none">
                    <Checkbox
                      checked={value}
                      id={name}
                      name={name}
                      onCheckedChange={(detail) => onChange(detail.checked)}
                    >
                      <CheckboxControl />
                      <CheckboxLabel>
                        <Text preset={TEXT_PRESET.paragraph}>
                          {t('zimbra_domains_add_domain_configuration_expert_configure_spf')}
                        </Text>
                      </CheckboxLabel>
                    </Checkbox>
                  </div>
                )}
              />
              <Controller
                control={control}
                name="autoConfigureDKIM"
                render={({ field: { name, value, onChange } }) => (
                  <div key={name} className="flex gap-4 leading-none">
                    <Checkbox
                      checked={value}
                      id={name}
                      name={name}
                      onCheckedChange={(detail) => onChange(detail.checked)}
                    >
                      <CheckboxControl />
                      <CheckboxLabel>
                        <Text preset={TEXT_PRESET.paragraph}>
                          {t('zimbra_domains_add_domain_configuration_expert_configure_dkim')}
                        </Text>
                      </CheckboxLabel>
                    </Checkbox>
                  </div>
                )}
              />
            </FormField>
          ) : (
            <Message dismissible={false} className="w-full" color={MESSAGE_COLOR.warning}>
              <MessageIcon name={ICON_NAME.triangleExclamation} />
              <MessageBody>
                {t('zimbra_domains_add_domain_warning_configuration_standard')}
              </MessageBody>
            </Message>
          )}
        </>
      )}
      <FormField>
        <Button
          data-testid="add-domain-submit-btn"
          type="submit"
          color={BUTTON_COLOR.primary}
          disabled={!isDirty || !isValid}
          loading={isSending}
        >
          {submitButtonLabel || t(`${NAMESPACES.ACTIONS}:confirm`)}
        </Button>
      </FormField>
    </form>
  );
};

export default DomainForm;
