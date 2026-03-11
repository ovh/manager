import { useEffect, useMemo, useCallback, useState } from "react";
import { type FieldErrors, FormProvider, type Resolver, useForm, Controller } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { Badge, BADGE_COLOR, BADGE_SIZE, Button, BUTTON_SIZE, BUTTON_VARIANT, FormField, FormFieldError, FormFieldLabel, ICON_NAME, Message, MESSAGE_COLOR, MessageIcon, Select, SelectContent, SelectControl, type SelectCustomOptionRendererArg, Textarea } from "@ovhcloud/ods-react";
import { zForm, AddEntrySchemaType, getTargetDisplayValue, parseSpfTarget, FIELD_TYPES_POINTING_RECORDS, FIELD_TYPES_EXTENDED_RECORDS, FIELD_TYPES_MAIL_RECORDS, RECORD_TYPES_WITHOUT_TTL } from "@/zone/utils/formSchema.utils";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import {
  FieldTypeExtendedRecordsEnum,
  FieldTypeMailRecordsEnum,
  TtlSelectEnum,
  DkimStatusEnum,
  BoolSelectEnum,
} from "@/common/enum/zone.enum";
import { RECORD_FORM_CONFIGS } from "@/zone/utils/recordFormConfig";
import { DynamicRecordForm } from "./DynamicRecordForm";
import { SPFRecordForm } from "@/zone/pages/zone/add/components/forms/SPFRecordForm";
import { parseBindRecord } from "@/zone/utils/parseBindRecord";
import { useAddZoneRecord } from "@/zone/hooks/useAddZoneRecord/useAddZoneRecord";
import { useUpdateZoneRecord } from "@/zone/hooks/useUpdateZoneRecord/useUpdateZoneRecord";
import { useIsDesktop } from "@/zone/hooks/useIsDesktop";
import type { ZoneRecord } from "@/zone/types/zoneRecords.types";

function addEntryResolver(t: (key: string, params?: Record<string, unknown>) => string): Resolver<AddEntrySchemaType> {
  return (values) => {
    const recordType = values?.recordType as string ?? "";
    const schema = zForm((key: string, params?: Record<string, unknown>) => t(key, params), recordType).ADD_ENTRY_FORM_SCHEMA;
    const payload = {
      ...values,
      ttl: values?.ttlSelect === TtlSelectEnum.GLOBAL ? undefined : (values?.ttl ?? 60),
    };
    const result = schema.safeParse(payload);
    if (result.success) {
      return Promise.resolve({ values: result.data, errors: {} });
    }
    const errors: FieldErrors<AddEntrySchemaType> = {};
    for (const issue of result.error.issues) {
      const name = (issue.path[0] ?? "root") as keyof AddEntrySchemaType & string;
      errors[name] = { type: issue.code ?? "custom", message: String(issue.message) };
    }
    return Promise.resolve({ values: {} as AddEntrySchemaType, errors });
  };
}

interface QuickAddEntryProps {
  readonly serviceName: string;
  readonly visible?: boolean;
  readonly onSuccess?: () => void;
  readonly onCancel?: () => void;
  readonly editingRecord?: ZoneRecord | null;
}

export default function QuickAddEntry({ serviceName, visible, onSuccess, onCancel, editingRecord }: QuickAddEntryProps) {
  const { t } = useTranslation(["zone", "form", NAMESPACES.ACTIONS]);
  const isDesktop = useIsDesktop();

  const resolver = useMemo(() => addEntryResolver(t), [t]);

  const INITIAL_FORM_VALUES: Partial<AddEntrySchemaType> = useMemo(() => ({
    recordType: '', subDomain: '', ttlSelect: TtlSelectEnum.GLOBAL, ttl: 60,
  }), []);

  const methods = useForm<AddEntrySchemaType>({
    defaultValues: INITIAL_FORM_VALUES,
    mode: "onTouched",
    resolver,
  });

  const { watch, formState: { isValid }, handleSubmit, setValue, control, reset, clearErrors } = methods;
  const recordType = watch("recordType");
  const allValues = watch();

  // Counter to force remount of custom form components (e.g. SPFRecordForm)
  // on reset, ensuring their local state is cleared.
  const [formResetKey, setFormResetKey] = useState(0);

  // BIND paste feature
  const [showBindInput, setShowBindInput] = useState(false);
  const [bindInput, setBindInput] = useState('');
  const [bindError, setBindError] = useState<string | null>(null);

  const resetBindState = useCallback(() => {
    setShowBindInput(false);
    setBindInput('');
    setBindError(null);
    setFormResetKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!visible) {
      reset(INITIAL_FORM_VALUES);
      resetBindState();
    }
  }, [visible, reset, resetBindState, INITIAL_FORM_VALUES]);

  // Pre-fill form when editing a record
  useEffect(() => {
    if (!editingRecord) return;
    const bindLine = `${editingRecord.subDomain || '@'} ${editingRecord.ttl} IN ${editingRecord.fieldType} ${editingRecord.target}`;
    const result = parseBindRecord(bindLine);

    // Strip subdomain suffix (e.g. ._domainkey) so the field shows only the user-editable part
    const editConfig = RECORD_FORM_CONFIGS[editingRecord.fieldType];
    const stripSuffix = (sub: string) =>
      editConfig?.subDomainSuffix && sub.endsWith(editConfig.subDomainSuffix)
        ? sub.slice(0, -editConfig.subDomainSuffix.length)
        : sub;

    const spfFields = editingRecord.fieldType === FieldTypeMailRecordsEnum.SPF
      ? parseSpfTarget(editingRecord.target ?? '')
      : {};

    if (result.success) {
      const { recordType: parsedType, ...parsedFields } = result.values;
      const sub = stripSuffix(String(parsedFields.subDomain || '@'));
      // For SPF, parseBindRecord/parseTXT mangles the target (joins tokens without spaces).
      // Override with the original target so composeSPF in SPFRecordForm starts from the
      // correct value before its useEffect overwrites it.
      const spfTargetOverride = editingRecord.fieldType === FieldTypeMailRecordsEnum.SPF
        ? { target: editingRecord.target ?? '' }
        : {};
      reset({ recordType: editingRecord.fieldType, ...parsedFields, subDomain: sub, ...spfTargetOverride, ...spfFields });
    } else {
      // Fallback: set minimal fields
      reset({
        recordType: editingRecord.fieldType,
        subDomain: stripSuffix(editingRecord.subDomain || '@'),
        target: editingRecord.target ?? '',
        ttl: editingRecord.ttl,
        ttlSelect: editingRecord.ttl ? TtlSelectEnum.CUSTOM : TtlSelectEnum.GLOBAL,
        ...spfFields,
      });
    }
  }, [editingRecord, reset]);

  // Clear regex/replace when NAPTR flag changes
  const flagValue = watch('flag');
  useEffect(() => {
    if (recordType === 'NAPTR') {
      setValue('regex', '');
      setValue('replace', '');
    }
  }, [flagValue, recordType, setValue]);

  const isEditMode = !!editingRecord;

  const hasChanges = (() => {
    if (!editingRecord) return true;
    const currentSubDomain = (allValues.subDomain as string) === '@' ? '' : (allValues.subDomain as string ?? '');
    if (currentSubDomain !== (editingRecord.subDomain ?? '')) return true;
    const currentTarget = getTargetDisplayValue(allValues.recordType as string, allValues);
    if (currentTarget !== editingRecord.target) return true;
    const currentTtl = allValues.ttlSelect === TtlSelectEnum.GLOBAL ? 0 : Number(allValues.ttl ?? 0);
    if (currentTtl !== (editingRecord.ttl ?? 0)) return true;
    return false;
  })();

  const { addRecord, isAddingRecord } = useAddZoneRecord(serviceName);
  const { updateRecord, isUpdatingRecord } = useUpdateZoneRecord(serviceName);
  const isMutating = isAddingRecord || isUpdatingRecord;

  const handleAdvancedSubmit = useCallback(() => {
    setBindError(null);
    const firstLine = bindInput.split('\n').find((l) => l.trim()) ?? '';
    const result = parseBindRecord(firstLine);
    if (!result.success) {
      setBindError((result as { success: false; error: string }).error);
      return;
    }
    const { values: parsedValues } = result;
    const parsedRecordType = parsedValues.recordType as string;
    const target = getTargetDisplayValue(parsedRecordType, parsedValues);
    const ttl = RECORD_TYPES_WITHOUT_TTL.includes(parsedRecordType) || parsedValues.ttlSelect === TtlSelectEnum.GLOBAL
      ? undefined
      : Number(parsedValues.ttl ?? 60);

    addRecord(
      {
        fieldType: parsedRecordType,
        subDomain: (parsedValues.subDomain as string) ?? '',
        target,
        ttl,
      },
      {
        onSuccess: () => {
          reset(INITIAL_FORM_VALUES);
          resetBindState();
          onSuccess?.();
        },
      },
    );
  }, [bindInput, addRecord, reset, resetBindState, onSuccess, INITIAL_FORM_VALUES]);

  const handleSelectRecordType = useCallback((fieldType: string) => {
    // Build reset values — include SPF defaults directly so the schema
    // validates in a single pass (no separate setValue race condition).
    const base = { recordType: fieldType, subDomain: '', ttlSelect: TtlSelectEnum.GLOBAL, ttl: 60 };
    const spfDefaults = fieldType === FieldTypeMailRecordsEnum.SPF
      ? { spf_includeOvh: true, spf_useMx: false, spf_useA: false, spf_includesRaw: '', spf_ip4Raw: '', spf_ip6Raw: '', spf_policy: '~all', spf_unknownTokens: '' }
      : {};
    reset({ ...base, ...spfDefaults });
    clearErrors();
    setFormResetKey((k) => k + 1);

    if (fieldType === FieldTypeExtendedRecordsEnum.CAA) {
      setValue('flags', 0);
    }
    if (fieldType === FieldTypeMailRecordsEnum.DMARC) {
      setValue('subDomain', '_dmarc');
      setValue('v', 'DMARC1');
      setValue('aspf', 'r');
    }
    if (fieldType === FieldTypeMailRecordsEnum.DKIM) {
      setValue('k', 'rsa');
      setValue('h', 'sha256');
      setValue('s', 'email');
      setValue('dkim_status', DkimStatusEnum.ACTIVE);
      setValue('t_y', BoolSelectEnum.NO);
      setValue('t_s', BoolSelectEnum.NO);
    }
  }, [reset, clearErrors, setValue]);

  const onSubmit = useCallback((data: AddEntrySchemaType) => {
    const recordType = data.recordType as string;

    // Compose the target value from all form fields
    const target = getTargetDisplayValue(recordType, data);

    // Use the original record type as fieldType (DKIM, DMARC, SPF are NOT converted to TXT)
    const fieldType = recordType;

    // Append subdomain suffix if defined in config (e.g. ._domainkey for DKIM)
    const config = RECORD_FORM_CONFIGS[recordType];
    const subDomainRaw = (data.subDomain as string) ?? '';
    const subDomain = config?.subDomainSuffix ? `${subDomainRaw}${config.subDomainSuffix}` : subDomainRaw;

    // Some record types don't support custom TTL
    const ttl = RECORD_TYPES_WITHOUT_TTL.includes(recordType) || data.ttlSelect === TtlSelectEnum.GLOBAL
      ? undefined
      : Number(data.ttl);

    if (isEditMode && editingRecord) {
      updateRecord(
        {
          recordId: editingRecord.id,
          subDomain,
          target,
          ttl,
        },
        {
          onSuccess: () => {
            reset(INITIAL_FORM_VALUES);
            resetBindState();
            onSuccess?.();
          },
        },
      );
    } else {
      addRecord(
        {
          fieldType,
          subDomain,
          target,
          ttl,
        },
        {
          onSuccess: () => {
            reset(INITIAL_FORM_VALUES);
            resetBindState();
            onSuccess?.();
          },
        },
      );
    }
  }, [addRecord, reset, resetBindState, onSuccess, INITIAL_FORM_VALUES]);

  const handleCancel = useCallback(() => {
    reset(INITIAL_FORM_VALUES);
    resetBindState();
    onCancel?.();
  }, [reset, resetBindState, onCancel, INITIAL_FORM_VALUES]);

  const selectItems = [
    {
      label: t('zone_page_record_pointing'),
      options: FIELD_TYPES_POINTING_RECORDS.map((type) => ({ value: type, label: type, customRendererData: { description: t(`zone_page_record_short_${type}`) } })),
    },
    {
      label: t('zone_page_record_mail'),
      options: ([...FIELD_TYPES_MAIL_RECORDS] as string[]).sort((a, b) => a.localeCompare(b)).map((type) => ({ value: type, label: type, customRendererData: { description: t(`zone_page_record_short_${type}`) } })),
    },
    {
      label: t('zone_page_record_extended'),
      options: FIELD_TYPES_EXTENDED_RECORDS.map((type) => ({ value: type, label: type, customRendererData: { isAdvanced: true, description: t(`zone_page_record_short_${type}`) } })),
    },
  ];

  function renderOption({ customData, label }: SelectCustomOptionRendererArg<{ isAdvanced?: boolean; description?: string }>) {
    return (
      <div className="flex items-center gap-2">
        {customData?.isAdvanced && (
          <Badge color={BADGE_COLOR.warning} size={BADGE_SIZE.sm}>
            {t('zone_page_record_badge_advanced')}
          </Badge>
        )}
        <span className="font-medium">{label}</span>
        {customData?.description && (
          <span className="text-xs text-[--ods-color-text-muted]">— {customData.description}</span>
        )}
      </div>
    );
  }

  const recordTypeStr = recordType as string ?? '';

  return (
    <FormProvider {...methods}>
      <form key={formResetKey} onSubmit={handleSubmit(onSubmit)} className={`space-y-4 ${isEditMode ? 'p-4 rounded bg-[--ods-color-neutral-050]' : ''}`}>
        <div className="flex flex-col gap-4">
          {!isEditMode && (
            <div className="flex items-start justify-between gap-4">
              {!showBindInput && (
                <FormField className="w-[32rem] max-w-full">
                  <FormFieldLabel>
                    {t('zone_page_type')}
                  </FormFieldLabel>
                  <Controller
                    name="recordType"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <div className="flex flex-wrap items-center gap-2">
                        <Select
                          name="recordType"
                          id="recordType"
                          className="w-full"
                          value={field.value ? [field.value as string] : []}
                          items={selectItems}
                          invalid={!!error}
                          onValueChange={(detail: { value?: string[] }) => {
                            const selectedValue = detail.value?.[0] ?? '';
                            if (selectedValue) {
                              field.onChange(selectedValue);
                              handleSelectRecordType(selectedValue);
                            }
                          }}
                          onBlur={field.onBlur}
                        >
                          <SelectControl placeholder={t('zone_page_form_select_title')} />
                          <SelectContent customOptionRenderer={renderOption} />
                        </Select>
                        {error?.message && <FormFieldError>{error.message}</FormFieldError>}
                      </div>
                    )}
                  />
                </FormField>
              )}

              {isDesktop && (
                <Button
                  type="button"
                  variant={BUTTON_VARIANT.ghost}
                  size={BUTTON_SIZE.sm}
                  className="min-w-[15rem] text-center ml-auto"
                  onClick={() => {
                    const opening = !showBindInput;
                    setShowBindInput(opening);
                    setBindError(null);
                    if (opening) {
                      reset();
                      setBindInput('');
                    }
                  }}
                >
                  {showBindInput ? t('zone_page_form_bind_back_to_form') : t('zone_page_form_bind_paste_button')}
                </Button>
              )}
            </div>
          )}

          {showBindInput && (
            <div className="flex flex-col gap-2 p-4 border rounded-md bg-[--ods-color-surface-lighter]">
              <FormField invalid={!!bindError}>
                <FormFieldLabel>{t('zone_page_form_bind_paste_description')}</FormFieldLabel>
                <Textarea
                  className="min-h-[60px] w-full font-mono bg-white"
                  placeholder={t('zone_page_form_bind_paste_placeholder')}
                  value={bindInput}
                  invalid={!!bindError}
                  onChange={(e) => {
                    const value = e.target?.value ?? '';
                    setBindInput(value);
                    const lines = value.split('\n');
                    const hasMultipleRecords = lines.filter((l) => l.trim()).length > 1;
                    setBindError(hasMultipleRecords ? 'multiline' : null);
                  }}
                />
                <FormFieldError>
                  {bindError ? t(`zone_page_form_bind_error_${bindError}`) : ''}
                </FormFieldError>
              </FormField>
              <div className="flex flex-col-reverse gap-2 pt-4 border-t md:flex-row md:justify-start">
                <Button
                  type="button"
                  variant={BUTTON_VARIANT.ghost}
                  size={BUTTON_SIZE.sm}
                  onClick={handleCancel}
                  disabled={isMutating}
                >
                  {t(`${NAMESPACES.ACTIONS}:cancel`)}
                </Button>
                <Button
                  type="button"
                  size={BUTTON_SIZE.sm}
                  onClick={handleAdvancedSubmit}
                  disabled={!bindInput.trim() || !!bindError || isMutating}
                  loading={isMutating}
                >
                  {t(`${NAMESPACES.ACTIONS}:add`)}
                </Button>
              </div>
            </div>
          )}

          {!showBindInput && recordTypeStr === FieldTypeMailRecordsEnum.SPF && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                <div>
                  {t("zone_page_record_explanation_SPF")}
                  <br />
                  <Trans
                    t={t}
                    i18nKey="zone_page_record_description_SPF"
                    values={{ domain: serviceName }}
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </div>
              </Message>

              <SPFRecordForm serviceName={serviceName} />
            </>
          )}

          {!showBindInput && recordTypeStr && recordTypeStr !== FieldTypeMailRecordsEnum.SPF && RECORD_FORM_CONFIGS[recordTypeStr] && (
            <DynamicRecordForm
              recordType={recordTypeStr}
              control={control}
              watch={watch}
              domainSuffix={serviceName}
              hideMessage={false}
            />
          )}

          {!showBindInput && recordTypeStr && (
            <div className="flex flex-col-reverse gap-2 pt-4 border-t md:flex-row md:justify-start">
              <Button
                type="button"
                variant={BUTTON_VARIANT.ghost}
                size={BUTTON_SIZE.sm}
                onClick={handleCancel}
                disabled={isMutating}
              >
                {t(`${NAMESPACES.ACTIONS}:cancel`)}
              </Button>
              <Button
                type="submit"
                size={BUTTON_SIZE.sm}
                disabled={!isValid || isMutating || (isEditMode && !hasChanges)}
                loading={isMutating}
              >
                {isEditMode ? t(`${NAMESPACES.ACTIONS}:modify`) : t(`${NAMESPACES.ACTIONS}:add`)}
              </Button>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
