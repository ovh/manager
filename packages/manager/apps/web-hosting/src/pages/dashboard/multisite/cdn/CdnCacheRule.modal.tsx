import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import {
  Input,
  Quantity,
  QuantityControl,
  QuantityInput,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  Select,
  SelectContent,
  SelectControl,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/muk';

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
    watch,
    formState: { isDirty },
  } = useForm<FormData>({
    defaultValues: {
      ruleName: modifiedOption?.name || '',
      patternType: modifiedOption?.config?.patternType || 'extension',
      pattern: modifiedOption?.pattern || '',
      ttl: unitTime?.timeValue || 0,
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
        priority: Number(data?.priority),
        patternType: data?.patternType as PatternType,
      },
    };
    const updatePriority = optionsData?.data?.find(
      (item) => item?.config?.priority === Number(data?.priority),
    );
    const optionsToUpdate = updatePriority
      ? optionsData?.data
          ?.filter(
            (option) =>
              option?.type === CdnOptionType.CACHE_RULE &&
              option?.config?.priority >= Number(data?.priority),
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
    <Modal
      heading={
        modifiedOption
          ? t('cdn_shared_modal_set_rule_title', {
              ruleName: modifiedOption?.name,
            })
          : t('cdn_shared_modal_add_rule_title')
      }
      dismissible={true}
      open={true}
      onOpenChange={onClose}
      primaryButton={{
        label: t(`cdn_shared_modal_add_rule_btn_${modifiedOption ? 'set_rule' : 'validate_rule'}`),
        onClick: () => onSubmit(ruleValues),
        disabled: !canValidate,
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: onClose,
      }}
    >
      <div className="flex flex-col space-y-3">
        <Text>{t('cdn_shared_modal_add_rule_info')}</Text>
        <Text preset={TEXT_PRESET.caption} className="mt-6">
          {t('cdn_shared_option_cache_rule_table_header_rule_name')}
        </Text>
        <Controller
          name="ruleName"
          control={control}
          render={({ field }) => (
            <Input
              name="ruleName"
              type="text"
              disabled={Boolean(modifiedOption)}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        <Text preset={TEXT_PRESET.caption} className="mt-6">
          {t('cdn_shared_modal_add_rule_field_resource_type')}
        </Text>
        <Text>
          {t(`cdn_shared_modal_add_rule_${enableOnlyExtension ? 'resource_info' : 'info'}`)}
        </Text>
        <Controller
          name="patternType"
          control={control}
          render={({ field }) => (
            <>
              <RadioGroup value={field.value} onChange={field.onChange}>
                <div className="flex items-center gap-4">
                  <Radio {...field} value="extension" disabled={Boolean(modifiedOption)}>
                    <RadioControl />
                    <RadioLabel>
                      <Text preset={TEXT_PRESET.span}>
                        {t('cdn_shared_modal_add_rule_field_resource_extension')}
                      </Text>
                    </RadioLabel>
                  </Radio>
                </div>
                <div className="flex items-center gap-4">
                  <Radio {...field} value="folder" disabled={enableOnlyExtension}>
                    <RadioControl />
                    <RadioLabel>
                      <Text preset={TEXT_PRESET.span}>
                        {t('cdn_shared_modal_add_rule_field_resource_folder')}
                      </Text>
                    </RadioLabel>
                  </Radio>
                </div>
                <div className="flex items-center gap-4">
                  <Radio {...field} value="regex" disabled={enableOnlyExtension}>
                    <RadioControl />
                    <RadioLabel>
                      <Text preset={TEXT_PRESET.span}>
                        {t('cdn_shared_modal_add_rule_field_resource_regex')}
                      </Text>
                    </RadioLabel>
                  </Radio>
                </div>
                <div className="flex items-center gap-4">
                  <Radio {...field} value="uri" disabled={enableOnlyExtension}>
                    <RadioControl />
                    <RadioLabel>
                      <Text preset={TEXT_PRESET.span}>
                        {t('cdn_shared_modal_add_rule_field_resource_uri')}
                      </Text>
                    </RadioLabel>
                  </Radio>
                </div>
              </RadioGroup>
            </>
          )}
        />
        <Text preset={TEXT_PRESET.caption} className="mt-6">
          {t('cdn_shared_modal_add_rule_field_resource')}
        </Text>
        <Text>{t('cdn_shared_modal_add_rule_field_resource_extension_info')}</Text>
        <Controller
          name="pattern"
          control={control}
          render={({ field }) => (
            <Input
              name="pattern"
              type="text"
              value={field.value}
              disabled={Boolean(modifiedOption)}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        <Text preset={TEXT_PRESET.caption} className="mt-6">
          {t('cdn_shared_modal_add_rule_field_time_to_live')}
        </Text>
        <Text>{t('cdn_shared_modal_add_rule_field_time_to_live_info')}</Text>
        <div className="flex flex-row">
          <Controller
            name="ttl"
            control={control}
            render={({ field }) => (
              <Input
                name="ttl"
                type="number"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          <Controller
            name="ttlUnit"
            control={control}
            render={({ field }) => (
              <Select
                className="w-2/6"
                id="ttlUnit"
                data-testid="ttlUnit"
                name="ttlUnit"
                value={field.value ? [field.value] : []}
                onValueChange={(detail) => field.onChange(detail.value[0])}
                items={[
                  {
                    label: t('cdn_shared_modal_add_rule_field_time_to_live_unit_minutes'),
                    value: t('cdn_shared_modal_add_rule_field_time_to_live_unit_minutes'),
                  },
                  {
                    label: t('cdn_shared_modal_add_rule_field_time_to_live_unit_hours'),
                    value: t('cdn_shared_modal_add_rule_field_time_to_live_unit_hours'),
                  },
                  {
                    label: t('cdn_shared_modal_add_rule_field_time_to_live_unit_days'),
                    value: t('cdn_shared_modal_add_rule_field_time_to_live_unit_days'),
                  },
                ]}
              >
                <SelectControl
                  aria-label={t('cdn_shared_modal_add_rule_field_time_to_live_unit_minutes')}
                />
                <SelectContent />
              </Select>
            )}
          />
        </div>
        <Text preset={TEXT_PRESET.caption} className="mt-6">
          {t('cdn_shared_modal_add_rule_field_order_by')}
        </Text>
        <Text>{t('cdn_shared_modal_add_rule_field_order_by_info')}</Text>
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <Quantity
              min={1}
              name="priority"
              className="mt-2 block"
              onValueChange={(detail) => field.onChange(detail.value[0])}
            >
              <QuantityControl>
                <QuantityInput />
              </QuantityControl>
            </Quantity>
          )}
        />
      </div>
    </Modal>
  );
}
