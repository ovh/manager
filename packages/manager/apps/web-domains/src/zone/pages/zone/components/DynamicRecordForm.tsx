import { type Control, type UseFormWatch } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Divider,
  DIVIDER_SPACING,
  ICON_NAME,
  Message,
  MESSAGE_COLOR,
  MESSAGE_VARIANT,
  MessageIcon,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import type { AddEntrySchemaType } from '@/zone/utils/formSchema.utils';
import type {
  FieldConfig,
  FormRowConfig,
  GroupFieldConfig,
  RecordFormConfig,
} from '@/zone/types/recordFormConfig.types';
import { RECORD_FORM_CONFIGS } from '@/zone/utils/recordFormConfig';
import { SubDomainField } from '../add/components/fields/SubDomainField';
import { TtlField } from '../add/components/fields/TtlField';
import { TextField } from '../add/components/fields/TextField';
import { NumberField } from '../add/components/fields/NumberField';
import { SelectField } from '../add/components/fields/SelectField';
import { TextareaField } from '../add/components/fields/TextareaField';

// ---------------------------------------------------------------------------
// Grid helpers
// ---------------------------------------------------------------------------

const GRID_AUTO = 'grid items-start gap-4 grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))]';

function isFullWidth(
  field: Parameters<typeof RenderField>[0]['field'],
): boolean {
  if (field === 'subdomain' || field === 'ttl') return false;
  if ('colSpan' in field && field.colSpan === 4) return true;
  return false;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface DynamicRecordFormProps {
  readonly recordType: string;
  readonly control: Control<AddEntrySchemaType>;
  readonly watch: UseFormWatch<AddEntrySchemaType>;
  readonly domainSuffix: string;
  readonly hideMessage?: boolean;
}

// ---------------------------------------------------------------------------
// Field renderer
// ---------------------------------------------------------------------------

function RenderField({
  field,
  control,
  watch,
  domainSuffix,
  config,
  t,
}: {
  field: FieldConfig | GroupFieldConfig | 'subdomain' | 'ttl';
  control: Control<AddEntrySchemaType>;
  watch: UseFormWatch<AddEntrySchemaType>;
  domainSuffix: string;
  config: RecordFormConfig;
  t: (key: string) => string;
}) {
  if (field === 'subdomain') {
    return (
      <SubDomainField
        control={control}
        domainSuffix={domainSuffix}
        className="w-full"
        required={config.subDomainRequired}
        tooltip={t(config.subDomainTooltipKey)}
        placeholder="www, mail, blog…"
        labelKey={config.subDomainLabelKey}
      />
    );
  }

  if (field === 'ttl') {
    return (
      <TtlField
        control={control}
        watch={watch}
        tooltip={t('zone_page_tooltip_ttl')}
      />
    );
  }

  // Render a group of fields in a sub-grid
  if (field.type === 'group') {
    return (
      <div className={field.gridClassName}>
        {field.children.map((child) => (
          <RenderField
            key={child.name}
            field={child}
            control={control}
            watch={watch}
            domainSuffix={domainSuffix}
            config={config}
            t={t}
          />
        ))}
      </div>
    );
  }

  // Compute disabled state for conditional fields (e.g. NAPTR regex/replace)
  const isDisabled = field.disabledWhenFilled
    ? (() => {
      const siblingValue = watch(field.disabledWhenFilled as keyof AddEntrySchemaType);
      return typeof siblingValue === 'string' && siblingValue.trim() !== '';
    })()
    : false;

  // Handle visibleWhen: hide this field when the condition is not met
  if (field.visibleWhen) {
    const watchedValue = watch(field.visibleWhen.field as keyof AddEntrySchemaType);
    if (String(watchedValue ?? '') !== field.visibleWhen.value) {
      return null;
    }
  }

  const name = field.name as keyof AddEntrySchemaType;

  switch (field.type) {
    case 'text':
      return (
        <TextField
          name={name}
          control={control}
          label={t(field.labelKey)}
          required={field.required}
          tooltipText={field.tooltipKey ? t(field.tooltipKey) : undefined}
          maxLength={field.maxLength}
          disabled={isDisabled}
          readOnly={field.readOnly}
          className="w-full"
          placeholder={field.placeholder}
        />
      );

    case 'number':
      return (
        <NumberField
          name={name}
          control={control}
          label={t(field.labelKey)}
          required={field.required}
          min={field.min}
          max={field.max}
          tooltip={field.tooltipKey ? t(field.tooltipKey) : undefined}
          suffix={field.suffixKey ? t(field.suffixKey) : undefined}
          disabled={isDisabled}
          className="w-full"
          placeholder={field.placeholder}
        />
      );

    case 'select':
      return (
        <SelectField
          name={name}
          control={control}
          label={t(field.labelKey)}
          required={field.required}
          disabled={field.readOnly || isDisabled}
          items={field.items.map((item) => ({
            label: t(item.labelKey),
            value: item.value,
            ...(item.descriptionKey ? { description: t(item.descriptionKey) } : {}),
          }))}
          tooltip={field.tooltipKey ? t(field.tooltipKey) : undefined}
        />
      );

    case 'textarea':
      return (
        <TextareaField
          name={name}
          control={control}
          label={t(field.labelKey)}
          required={field.required}
          className="w-full"
          tooltip={field.tooltipKey ? t(field.tooltipKey) : undefined}
          placeholder={field.placeholder}
        />
      );

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Row renderer
// ---------------------------------------------------------------------------

function RenderRow({
  row,
  rowIndex,
  control,
  watch,
  domainSuffix,
  config,
  t,
}: {
  row: FormRowConfig;
  rowIndex: number;
  control: Control<AddEntrySchemaType>;
  watch: UseFormWatch<AddEntrySchemaType>;
  domainSuffix: string;
  config: RecordFormConfig;
  t: (key: string) => string;
}) {
  // Handle row-level visibleWhen
  if (row.visibleWhen) {
    const watchedValue = String(watch(row.visibleWhen.field as keyof AddEntrySchemaType) ?? '');
    const allowed = Array.isArray(row.visibleWhen.value)
      ? (row.visibleWhen.value as readonly string[]).includes(watchedValue)
      : watchedValue === row.visibleWhen.value;
    if (!allowed) return null;
  }

  return (
    <>
      {row.dividerBefore && <Divider spacing={DIVIDER_SPACING._12} />}
      {row.headingKey && (
        <Text preset={TEXT_PRESET.heading6} className="mb-2">
          {t(row.headingKey)}
        </Text>
      )}
      <div className={GRID_AUTO}>
        {row.fields.map((field, fieldIndex) => (
          <div
            key={typeof field === 'string' ? field : 'name' in field ? field.name : `group-${fieldIndex}`}
            className={isFullWidth(field) ? 'col-[1/-1]' : undefined}
          >
            <RenderField
              field={field}
              control={control}
              watch={watch}
              domainSuffix={domainSuffix}
              config={config}
              t={t}
            />
          </div>
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Message renderer
// ---------------------------------------------------------------------------

function RenderMessage({
  config,
  serviceName,
  fullDomain,
  target,
}: {
  config: RecordFormConfig;
  serviceName: string;
  fullDomain: string;
  target: string;
}) {
  const { t } = useTranslation('zone');
  const { message } = config;
  const values: Record<string, string> = {
    domain: message.usesServiceName ? serviceName : fullDomain,
  };
  if (message.targetVarName) {
    values[message.targetVarName] = target || (message.targetFallbackKey ? t(message.targetFallbackKey) : '');
  }

  return (
    <Message color={MESSAGE_COLOR.information} dismissible={false}>
      <MessageIcon name={ICON_NAME.circleInfo} />
      <div>
        {t(message.explanationKey)}
        <br />
        <Trans
          i18nKey={message.descriptionKey}
          ns="zone"
          values={values}
          components={{ bold: <span className="font-bold" /> }}
        />
      </div>
    </Message>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function DynamicRecordForm({
  recordType,
  control,
  watch,
  domainSuffix,
  hideMessage,
}: DynamicRecordFormProps) {
  const { t } = useTranslation('zone');
  const config = RECORD_FORM_CONFIGS[recordType];
  if (!config) return null;

  const subDomain = watch('subDomain');
  const target = watch('target');
  const fullDomain = subDomain
    ? subDomain === '@'
      ? domainSuffix
      : `${subDomain}.${domainSuffix}`
    : `[sous-domaine].${domainSuffix}`;
  const targetStr = typeof target === 'string' ? target : '';

  return (
    <>
      {!hideMessage && (
        <RenderMessage
          config={config}
          serviceName={domainSuffix}
          fullDomain={fullDomain}
          target={targetStr}
        />
      )}
      {!hideMessage && config.warningKey && (
        <Message color={MESSAGE_COLOR.warning} dismissible={false}>
          <MessageIcon name={ICON_NAME.triangleExclamation} />
          {t(config.warningKey)}
        </Message>
      )}
      <div className="space-y-4">
        {config.rows.map((row, index) => (
          <RenderRow
            key={index}
            row={row}
            rowIndex={index}
            control={control}
            watch={watch}
            domainSuffix={domainSuffix}
            config={config}
            t={t}
          />
        ))}
      </div>
      {config.advancedRows && config.advancedRows.length > 0 && (
        <>
          <Divider spacing={DIVIDER_SPACING._12} />
          <Accordion>
            <AccordionItem value="advanced">
              <AccordionTrigger>
                {t(config.advancedLabelKey ?? 'zone_page_form_advanced_settings')}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {config.advancedRows.map((row, index) => (
                    <RenderRow
                      key={`adv-${index}`}
                      row={row}
                      rowIndex={index}
                      control={control}
                      watch={watch}
                      domainSuffix={domainSuffix}
                      config={config}
                      t={t}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </>
      )}
      {config.infoKey && (
        <Message color={MESSAGE_COLOR.information} variant={MESSAGE_VARIANT.light} dismissible={false}>
          <MessageIcon name={ICON_NAME.circleInfo} />
          {t(config.infoKey)}
        </Message>
      )}
    </>
  );
}
