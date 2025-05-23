import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { aapi } from '@ovh-ux/manager-core-api';

import {
  OdsButton,
  OdsCard,
  OdsModal,
  OdsInput,
  OdsRadio,
  OdsText,
  OdsCheckbox,
  OdsFormField,
  OdsSelect,
  OdsTooltip,
  OdsMessage,
  OdsIcon,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_COLOR,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useNotifications } from '@ovh-ux/manager-react-components';

import {
  useCreateAttachedDomainsService,
  useGetDomainZone,
  useGetHostingService,
} from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';
import { isValidDomain } from '@/utils/validator';
import {
  HostingCountries,
  HostingDomainStatus,
  TExistingDomain,
} from '@/data/type';
import { subRoutes, urls } from '@/routes/routes.constants';

interface FormState {
  path: 'A' | 'B';
  domain?: string;
  subDomain: string;
  wwwNeeded: boolean;
  folder: string;
  ip?: boolean;
  selectedIp?: HostingCountries;
  firewall?: boolean;
  logs?: boolean;
  domainLogs?: string;
  automaticConfiguration?: boolean;
}
const initialState: FormState = {
  path: 'A',
  subDomain: '',
  folder: '',
  wwwNeeded: true,
  automaticConfiguration: true,
};

export default function SectigoModal() {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const closeModal = () =>
    navigate(urls.ssl.replace(subRoutes.serviceName, serviceName));
  const { data } = useGetHostingService(serviceName);
  const domainZone = useGetDomainZone();
  const { addSuccess, addWarning } = useNotifications();
  const { t } = useTranslation('dashboard');
  const [step, setStep] = useState<number | null>(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [existingDomains, setExistingDomains] = useState<TExistingDomain>();
  const [searchedDomain, setSearchedDomain] = useState<string>('');

  useEffect(() => {
    (async () => {
      if (step === 1) {
        const res = await aapi.get<TExistingDomain>(
          `/sws/hosting/web/${serviceName}/add-domain-existing?tokenNeeded=${form?.path ===
            'B'}`,
        );
        setExistingDomains(res?.data);
      }
    })();
  }, [step, serviceName, form?.path]);

  const { createAttachedDomainsService } = useCreateAttachedDomainsService(
    serviceName,
    () => {
      addSuccess(
        t('hosting_tab_DOMAINS_configuration_add_success_finish'),
        true,
      );
    },
    () => {
      addWarning(t('hosting_tab_DOMAINS_configuration_add_failure'), true);
    },
  );

  const isFirst = step === 0;
  const isLast = step === 2;
  const completeDomain =
    form?.path === 'A' ? `${form?.subDomain}.${form?.domain}` : form?.subDomain;

  const next = () => !isLast && setStep((s) => s + 1);
  const back = () => !isFirst && setStep((s) => s - 1);
  const isNextButtonDisabled = () => {
    switch (step) {
      case 0:
        return form?.path === 'A' && !form?.domain;
      case 1:
        return (
          !form?.subDomain ||
          !isValidDomain(completeDomain) ||
          (form?.logs && !form?.domainLogs) ||
          existingDomains?.existingDomains.includes(completeDomain)
        );
      default:
        return false;
    }
  };
  const updateField = <K extends keyof FormState>(patch: Pick<FormState, K>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const onValidate = () => {
    createAttachedDomainsService({
      domain: completeDomain,
      ssl: true,
      path: `./${form?.folder}`,
      cdn: HostingDomainStatus.NONE,
      ownLog: form?.logs ? form?.domainLogs : null,
      firewall: form?.firewall
        ? HostingDomainStatus.ACTIVE
        : HostingDomainStatus.NONE,
      wwwNeeded: form?.wwwNeeded,
      bypassDNSConfiguration: form?.automaticConfiguration,
      ipLocation: form?.selectedIp,
    });
    closeModal();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col space-y-8 mb-10">
            <Trans
              t={t}
              i18nKey="hosting_add_step1_title"
              values={{ displayName: data?.displayName || serviceName }}
            />
            <div className="flex gap-4 items-center">
              <OdsRadio
                name="radio-add-registered"
                value="A"
                isChecked={form.path === 'A'}
                onOdsChange={() => updateField({ path: 'A' })}
              />
              <label>
                <OdsText preset="span">{t('hosting_add_step1_ovh')}</OdsText>
              </label>
            </div>
            {form.path === 'A' && (
              <>
                <OdsInput
                  name="search-domain"
                  type={ODS_INPUT_TYPE.search}
                  value={searchedDomain}
                  onOdsChange={(e) =>
                    setSearchedDomain(e.target.value as string)
                  }
                  ariaLabel="edit-input"
                />
                <select
                  className="mt-3 w-100"
                  name="domain-selector"
                  value={form?.domain}
                  size={6}
                  onChange={(event) => {
                    updateField({ domain: event.target.value as string });
                  }}
                >
                  {domainZone?.data?.map((item) => {
                    return (
                      <option value={item} key={item}>
                        {item}
                      </option>
                    );
                  })}
                </select>
              </>
            )}
            <div className="flex gap-4 items-center">
              <OdsRadio
                name="radio-add-external"
                value="B"
                isChecked={form.path === 'B'}
                onOdsChange={() => updateField({ path: 'B' })}
              />
              <label>
                <OdsText preset="span">
                  {t('hosting_add_step1_external')}
                </OdsText>
              </label>
            </div>
          </div>
        );
      case 1:
        return form.path === 'A' ? (
          <div className="flex flex-col space-y-8 mb-10">
            <OdsText>{t('hosting_add_step2_mode_OVH_question')}</OdsText>
            <div>
              <OdsText preset={ODS_TEXT_PRESET.caption}>
                {t('hosting_add_step2_mode_OVH_domain_name')}
              </OdsText>
              <div>
                <OdsInput
                  className="w-2/3"
                  name="sub-domain"
                  type="text"
                  value={form?.subDomain}
                  onOdsChange={(e) =>
                    updateField({ subDomain: e.target.value as string })
                  }
                  placeholder={t(
                    'hosting_add_step2_mode_OVH_domain_name_placeholder',
                  )}
                />
                <OdsButton
                  size="sm"
                  variant={ODS_BUTTON_VARIANT.outline}
                  label={form?.domain}
                />
              </div>
              {isValidDomain(`${form?.subDomain}.${form?.domain}`) && (
                <OdsFormField className="flex flex-row mt-4">
                  <OdsCheckbox
                    name="www-needed"
                    inputId="www-needed"
                    isChecked={form.wwwNeeded}
                    onOdsChange={() =>
                      updateField({ wwwNeeded: !form?.wwwNeeded })
                    }
                  />
                  <label className="ml-4 cursor-pointer" htmlFor="wwwNeeded">
                    <OdsText preset={ODS_TEXT_PRESET.span}>
                      {t(
                        'hosting_add_step2_mode_OVH_domain_name_www_question',
                        {
                          t0: form?.subDomain,
                        },
                      )}
                    </OdsText>
                  </label>
                </OdsFormField>
              )}
            </div>
            <div>
              <OdsText preset={ODS_TEXT_PRESET.caption}>
                {t('hosting_multisite_domain_configuration_home')}
              </OdsText>
              <div>
                <OdsButton
                  size="sm"
                  variant={ODS_BUTTON_VARIANT.outline}
                  label="./"
                />
                <OdsInput
                  className="w-2/3"
                  name="file-folder"
                  type="text"
                  value={form?.folder}
                  onOdsChange={(e) =>
                    updateField({ folder: e.target.value as string })
                  }
                  placeholder={t(
                    'hosting_multisite_domain_configuration_myfolder',
                  )}
                />
              </div>
            </div>
            <div className="space-y-4">
              <OdsText preset={ODS_TEXT_PRESET.caption}>
                {t('hosting_add_step2_mode_OVH_options_choose')}
              </OdsText>
              <OdsFormField className="flex flex-row items-center">
                <OdsCheckbox
                  name="country-ip"
                  inputId="country-ip"
                  isChecked={form.ip}
                  onOdsChange={() => updateField({ ip: !form?.ip })}
                />
                <label className="ml-2 cursor-pointer" htmlFor="country-ip">
                  <OdsText preset={ODS_TEXT_PRESET.span}>
                    {t('hosting_multisite_domain_configuration_countriesIp')}
                  </OdsText>
                </label>
                <OdsIcon
                  id="ip-tooltip-trigger"
                  className="color-disabled cursor-pointer"
                  name="circle-question"
                />
                <OdsTooltip triggerId="ip-tooltip-trigger">
                  <OdsText>
                    {t(
                      'hosting_multisite_domain_configuration_country_ip_help',
                    )}
                  </OdsText>
                </OdsTooltip>
              </OdsFormField>
              {form?.ip && (
                <OdsSelect
                  id="ip-select"
                  name="ip"
                  value={form?.selectedIp}
                  onOdsChange={(event) => {
                    updateField({
                      selectedIp: event.target.value as HostingCountries,
                    });
                  }}
                >
                  {data?.countriesIp?.map((item) => {
                    return (
                      <optgroup
                        key={item?.country}
                        label={t(`country_${item?.country}`)}
                      >
                        <option key={item?.country} value={item?.country}>
                          {item?.ip}
                        </option>
                      </optgroup>
                    );
                  })}
                </OdsSelect>
              )}
              <OdsFormField className="flex flex-row items-center">
                <OdsCheckbox
                  name="firewall"
                  inputId="firewall"
                  isChecked={form.firewall}
                  onOdsChange={() => updateField({ firewall: !form?.firewall })}
                />
                <label className="ml-2 cursor-pointer" htmlFor="firewall">
                  <OdsText preset={ODS_TEXT_PRESET.span}>
                    {t('hosting_multisite_domain_configuration_firewall')}
                  </OdsText>
                </label>
              </OdsFormField>
              <OdsFormField className="flex flex-row items-center">
                <OdsCheckbox
                  name="logs"
                  inputId="logs"
                  isChecked={form.logs}
                  onOdsChange={() => updateField({ logs: !form?.logs })}
                />
                <label className="ml-2 cursor-pointer" htmlFor="logs">
                  <OdsText preset={ODS_TEXT_PRESET.span}>
                    {t('hosting_multisite_domain_configuration_ownlog')}
                  </OdsText>
                </label>
              </OdsFormField>
              {form?.logs && (
                <OdsSelect
                  id="logs-select"
                  name="logs-select"
                  onOdsChange={(event) => {
                    updateField({ domainLogs: event.target.value as string });
                  }}
                >
                  {domainZone?.data?.map((item) => {
                    return (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </OdsSelect>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-8 mb-10">
            <OdsText>{t('hosting_add_step2_mode_EXTERNAL_question')}</OdsText>
            <div className="flex flex-row ml-6">
              <OdsText className="w-1/3">
                {t('hosting_add_step2_mode_EXTERNAL_domain_name')}
              </OdsText>
              <OdsInput
                className="w-2/3"
                name="sub-domain"
                type="text"
                value={form?.subDomain}
                onOdsChange={(e) =>
                  updateField({ subDomain: e.target.value as string })
                }
                placeholder={t(
                  'hosting_add_step2_mode_EXTERNAL_domain_name_placeholder',
                )}
              />
            </div>
            {form?.subDomain && isValidDomain(form?.subDomain) && (
              <OdsFormField className="flex flex-row items-end">
                <OdsCheckbox
                  name="www-needed"
                  inputId="www-needed"
                  isChecked={form.wwwNeeded}
                  onOdsChange={() =>
                    updateField({ wwwNeeded: !form?.wwwNeeded })
                  }
                />
                <label className="ml-4 cursor-pointer" htmlFor="wwwNeeded">
                  <OdsText preset={ODS_TEXT_PRESET.span}>
                    {t('hosting_add_step2_mode_OVH_domain_name_www_question', {
                      t0: form?.subDomain,
                    })}
                  </OdsText>
                </label>
              </OdsFormField>
            )}
            <div className="flex flex-row ml-6">
              <OdsText className="w-1/3">
                {t('hosting_add_step2_mode_EXTERNAL_home')}
              </OdsText>
              <div className="w-2/3">
                <OdsButton
                  size="sm"
                  variant={ODS_BUTTON_VARIANT.outline}
                  label="./"
                />
                <OdsInput
                  className="w-10/12"
                  name="sub-domain"
                  type="text"
                  value={form?.folder}
                  onOdsChange={(e) =>
                    updateField({ folder: e.target.value as string })
                  }
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col space-y-8 mb-10 mt-5">
            <OdsText>{t('hosting_add_step3_summary')}</OdsText>
            <div className="flex flex-row">
              <OdsText
                preset={ODS_TEXT_PRESET.heading6}
                className="flex justify-end mr-10 w-1/2"
              >
                {t('hosting_add_step3_domain_name')}
              </OdsText>
              <OdsText className="w-1/2">{form?.subDomain}</OdsText>
            </div>
            {form?.wwwNeeded && (
              <div className="flex flex-row">
                <OdsText
                  preset={ODS_TEXT_PRESET.heading6}
                  className="flex justify-end mr-10 w-1/2"
                >
                  {t('hosting_add_step3_domain_name')}
                </OdsText>
                <OdsText className="w-1/2">
                  {t('hosting_add_step3_www_domain', {
                    domain: form?.subDomain,
                  })}
                </OdsText>
              </div>
            )}
            <div className="flex flex-row">
              <OdsText
                preset={ODS_TEXT_PRESET.heading6}
                className="flex justify-end mr-10 w-1/2"
              >
                {t('hosting_add_step3_home')}
              </OdsText>
              <OdsText className="w-1/2">
                {t('hosting_add_step3_folder', {
                  name: form?.folder,
                })}
              </OdsText>
            </div>
            {form?.path === 'A' && (
              <>
                {form?.ip && (
                  <div className="flex flex-row">
                    <OdsText
                      preset={ODS_TEXT_PRESET.heading6}
                      className="flex justify-end mr-10 w-1/2"
                    >
                      {t('hosting_multisite_domain_configuration_countriesIp')}
                    </OdsText>
                    <OdsText className="w-1/2">
                      {form?.selectedIp || data?.hostingIp}
                    </OdsText>
                  </div>
                )}
                <div className="flex flex-row">
                  <OdsText
                    preset={ODS_TEXT_PRESET.heading6}
                    className="flex justify-end mr-10 w-1/2"
                  >
                    {t('hosting_multisite_domain_configuration_cdn')}
                  </OdsText>
                  <OdsText className="w-1/2">
                    {t('hosting_add_step3_disabled')}
                  </OdsText>
                </div>
                <div className="flex flex-row">
                  <OdsText
                    preset={ODS_TEXT_PRESET.heading6}
                    className="flex justify-end mr-10 w-1/2"
                  >
                    {t('hosting_multisite_domain_configuration_ssl')}
                  </OdsText>
                  <OdsText className="w-1/2">
                    {t('hosting_add_step3_enabled')}
                  </OdsText>
                </div>
                <div className="flex flex-row">
                  <OdsText
                    preset={ODS_TEXT_PRESET.heading6}
                    className="flex justify-end mr-10 w-1/2"
                  >
                    {t('hosting_add_step3_firewall')}
                  </OdsText>
                  <OdsText className="w-1/2">
                    {t(
                      `hosting_add_step3_${
                        form?.firewall ? 'enabled' : 'disabled'
                      }`,
                    )}
                  </OdsText>
                </div>
                <div className="flex flex-row">
                  <OdsText
                    preset={ODS_TEXT_PRESET.heading6}
                    className="flex justify-end mr-10 w-1/2"
                  >
                    {t('hosting_add_step3_ownlog')}
                  </OdsText>
                  <OdsText className="w-1/2">
                    {t(
                      `hosting_add_step3_${
                        form?.logs ? 'enabled' : 'disabled'
                      }`,
                    )}
                  </OdsText>
                </div>
                <OdsCard>
                  <OdsFormField className="flex flex-row items-end m-4">
                    <OdsCheckbox
                      name="automatic-configuration"
                      inputId="automatic-configuration"
                      isChecked={form?.automaticConfiguration}
                      onOdsChange={() =>
                        updateField({
                          automaticConfiguration: !form?.automaticConfiguration,
                        })
                      }
                    />
                    <label
                      className="ml-4 cursor-pointer"
                      htmlFor="automaticConfiguration"
                    >
                      <OdsText preset={ODS_TEXT_PRESET.span}>
                        {t('hosting_add_step3_mode_OVH_autoconfigure')}
                      </OdsText>
                    </label>
                  </OdsFormField>
                  <OdsText
                    preset={ODS_TEXT_PRESET.caption}
                    className="ml-8 m-4"
                  >
                    {t('hosting_add_step3_mode_OVH_autoconfigure_text')}
                  </OdsText>
                </OdsCard>
              </>
            )}

            {(form?.path === 'B' || !form?.automaticConfiguration) && (
              <>
                <OdsText preset={ODS_TEXT_PRESET.heading6}>
                  {t(
                    `hosting_add_step2_information_mode_${
                      form?.path === 'B' ? 'EXTERNAL' : 'OVH'
                    }`,
                  )}
                </OdsText>
                <ul>
                  {form?.path === 'B' && (
                    <li>
                      <Trans
                        t={t}
                        i18nKey="hosting_add_step3_insert_token_field"
                        values={{
                          t0: 'TXT',
                          t1: t('hosting_add_step3_ovh_control', {
                            domain: form?.subDomain,
                          }),
                          t2: existingDomains?.token,
                        }}
                      />
                    </li>
                  )}
                  <li>
                    <Trans
                      t={t}
                      i18nKey="hosting_add_step3_common_action"
                      values={{
                        t0: 'A',
                        t1: form?.subDomain,
                        t2: data?.hostingIp,
                      }}
                    />
                  </li>
                  {form?.wwwNeeded && (
                    <li>
                      <Trans
                        t={t}
                        i18nKey="hosting_add_step3_common_action"
                        values={{
                          t0: 'A',
                          t1: t('hosting_add_step3_www_domain', {
                            domain: form?.subDomain,
                          }),
                          t2: data?.hostingIp,
                        }}
                      />
                    </li>
                  )}
                  <li>
                    <Trans
                      t={t}
                      i18nKey="hosting_add_step3_common_action"
                      values={{
                        t0: 'AAAA',
                        t1: form?.subDomain,
                        t2: data?.hostingIpv6,
                      }}
                    />
                  </li>
                  {form?.wwwNeeded && (
                    <li>
                      <Trans
                        t={t}
                        i18nKey="hosting_add_step3_common_action"
                        values={{
                          t0: 'AAAA',
                          t1: t('hosting_add_step3_www_domain', {
                            domain: form?.subDomain,
                          }),
                          t2: data?.hostingIpv6,
                        }}
                      />
                    </li>
                  )}
                </ul>
                <OdsMessage
                  className="w-full"
                  color={ODS_MESSAGE_COLOR.warning}
                  isDismissible={false}
                >
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
      <OdsText className="mb-4" preset={ODS_TEXT_PRESET.heading4}>
        {t('hosting_add_title')}
      </OdsText>
      {renderStep()}
      <div className="flex space-x-4 justify-end">
        <OdsButton
          color={ODS_BUTTON_COLOR.primary}
          onClick={closeModal}
          variant={ODS_BUTTON_VARIANT.outline}
          label={t('buttons_cancel')}
          className="mt-4"
          type="button"
        />
        <OdsButton
          color={ODS_BUTTON_COLOR.primary}
          onClick={back}
          isDisabled={isFirst}
          variant={ODS_BUTTON_VARIANT.ghost}
          label={t('buttons_back')}
          className="mt-4"
          type="button"
        />
        <OdsButton
          color={ODS_BUTTON_COLOR.primary}
          onClick={isLast ? onValidate : next}
          variant={ODS_BUTTON_VARIANT.default}
          isDisabled={isNextButtonDisabled()}
          label={t(isLast ? 'buttons_validate' : 'buttons_next')}
          className="mt-4"
          type="button"
        />
      </div>
    </OdsModal>
  );
}
