import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Button,
  Card,
  Checkbox,
  FormField,
  ICON_NAME,
  INPUT_TYPE,
  Icon,
  Input,
  MESSAGE_COLOR,
  MODAL_COLOR,
  Message,
  Radio,
  Select,
  TEXT_PRESET,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/muk';

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
  selectedIp: z.string().array().optional(),
  domainLogs: z.string().array().optional(),
  firewall: z.boolean().optional(),
  logs: z.boolean().optional(),
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
      selectedIp: [],
      domainLogs: [],
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
      ownLog: data?.logs ? data?.domainLogs?.[0] : undefined,
      firewall: data?.firewall ? HostingDomainStatus.ACTIVE : HostingDomainStatus.NONE,
      wwwNeeded: data?.wwwNeeded,
      bypassDNSConfiguration: data?.automaticConfiguration,
      ipLocation: data?.selectedIp?.[0] as HostingCountries,
    });
    closeModal();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col space-y-8 mb-10">
            <div>
              <Text>{t('hosting_add_step1_title')}</Text>
              <Text preset={TEXT_PRESET.heading6}>
                {hostingService?.data?.displayName || serviceName}
              </Text>
            </div>
            <Controller
              name="path"
              control={control}
              render={({ field }) => (
                <>
                  <div className="flex gap-4 items-center">
                    <Radio
                      {...field}
                      value="A"
                      data-testid="radio"
                      aria-checked={field.value === 'A'}
                      onChange={() => field.onChange('A')}
                    />
                    <label>
                      <Text preset={TEXT_PRESET.span}>{t('hosting_add_step1_ovh')}</Text>
                    </label>
                  </div>
                  {field.value === 'A' && (
                    <>
                      <Controller
                        name="domain"
                        control={control}
                        render={({ field: domField }) => (
                          <>
                            <Input
                              type={INPUT_TYPE.search}
                              name="search-domain"
                              onChange={(e) => domField.onChange(e.target.value)}
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
                    <Radio
                      {...field}
                      value="B"
                      data-testid="radio_b"
                      aria-checked={field.value === 'B'}
                      onChange={() => field.onChange('B')}
                    />
                    <label>
                      <Text preset={TEXT_PRESET.span}>{t('hosting_add_step1_external')}</Text>
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
            <Text>{t('hosting_add_step2_mode_OVH_question')}</Text>
            <div>
              <Text preset={TEXT_PRESET.caption}>
                {t('hosting_add_step2_mode_OVH_domain_name')}
              </Text>
              <div className="flex items-center space-x-2">
                <Controller
                  name="subDomain"
                  control={control}
                  render={({ field }) => (
                    <Input
                      className="w-2/3"
                      name="sub-domain"
                      type="text"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder={t('hosting_add_step2_mode_OVH_domain_name_placeholder')}
                    />
                  )}
                />
                <Button size="sm" variant={BUTTON_VARIANT.outline}>
                  {formValues.domain}
                </Button>
              </div>
              {existingDomains?.existingDomains?.includes(completeDomain) ? (
                <div className="flex flex-row mt-4">
                  <Checkbox aria-disabled={true} aria-checked={true} name="www-needed" />
                  <label className="ml-4 cursor-pointer">
                    <Text preset={TEXT_PRESET.span}>
                      {t('hosting_add_step2_common_domain_exists_with_name', {
                        t0: existingCompleteDomain,
                      })}
                    </Text>
                  </label>
                </div>
              ) : (
                isValidDomain(completeDomain) && (
                  <FormField className="flex flex-row mt-4">
                    <Controller
                      name="wwwNeeded"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          aria-checked={field.value}
                          name="www-needed"
                          onChange={() => field.onChange(!field.value)}
                        />
                      )}
                    />
                    <label className="ml-4 cursor-pointer">
                      <Text preset={TEXT_PRESET.span}>
                        {t('hosting_add_step2_mode_OVH_domain_name_www_question', {
                          t0: existingCompleteDomain,
                        })}
                      </Text>
                    </label>
                  </FormField>
                )
              )}
            </div>
            <div>
              <Text preset={TEXT_PRESET.caption}>
                {t('hosting_multisite_domain_configuration_home')}
              </Text>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant={BUTTON_VARIANT.outline}>
                  ./
                </Button>
                <Controller
                  name="folder"
                  control={control}
                  render={({ field }) => (
                    <Input
                      className="w-2/3"
                      type="text"
                      name="file-folder"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder={t('hosting_multisite_domain_configuration_myfolder')}
                    />
                  )}
                />
              </div>
            </div>
            <div className="space-y-4">
              <Text preset={TEXT_PRESET.caption}>
                {t('hosting_add_step2_mode_OVH_options_choose')}
              </Text>
              <FormField className="flex flex-row items-center">
                <Controller
                  name="ip"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      name="country-ip"
                      aria-checked={field.value}
                      onChange={() => field.onChange(!field.value)}
                    />
                  )}
                />
                <label className="ml-2 cursor-pointer">
                  <Text preset={TEXT_PRESET.span}>
                    {t('hosting_multisite_domain_configuration_countriesIp')}
                  </Text>
                </label>
                <Icon
                  id="ip-tooltip-trigger"
                  name={ICON_NAME.circleQuestion}
                  className="color-disabled cursor-pointer"
                />
                <Tooltip>
                  <TooltipTrigger asChild></TooltipTrigger>
                  <TooltipContent>
                    {t('hosting_multisite_domain_configuration_country_ip_help')}
                  </TooltipContent>
                </Tooltip>
              </FormField>
              {formValues.ip && (
                <Controller
                  name="selectedIp"
                  control={control}
                  render={({ field }) => (
                    <Select
                      name="ip"
                      value={field.value}
                      onChange={() => field.onChange(field.value)}
                      items={
                        hostingService?.data?.countriesIp?.flatMap((item) => [
                          {
                            label: t(`${NAMESPACES.COUNTRIES}:country_${item.country}`),
                            options: [
                              {
                                value: item.country,
                                label: item.ip,
                              },
                            ],
                          },
                        ]) || []
                      }
                    />
                  )}
                />
              )}
              <FormField className="flex flex-row items-center">
                <Controller
                  name="firewall"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      name="firewall"
                      aria-checked={field.value}
                      onChange={() => field.onChange(!field.value)}
                    />
                  )}
                />
                <label className="ml-2 cursor-pointer">
                  <Text preset={TEXT_PRESET.span}>
                    {t('hosting_multisite_domain_configuration_firewall')}
                  </Text>
                </label>
              </FormField>
              <FormField className="flex flex-row items-center">
                <Controller
                  name="logs"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      name="logs"
                      aria-checked={field.value}
                      onChange={() => field.onChange(!field.value)}
                    />
                  )}
                />
                <label className="ml-2 cursor-pointer">
                  <Text preset={TEXT_PRESET.span}>
                    {t('hosting_multisite_domain_configuration_ownlog')}
                  </Text>
                </label>
              </FormField>
              {formValues.logs && (
                <Controller
                  name="domainLogs"
                  control={control}
                  render={({ field }) => (
                    <Select
                      name="logs-select"
                      value={field.value}
                      onChange={() => field.onChange(field.value)}
                      items={
                        domainZone?.data?.map((item) => ({
                          value: item,
                          label: item,
                        })) || []
                      }
                    />
                  )}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-8 mb-10">
            <Text>{t('hosting_add_step2_mode_EXTERNAL_question')}</Text>
            <div>
              <Controller
                name="subDomain"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Text className="w-1/3">
                      {t('hosting_add_step2_mode_EXTERNAL_domain_name')}
                    </Text>
                    <Input
                      className="w-2/3"
                      type="text"
                      name="sub-domain"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder={t('hosting_add_step2_mode_EXTERNAL_domain_name_placeholder')}
                    />
                  </div>
                )}
              />
            </div>

            {isValidDomain(formValues.subDomain) && (
              <FormField className="flex flex-row items-end">
                <Controller
                  name="wwwNeeded"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      name="www-needed"
                      aria-checked={field.value}
                      onChange={() => field.onChange(!field.value)}
                    />
                  )}
                />
                <label className="ml-4 cursor-pointer">
                  <Text preset={TEXT_PRESET.span}>
                    {t('hosting_add_step2_mode_OVH_domain_name_www_question', {
                      t0: formValues.subDomain,
                    })}
                  </Text>
                </label>
              </FormField>
            )}
            <div className="flex items-center space-x-2">
              <Text className="w-1/3">{t('hosting_multisite_domain_configuration_home')}</Text>
              <div className="w-2/3 flex items-center space-x-2">
                <Button size="sm" variant={BUTTON_VARIANT.outline}>
                  ./
                </Button>
                <Controller
                  name="folder"
                  control={control}
                  render={({ field }) => (
                    <Input
                      className="w-10/12"
                      type="text"
                      name="folder"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
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
            <Text>{t('hosting_add_step3_summary')}</Text>
            <div className="flex">
              <Text preset={TEXT_PRESET.heading6} className="w-1/2 text-right pr-4">
                {t('hosting_add_step3_domain_name')}
              </Text>
              <Text className="w-1/2">{completeDomain}</Text>
            </div>
            {formValues.wwwNeeded && (
              <div className="flex">
                <Text preset={TEXT_PRESET.heading6} className="w-1/2 text-right pr-4">
                  {t('hosting_add_step3_domain_name')}
                </Text>
                <Text className="w-1/2">{displayedDomain}</Text>
              </div>
            )}
            <div className="flex">
              <Text preset={TEXT_PRESET.heading6} className="w-1/2 text-right pr-4">
                {t('hosting_add_step3_home')}
              </Text>
              <Text className="w-1/2">{domainFolder}</Text>
            </div>
            {formValues.path === 'A' && (
              <>
                {formValues.ip && (
                  <div className="flex">
                    <Text preset={TEXT_PRESET.heading6} className="w-1/2 text-right pr-4">
                      {t('hosting_multisite_domain_configuration_countriesIp')}
                    </Text>
                    <Text className="w-1/2">
                      {formValues.selectedIp || hostingService?.data?.hostingIp}
                    </Text>
                  </div>
                )}
                <div className="flex">
                  <Text preset={TEXT_PRESET.heading6} className="w-1/2 text-right pr-4">
                    {t('hosting_multisite_domain_configuration_cdn')}
                  </Text>
                  <Text className="w-1/2">{t(`${NAMESPACES.SERVICE}:service_state_disabled`)}</Text>
                </div>
                <div className="flex">
                  <Text preset={TEXT_PRESET.heading6} className="w-1/2 text-right pr-4">
                    {t('hosting_multisite_domain_configuration_ssl')}
                  </Text>
                  <Text className="w-1/2">{t(`${NAMESPACES.SERVICE}:service_state_enabled`)}</Text>
                </div>
                <div className="flex">
                  <Text preset={TEXT_PRESET.heading6} className="w-1/2 text-right pr-4">
                    {t('hosting_add_step3_firewall')}
                  </Text>
                  <Text className="w-1/2">
                    {t(
                      `${NAMESPACES.SERVICE}:${
                        formValues.firewall ? 'service_state_enabled' : 'service_state_disabled'
                      }`,
                    )}
                  </Text>
                </div>
                <div className="flex">
                  <Text preset={TEXT_PRESET.heading6} className="w-1/2 text-right pr-4">
                    {t('hosting_add_step3_ownlog')}
                  </Text>
                  <Text className="w-1/2">
                    {t(
                      `${NAMESPACES.SERVICE}:${
                        formValues.firewall ? 'service_state_enabled' : 'service_state_disabled'
                      }`,
                    )}
                  </Text>
                </div>
                <Card>
                  <FormField className="flex flex-row items-end m-4">
                    <Controller
                      name="automaticConfiguration"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          name="automatic-configuration"
                          aria-checked={field.value}
                          onChange={() => field.onChange(!field.value)}
                        />
                      )}
                    />
                    <label className="ml-4 cursor-pointer">
                      <Text preset={TEXT_PRESET.span}>
                        {t('hosting_add_step3_mode_OVH_autoconfigure')}
                      </Text>
                    </label>
                  </FormField>
                  <Text preset={TEXT_PRESET.caption} className="ml-8 m-4">
                    {t('hosting_add_step3_mode_OVH_autoconfigure_text')}
                  </Text>
                </Card>
              </>
            )}
            {(formValues.path === 'B' || !formValues.automaticConfiguration) && (
              <>
                <Text preset={TEXT_PRESET.heading6}>
                  {t(
                    `hosting_add_step2_information_mode_${
                      formValues.path === 'B' ? 'EXTERNAL' : 'OVH'
                    }`,
                  )}
                </Text>
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
                <Message color={MESSAGE_COLOR.warning} dismissible={false}>
                  {t('hosting_add_step2_mode_EXTERNAL_attention')}
                </Message>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      data-testid="modal"
      type={MODAL_COLOR.neutral}
      dismissible
      onOpenChange={closeModal}
      open
    >
      <form
        onSubmit={() => {
          handleSubmit(onSubmit);
        }}
      >
        <Text className="mb-4" preset={TEXT_PRESET.heading4}>
          {t('hosting_add_title')}
        </Text>
        {renderStep()}
        <div className="flex space-x-4 justify-end mt-4">
          <Button
            color={BUTTON_COLOR.primary}
            onClick={closeModal}
            variant={BUTTON_VARIANT.outline}
            data-testid="button-cancel"
          >
            {t(`${NAMESPACES.ACTIONS}:cancel`)}
          </Button>
          <Button
            color={BUTTON_COLOR.primary}
            onClick={back}
            aria-disabled={isFirst}
            variant={BUTTON_VARIANT.ghost}
            data-testid="button-previous"
          >
            {t(`${NAMESPACES.ACTIONS}:previous`)}
          </Button>
          {isLast ? (
            <Button
              type="submit"
              variant={BUTTON_VARIANT.default}
              color={BUTTON_COLOR.primary}
              data-testid="button-validate"
            >
              {t(`${NAMESPACES.ACTIONS}:validate`)}
            </Button>
          ) : (
            <Button
              variant={BUTTON_VARIANT.default}
              color={BUTTON_COLOR.primary}
              data-testid="button-next"
              onClick={next}
              aria-disabled={isNextButtonDisabled()}
            >
              {t(`${NAMESPACES.ACTIONS}:next`)}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
