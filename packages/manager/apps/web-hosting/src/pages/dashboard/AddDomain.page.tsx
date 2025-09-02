import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_COLOR,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsCard,
  OdsCheckbox,
  OdsFormField,
  OdsIcon,
  OdsInput,
  OdsMessage,
  OdsModal,
  OdsRadio,
  OdsSelect,
  OdsText,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNotifications } from '@ovh-ux/manager-react-components';

import {
  useCreateAttachedDomainsService,
  useGetAddDomainExisting,
  useGetDomainZone,
  useGetHostingService,
} from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { TExistingDomain } from '@/data/types/product/domain';
import { HostingCountries, HostingDomainStatus } from '@/data/types/product/webHosting';
import { subRoutes, urls } from '@/routes/routes.constants';
import { isValidDomain } from '@/utils/validator';

const formSchema = z.object({
  path: z.enum(['A', 'B']),
  domain: z.string().optional(),
  subDomain: z.string().optional(),
  wwwNeeded: z.boolean(),
  folder: z.string().optional(),
  ip: z.boolean().optional(),
  selectedIp: z.string().optional(),
  firewall: z.boolean().optional(),
  logs: z.boolean().optional(),
  domainLogs: z.string().optional(),
  automaticConfiguration: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function AddDomainModal() {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const closeModal = () => navigate(urls.ssl.replace(subRoutes.serviceName, serviceName));
  const hostingService = useGetHostingService(serviceName);
  const domainZone = useGetDomainZone();
  const { addSuccess, addWarning } = useNotifications();
  const { t } = useTranslation([
    'dashboard',
    NAMESPACES.ACTIONS,
    NAMESPACES.SERVICE,
    NAMESPACES.COUNTRIES,
  ]);

  const [step, setStep] = useState<number | null>(0);
  const [existingDomains, setExistingDomains] = useState<TExistingDomain>();

  const { control, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      path: 'A',
      subDomain: '',
      folder: '',
      wwwNeeded: true,
      automaticConfiguration: true,
    },
    resolver: zodResolver(formSchema),
  });

  const formValues = watch();

  const existingDomain = useGetAddDomainExisting(serviceName, formValues?.path, step === 1);

  useEffect(() => {
    if (existingDomain !== undefined) {
      setExistingDomains(existingDomain?.data);
    }
  }, [existingDomain]);

  const existingCompleteDomain = formValues?.subDomain
    ? `${formValues?.subDomain}.${formValues?.domain}`
    : formValues?.domain;
  const completeDomain = formValues?.path === 'A' ? existingCompleteDomain : formValues?.subDomain;

  const displayedDomain = `www.${completeDomain}`;
  const ovhControl = `ovhcontrol.${formValues.subDomain}`;
  const domainFolder = `./${formValues.folder}`;

  const { createAttachedDomainsService } = useCreateAttachedDomainsService(
    serviceName,
    () => {
      addSuccess(t('hosting_tab_DOMAINS_configuration_add_success_finish'), true);
    },
    () => {
      addWarning(t('hosting_tab_DOMAINS_configuration_add_failure'), true);
    },
  );

  const isFirst = step === 0;
  const isLast = step === 2;

  const next = () => !isLast && setStep((s) => s + 1);
  const back = () => !isFirst && setStep((s) => s - 1);
  const isNextButtonDisabled = () => {
    switch (step) {
      case 0:
        return formValues?.path === 'A' && !formValues?.domain;
      case 1:
        return (
          (existingDomains?.existingDomains?.includes(formValues?.domain) &&
            !formValues?.subDomain) ||
          !isValidDomain(completeDomain) ||
          (formValues?.logs && !formValues?.domainLogs) ||
          existingDomains?.existingDomains?.includes(completeDomain)
        );
      default:
        return false;
    }
  };

  const onSubmit = (data: FormData) => {
    createAttachedDomainsService({
      domain: completeDomain,
      ssl: true,
      path: `./${data?.folder}`,
      cdn: HostingDomainStatus.NONE,
      ownLog: data?.logs ? data?.domainLogs : null,
      firewall: data?.firewall ? HostingDomainStatus.ACTIVE : HostingDomainStatus.NONE,
      wwwNeeded: data?.wwwNeeded,
      bypassDNSConfiguration: data?.automaticConfiguration,
      ipLocation: data?.selectedIp as HostingCountries,
    });
    closeModal();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col space-y-8 mb-10">
            <div>
              <OdsText>{t('hosting_add_step1_title')}</OdsText>
              <OdsText preset={ODS_TEXT_PRESET.heading6}>
                {hostingService?.data?.displayName || serviceName}
              </OdsText>
            </div>
            <Controller
              name="path"
              control={control}
              render={({ field }) => (
                <>
                  <div className="flex gap-4 items-center">
                    <OdsRadio
                      {...field}
                      value="A"
                      isChecked={field.value === 'A'}
                      onOdsChange={() => field.onChange('A')}
                    />
                    <label>
                      <OdsText preset={ODS_TEXT_PRESET.span}>{t('hosting_add_step1_ovh')}</OdsText>
                    </label>
                  </div>
                  {field.value === 'A' && (
                    <>
                      <Controller
                        name="domain"
                        control={control}
                        render={({ field: domField }) => (
                          <>
                            <OdsInput
                              type={ODS_INPUT_TYPE.search}
                              name="search-domain"
                              onOdsChange={(e) => domField.onChange(e.target.value)}
                              placeholder={t('hosting_add_step1_search_placeholder')}
                            />
                            <select
                              className="mt-3 w-full"
                              value={domField.value}
                              size={6}
                              onChange={(e) => domField.onChange(e.target.value)}
                            >
                              {domainZone?.data?.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                          </>
                        )}
                      />
                    </>
                  )}
                  <div className="flex gap-4 items-center">
                    <OdsRadio
                      {...field}
                      value="B"
                      isChecked={field.value === 'B'}
                      onOdsChange={() => field.onChange('B')}
                    />
                    <label>
                      <OdsText preset={ODS_TEXT_PRESET.span}>
                        {t('hosting_add_step1_external')}
                      </OdsText>
                    </label>
                  </div>
                </>
              )}
            />
          </div>
        );
      case 1:
        return formValues.path === 'A' ? (
          <div className="flex flex-col space-y-8 mb-10">
            <OdsText>{t('hosting_add_step2_mode_OVH_question')}</OdsText>
            <div>
              <OdsText preset={ODS_TEXT_PRESET.caption}>
                {t('hosting_add_step2_mode_OVH_domain_name')}
              </OdsText>
              <div className="flex items-center space-x-2">
                <Controller
                  name="subDomain"
                  control={control}
                  render={({ field }) => (
                    <OdsInput
                      className="w-2/3"
                      name="sub-domain"
                      type="text"
                      value={field.value}
                      onOdsChange={(e) => field.onChange(e.target.value)}
                      placeholder={t('hosting_add_step2_mode_OVH_domain_name_placeholder')}
                    />
                  )}
                />
                <OdsButton
                  size="sm"
                  variant={ODS_BUTTON_VARIANT.outline}
                  label={formValues.domain}
                />
              </div>
              {existingDomains?.existingDomains?.includes(completeDomain) ? (
                <div className="flex flex-row mt-4">
                  <OdsCheckbox isDisabled={true} isChecked={true} name="www-needed" />
                  <label className="ml-4 cursor-pointer">
                    <OdsText preset={ODS_TEXT_PRESET.span}>
                      {t('hosting_add_step2_common_domain_exists_with_name', {
                        t0: existingCompleteDomain,
                      })}
                    </OdsText>
                  </label>
                </div>
              ) : (
                isValidDomain(completeDomain) && (
                  <OdsFormField className="flex flex-row mt-4">
                    <Controller
                      name="wwwNeeded"
                      control={control}
                      render={({ field }) => (
                        <OdsCheckbox
                          isChecked={field.value}
                          name="www-needed"
                          onOdsChange={() => field.onChange(!field.value)}
                        />
                      )}
                    />
                    <label className="ml-4 cursor-pointer">
                      <OdsText preset={ODS_TEXT_PRESET.span}>
                        {t('hosting_add_step2_mode_OVH_domain_name_www_question', {
                          t0: existingCompleteDomain,
                        })}
                      </OdsText>
                    </label>
                  </OdsFormField>
                )
              )}
            </div>
            <div>
              <OdsText preset={ODS_TEXT_PRESET.caption}>
                {t('hosting_multisite_domain_configuration_home')}
              </OdsText>
              <div className="flex items-center space-x-2">
                <OdsButton size="sm" variant={ODS_BUTTON_VARIANT.outline} label="./" />
                <Controller
                  name="folder"
                  control={control}
                  render={({ field }) => (
                    <OdsInput
                      className="w-2/3"
                      type="text"
                      name="file-folder"
                      value={field.value}
                      onOdsChange={(e) => field.onChange(e.target.value)}
                      placeholder={t('hosting_multisite_domain_configuration_myfolder')}
                    />
                  )}
                />
              </div>
            </div>
            <div className="space-y-4">
              <OdsText preset={ODS_TEXT_PRESET.caption}>
                {t('hosting_add_step2_mode_OVH_options_choose')}
              </OdsText>
              <OdsFormField className="flex flex-row items-center">
                <Controller
                  name="ip"
                  control={control}
                  render={({ field }) => (
                    <OdsCheckbox
                      name="country-ip"
                      isChecked={field.value}
                      onOdsChange={() => field.onChange(!field.value)}
                    />
                  )}
                />
                <label className="ml-2 cursor-pointer">
                  <OdsText preset={ODS_TEXT_PRESET.span}>
                    {t('hosting_multisite_domain_configuration_countriesIp')}
                  </OdsText>
                </label>
                <OdsIcon
                  id="ip-tooltip-trigger"
                  name="circle-question"
                  className="color-disabled cursor-pointer"
                />
                <OdsTooltip triggerId="ip-tooltip-trigger">
                  <OdsText>{t('hosting_multisite_domain_configuration_country_ip_help')}</OdsText>
                </OdsTooltip>
              </OdsFormField>
              {formValues.ip && (
                <Controller
                  name="selectedIp"
                  control={control}
                  render={({ field }) => (
                    <OdsSelect
                      name="ip"
                      value={field.value}
                      onOdsChange={(e) => field.onChange(e.target.value)}
                    >
                      {hostingService?.data?.countriesIp?.map((item) => (
                        <optgroup
                          key={item.country}
                          label={t(`${NAMESPACES.COUNTRIES}:country_${item.country}`)}
                        >
                          <option value={item.country}>{item.ip}</option>
                        </optgroup>
                      ))}
                    </OdsSelect>
                  )}
                />
              )}
              <OdsFormField className="flex flex-row items-center">
                <Controller
                  name="firewall"
                  control={control}
                  render={({ field }) => (
                    <OdsCheckbox
                      name="firewall"
                      isChecked={field.value}
                      onOdsChange={() => field.onChange(!field.value)}
                    />
                  )}
                />
                <label className="ml-2 cursor-pointer">
                  <OdsText preset={ODS_TEXT_PRESET.span}>
                    {t('hosting_multisite_domain_configuration_firewall')}
                  </OdsText>
                </label>
              </OdsFormField>
              <OdsFormField className="flex flex-row items-center">
                <Controller
                  name="logs"
                  control={control}
                  render={({ field }) => (
                    <OdsCheckbox
                      name="logs"
                      isChecked={field.value}
                      onOdsChange={() => field.onChange(!field.value)}
                    />
                  )}
                />
                <label className="ml-2 cursor-pointer">
                  <OdsText preset={ODS_TEXT_PRESET.span}>
                    {t('hosting_multisite_domain_configuration_ownlog')}
                  </OdsText>
                </label>
              </OdsFormField>
              {formValues.logs && (
                <Controller
                  name="domainLogs"
                  control={control}
                  render={({ field }) => (
                    <OdsSelect
                      name="logs-select"
                      value={field.value}
                      onOdsChange={(e) => field.onChange(e.target.value)}
                    >
                      {domainZone?.data?.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </OdsSelect>
                  )}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-8 mb-10">
            <OdsText>{t('hosting_add_step2_mode_EXTERNAL_question')}</OdsText>
            <div>
              <Controller
                name="subDomain"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <OdsText className="w-1/3">
                      {t('hosting_add_step2_mode_EXTERNAL_domain_name')}
                    </OdsText>
                    <OdsInput
                      className="w-2/3"
                      type="text"
                      name="sub-domain"
                      value={field.value}
                      onOdsChange={(e) => field.onChange(e.target.value)}
                      placeholder={t('hosting_add_step2_mode_EXTERNAL_domain_name_placeholder')}
                    />
                  </div>
                )}
              />
            </div>

            {isValidDomain(formValues.subDomain) && (
              <OdsFormField className="flex flex-row items-end">
                <Controller
                  name="wwwNeeded"
                  control={control}
                  render={({ field }) => (
                    <OdsCheckbox
                      name="www-needed"
                      isChecked={field.value}
                      onOdsChange={() => field.onChange(!field.value)}
                    />
                  )}
                />
                <label className="ml-4 cursor-pointer">
                  <OdsText preset={ODS_TEXT_PRESET.span}>
                    {t('hosting_add_step2_mode_OVH_domain_name_www_question', {
                      t0: formValues.subDomain,
                    })}
                  </OdsText>
                </label>
              </OdsFormField>
            )}
            <div className="flex items-center space-x-2">
              <OdsText className="w-1/3">
                {t('hosting_multisite_domain_configuration_home')}
              </OdsText>
              <div className="w-2/3 flex items-center space-x-2">
                <OdsButton size="sm" variant={ODS_BUTTON_VARIANT.outline} label="./" />
                <Controller
                  name="folder"
                  control={control}
                  render={({ field }) => (
                    <OdsInput
                      className="w-10/12"
                      type="text"
                      name="folder"
                      value={field.value}
                      onOdsChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col space-y-8 mb-10 mt-5">
            <OdsText>{t('hosting_add_step3_summary')}</OdsText>
            <div className="flex">
              <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-1/2 text-right pr-4">
                {t('hosting_add_step3_domain_name')}
              </OdsText>
              <OdsText className="w-1/2">{completeDomain}</OdsText>
            </div>
            {formValues.wwwNeeded && (
              <div className="flex">
                <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-1/2 text-right pr-4">
                  {t('hosting_add_step3_domain_name')}
                </OdsText>
                <OdsText className="w-1/2">{displayedDomain}</OdsText>
              </div>
            )}
            <div className="flex">
              <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-1/2 text-right pr-4">
                {t('hosting_add_step3_home')}
              </OdsText>
              <OdsText className="w-1/2">{domainFolder}</OdsText>
            </div>
            {formValues.path === 'A' && (
              <>
                {formValues.ip && (
                  <div className="flex">
                    <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-1/2 text-right pr-4">
                      {t('hosting_multisite_domain_configuration_countriesIp')}
                    </OdsText>
                    <OdsText className="w-1/2">
                      {formValues.selectedIp || hostingService?.data?.hostingIp}
                    </OdsText>
                  </div>
                )}
                <div className="flex">
                  <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-1/2 text-right pr-4">
                    {t('hosting_multisite_domain_configuration_cdn')}
                  </OdsText>
                  <OdsText className="w-1/2">
                    {t(`${NAMESPACES.SERVICE}:service_state_disabled`)}
                  </OdsText>
                </div>
                <div className="flex">
                  <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-1/2 text-right pr-4">
                    {t('hosting_multisite_domain_configuration_ssl')}
                  </OdsText>
                  <OdsText className="w-1/2">
                    {t(`${NAMESPACES.SERVICE}:service_state_enabled`)}
                  </OdsText>
                </div>
                <div className="flex">
                  <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-1/2 text-right pr-4">
                    {t('hosting_add_step3_firewall')}
                  </OdsText>
                  <OdsText className="w-1/2">
                    {t(
                      `${NAMESPACES.SERVICE}:${
                        formValues.firewall ? 'service_state_enabled' : 'service_state_disabled'
                      }`,
                    )}
                  </OdsText>
                </div>
                <div className="flex">
                  <OdsText preset={ODS_TEXT_PRESET.heading6} className="w-1/2 text-right pr-4">
                    {t('hosting_add_step3_ownlog')}
                  </OdsText>
                  <OdsText className="w-1/2">
                    {t(
                      `${NAMESPACES.SERVICE}:${
                        formValues.firewall ? 'service_state_enabled' : 'service_state_disabled'
                      }`,
                    )}
                  </OdsText>
                </div>
                <OdsCard>
                  <OdsFormField className="flex flex-row items-end m-4">
                    <Controller
                      name="automaticConfiguration"
                      control={control}
                      render={({ field }) => (
                        <OdsCheckbox
                          name="automatic-configuration"
                          isChecked={field.value}
                          onOdsChange={() => field.onChange(!field.value)}
                        />
                      )}
                    />
                    <label className="ml-4 cursor-pointer">
                      <OdsText preset={ODS_TEXT_PRESET.span}>
                        {t('hosting_add_step3_mode_OVH_autoconfigure')}
                      </OdsText>
                    </label>
                  </OdsFormField>
                  <OdsText preset={ODS_TEXT_PRESET.caption} className="ml-8 m-4">
                    {t('hosting_add_step3_mode_OVH_autoconfigure_text')}
                  </OdsText>
                </OdsCard>
              </>
            )}
            {(formValues.path === 'B' || !formValues.automaticConfiguration) && (
              <>
                <OdsText preset={ODS_TEXT_PRESET.heading6}>
                  {t(
                    `hosting_add_step2_information_mode_${
                      formValues.path === 'B' ? 'EXTERNAL' : 'OVH'
                    }`,
                  )}
                </OdsText>
                <ul>
                  {formValues.path === 'B' && existingDomains?.token && (
                    <li>
                      <Trans
                        t={t}
                        i18nKey="hosting_add_step3_insert_token_field"
                        values={{
                          t0: 'TXT',
                          t1: ovhControl,
                          t2: existingDomains.token,
                        }}
                      />
                    </li>
                  )}
                  {[
                    {
                      record: 'A',
                      label: formValues.subDomain,
                      value: hostingService?.data?.hostingIp,
                    },
                    ...(formValues.wwwNeeded
                      ? [
                          {
                            record: 'A',
                            label: displayedDomain,
                            value: hostingService?.data?.hostingIp,
                          },
                        ]
                      : []),
                    {
                      record: 'AAAA',
                      label: formValues.subDomain,
                      value: hostingService?.data?.hostingIpv6,
                    },
                    ...(formValues.wwwNeeded
                      ? [
                          {
                            record: 'AAAA',
                            label: displayedDomain,
                            value: hostingService?.data?.hostingIpv6,
                          },
                        ]
                      : []),
                  ].map((item, idx) => (
                    <li key={idx}>
                      <Trans
                        t={t}
                        i18nKey="hosting_add_step3_common_action"
                        values={{
                          t0: item.record,
                          t1: item.label,
                          t2: item.value,
                        }}
                      />
                    </li>
                  ))}
                </ul>
                <OdsMessage color={ODS_MESSAGE_COLOR.warning} isDismissible={false}>
                  {t('hosting_add_step2_mode_EXTERNAL_attention')}
                </OdsMessage>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <OdsModal
      data-testid="modal"
      color={ODS_MODAL_COLOR.neutral}
      isDismissible
      onOdsClose={closeModal}
      isOpen
    >
      <form
        onSubmit={() => {
          handleSubmit(onSubmit);
        }}
      >
        <OdsText className="mb-4" preset={ODS_TEXT_PRESET.heading4}>
          {t('hosting_add_title')}
        </OdsText>
        {renderStep()}
        <div className="flex space-x-4 justify-end mt-4">
          <OdsButton
            color={ODS_BUTTON_COLOR.primary}
            onClick={closeModal}
            variant={ODS_BUTTON_VARIANT.outline}
            label={t(`${NAMESPACES.ACTIONS}:cancel`)}
            type="button"
          />
          <OdsButton
            color={ODS_BUTTON_COLOR.primary}
            onClick={back}
            isDisabled={isFirst}
            variant={ODS_BUTTON_VARIANT.ghost}
            label={t(`${NAMESPACES.ACTIONS}:previous`)}
            type="button"
          />
          {isLast ? (
            <OdsButton
              type="submit"
              variant={ODS_BUTTON_VARIANT.default}
              color={ODS_BUTTON_COLOR.primary}
              label={t(`${NAMESPACES.ACTIONS}:validate`)}
            />
          ) : (
            <OdsButton
              type="button"
              variant={ODS_BUTTON_VARIANT.default}
              color={ODS_BUTTON_COLOR.primary}
              label={t(`${NAMESPACES.ACTIONS}:next`)}
              onClick={next}
              isDisabled={isNextButtonDisabled()}
            />
          )}
        </div>
      </form>
    </OdsModal>
  );
}
