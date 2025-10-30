import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsInput,
  OdsQuantity,
  OdsRadio,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/manager-react-components';

import { CDN_ADVANCED } from '@/constants';
import {
  useCreateCdnOption,
  useGetCdnOption,
  useGetServiceNameCdn,
  useUpdateCdnOptions,
} from '@/data/hooks/cdn/useCdn';
import { CdnOption, CdnOptionType, PatternType } from '@/data/types/product/cdn';
import { convertToTtl, convertToUnitTime } from '@/utils/cdn';

const formSchema = z.object({
  ruleName: z.string(),
  patternType: z.string(),
  pattern: z.string(),
  ttl: z.number(),
  ttlUnit: z.string(),
  priority: z.number(),
});
type FormData = z.infer<typeof formSchema>;

export default function CdnCacheRuleModal() {
  const { serviceName, domain } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const modifiedOption = location.state as CdnOption;
  const { t } = useTranslation(['dashboard', NAMESPACES.ACTIONS]);
  const serviceNameCdn = useGetServiceNameCdn(serviceName);
  const optionsData = useGetCdnOption(serviceName, domain);
  const { createCdnOption } = useCreateCdnOption(serviceName, domain);
  const { updateCdnOptions } = useUpdateCdnOptions(serviceName, domain);
  const enableOnlyExtension = serviceNameCdn?.data?.type !== CDN_ADVANCED;
  const unitTime = convertToUnitTime(modifiedOption?.config?.ttl, t);
  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm<FormData>({
    defaultValues: {
      ruleName: modifiedOption?.name || '',
      patternType: modifiedOption?.config?.patternType || 'extension',
      pattern: modifiedOption?.pattern || '',
      ttl: unitTime?.timeValue || null,
      ttlUnit: unitTime?.timeUnit || null,
      priority: modifiedOption?.config?.priority || null,
    },
    resolver: zodResolver(formSchema),
  });
  const ruleValues = watch();
  const canValidate = modifiedOption
    ? isDirty
    : Object.values(ruleValues).every((value) => Boolean(value));

  const onClose = () => {
    navigate(-1);
  };

  const onSubmit = (data: FormData) => {
    const cdnOption = {
      type: CdnOptionType.CACHE_RULE,
      name: data?.ruleName,
      pattern: data?.pattern,
      enabled: true,
      config: {
        ttl: convertToTtl(data?.ttl, data?.ttlUnit, t),
        priority: data?.priority,
        patternType: data?.patternType as PatternType,
      },
    };
    const updatePriority = optionsData?.data?.find(
      (item) => item?.config?.priority === data?.priority,
    );
    const optionsToUpdate = updatePriority
      ? optionsData?.data
          ?.filter(
            (option) =>
              option?.type === CdnOptionType.CACHE_RULE &&
              option?.config?.priority >= data?.priority,
          )
          .map((option) => ({
            ...option,
            config: {
              ...option?.config,
              priority: option?.config?.priority + 1,
            },
          }))
      : [];
    const cdnOptions = modifiedOption ? [cdnOption, ...optionsToUpdate] : optionsToUpdate;

    if (!modifiedOption) createCdnOption({ cdnOption });
    if (cdnOptions.length) updateCdnOptions({ cdnOptions });
    onClose();
  };

  return (
    <form>
      <Modal
        heading={
          modifiedOption
            ? t('cdn_shared_modal_set_rule_title', {
                ruleName: modifiedOption?.name,
              })
            : t('cdn_shared_modal_add_rule_title')
        }
        onDismiss={onClose}
        isOpen
        primaryLabel={t(
          `cdn_shared_modal_add_rule_btn_${modifiedOption ? 'set_rule' : 'validate_rule'}`,
        )}
        secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
        onSecondaryButtonClick={onClose}
        onPrimaryButtonClick={() => void handleSubmit(onSubmit)()}
        isPrimaryButtonDisabled={!canValidate}
      >
        <div className="flex flex-col space-y-3">
          <OdsText>{t('cdn_shared_modal_add_rule_info')}</OdsText>
          <OdsText preset={ODS_TEXT_PRESET.caption} className="mt-6">
            {t('cdn_shared_option_cache_rule_table_header_rule_name')}
          </OdsText>
          <Controller
            name="ruleName"
            control={control}
            render={({ field }) => (
              <OdsInput
                name="ruleName"
                type="text"
                isDisabled={Boolean(modifiedOption)}
                value={field.value}
                onOdsChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          <OdsText preset={ODS_TEXT_PRESET.caption} className="mt-6">
            {t('cdn_shared_modal_add_rule_field_resource_type')}
          </OdsText>
          <OdsText>
            {t(`cdn_shared_modal_add_rule_${enableOnlyExtension ? 'resource_info' : 'info'}`)}
          </OdsText>
          <Controller
            name="patternType"
            control={control}
            render={({ field }) => (
              <>
                <div className="flex gap-4 items-center">
                  <OdsRadio
                    {...field}
                    value="extension"
                    isChecked={field.value === 'extension'}
                    isDisabled={Boolean(modifiedOption)}
                    onOdsChange={() => field.onChange('extension')}
                  />
                  <label>
                    <OdsText preset={ODS_TEXT_PRESET.span}>
                      {t('cdn_shared_modal_add_rule_field_resource_extension')}
                    </OdsText>
                  </label>
                </div>
                <div className="flex gap-4 items-center">
                  <OdsRadio
                    {...field}
                    value="folder"
                    isChecked={field.value === 'folder'}
                    isDisabled={enableOnlyExtension}
                    onOdsChange={() => field.onChange('folder')}
                  />
                  <label>
                    <OdsText preset={ODS_TEXT_PRESET.span}>
                      {t('cdn_shared_modal_add_rule_field_resource_folder')}
                    </OdsText>
                  </label>
                </div>
                <div className="flex gap-4 items-center">
                  <OdsRadio
                    {...field}
                    value="regex"
                    isChecked={field.value === 'regex'}
                    isDisabled={enableOnlyExtension}
                    onOdsChange={() => field.onChange('regex')}
                  />
                  <label>
                    <OdsText preset={ODS_TEXT_PRESET.span}>
                      {t('cdn_shared_modal_add_rule_field_resource_regex')}
                    </OdsText>
                  </label>
                </div>
                <div className="flex gap-4 items-center">
                  <OdsRadio
                    {...field}
                    value="uri"
                    isChecked={field.value === 'uri'}
                    isDisabled={enableOnlyExtension}
                    onOdsChange={() => field.onChange('uri')}
                  />
                  <label>
                    <OdsText preset={ODS_TEXT_PRESET.span}>
                      {t('cdn_shared_modal_add_rule_field_resource_uri')}
                    </OdsText>
                  </label>
                </div>
              </>
            )}
          />
          <OdsText preset={ODS_TEXT_PRESET.caption} className="mt-6">
            {t('cdn_shared_modal_add_rule_field_resource')}
          </OdsText>
          <OdsText>{t('cdn_shared_modal_add_rule_field_resource_extension_info')}</OdsText>
          <Controller
            name="pattern"
            control={control}
            render={({ field }) => (
              <OdsInput
                name="pattern"
                type="text"
                value={field.value}
                isDisabled={Boolean(modifiedOption)}
                onOdsChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          <OdsText preset={ODS_TEXT_PRESET.caption} className="mt-6">
            {t('cdn_shared_modal_add_rule_field_time_to_live')}
          </OdsText>
          <OdsText>{t('cdn_shared_modal_add_rule_field_time_to_live_info')}</OdsText>
          <div className="flex flex-row">
            <Controller
              name="ttl"
              control={control}
              render={({ field }) => (
                <OdsInput
                  name="ttl"
                  type="number"
                  value={field.value}
                  onOdsChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              name="ttlUnit"
              control={control}
              render={({ field }) => (
                <OdsSelect
                  className="w-2/6"
                  name="ttlUnit"
                  value={field.value}
                  onOdsChange={(e) => field.onChange(e.target.value)}
                >
                  <option
                    key="unit_minutes"
                    value={t('cdn_shared_modal_add_rule_field_time_to_live_unit_minutes')}
                  >
                    {t('cdn_shared_modal_add_rule_field_time_to_live_unit_minutes')}
                  </option>
                  <option
                    key="unit_hours"
                    value={t('cdn_shared_modal_add_rule_field_time_to_live_unit_hours')}
                  >
                    {t('cdn_shared_modal_add_rule_field_time_to_live_unit_hours')}
                  </option>
                  <option
                    key="unit_days"
                    value={t('cdn_shared_modal_add_rule_field_time_to_live_unit_days')}
                  >
                    {t('cdn_shared_modal_add_rule_field_time_to_live_unit_days')}
                  </option>
                </OdsSelect>
              )}
            />
          </div>
          <OdsText preset={ODS_TEXT_PRESET.caption} className="mt-6">
            {t('cdn_shared_modal_add_rule_field_order_by')}
          </OdsText>
          <OdsText>{t('cdn_shared_modal_add_rule_field_order_by_info')}</OdsText>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <OdsQuantity
                min={1}
                value={field.value}
                name="priority"
                className="mt-2 block"
                onOdsChange={(e) => field.onChange(e.detail.value)}
              />
            )}
          />
        </div>
      </Modal>
    </form>
  );
}
