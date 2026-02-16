import { useEffect, useMemo, useCallback, useState } from "react";
import { type FieldErrors, FormProvider, type Resolver, useForm, Controller } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { Badge, BADGE_COLOR, BADGE_SIZE, Button, BUTTON_SIZE, BUTTON_VARIANT, FormField, FormFieldError, FormFieldLabel, ICON_NAME, Message, MESSAGE_COLOR, MESSAGE_VARIANT, MessageBody, MessageIcon, Select, SelectContent, SelectControl, type SelectCustomOptionRendererArg, Textarea } from "@ovhcloud/ods-react";
import { zForm, AddEntrySchemaType, getTargetDisplayValue, FIELD_TYPES_POINTING_RECORDS, FIELD_TYPES_EXTENDED_RECORDS, FIELD_TYPES_MAIL_RECORDS, RECORD_TYPES_AS_TXT, RECORD_TYPES_WITHOUT_TTL } from "@/zone/utils/formSchema.utils";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import {
  FieldTypeExtendedRecordsEnum,
  FieldTypeMailRecordsEnum,
} from "@/common/enum/zone.enum";
import { RECORD_FORM_CONFIGS } from "@/zone/utils/recordFormConfig";
import { DynamicRecordForm } from "./DynamicRecordForm";
import { SPFRecordForm } from "@/zone/pages/zone/add/components/forms/SPFRecordForm";
import { parseBindRecord } from "@/zone/utils/parseBindRecord";
import { useAddZoneRecord } from "@/zone/hooks/useAddZoneRecord/useAddZoneRecord";

function addEntryResolver(t: (key: string, params?: Record<string, unknown>) => string): Resolver<AddEntrySchemaType> {
  return (values) => {
    const recordType = values?.recordType as string ?? "";
    const schema = zForm((key: string, params?: Record<string, unknown>) => t(key, params), recordType).ADD_ENTRY_FORM_SCHEMA;
    const payload = {
      ...values,
      ttl: values?.ttlSelect === "global" ? undefined : (values?.ttl ?? 60),
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
}

export default function QuickAddEntry({ serviceName, visible, onSuccess, onCancel }: QuickAddEntryProps) {
  const { t } = useTranslation(["zone", "form", NAMESPACES.ACTIONS]);

  const resolver = useMemo(() => addEntryResolver(t), [t]);

  const methods = useForm<AddEntrySchemaType>({
    defaultValues: { recordType: "", subDomain: "", ttlSelect: "global", ttl: 60 },
    mode: "onTouched",
    resolver,
  });

  const { watch, formState: { isValid }, handleSubmit, setValue, control, reset } = methods;
  const recordType = watch("recordType");

  // BIND paste feature
  const [showBindInput, setShowBindInput] = useState(false);
  const [bindInput, setBindInput] = useState('');
  const [bindError, setBindError] = useState<string | null>(null);
  const [bindSuccess, setBindSuccess] = useState(false);

  const resetBindState = useCallback(() => {
    setShowBindInput(false);
    setBindInput('');
    setBindError(null);
    setBindSuccess(false);
  }, []);

  useEffect(() => {
    if (!visible) {
      reset();
      resetBindState();
    }
  }, [visible, reset, resetBindState]);

  const handleBindPaste = useCallback(() => {
    setBindError(null);
    setBindSuccess(false);
    const result = parseBindRecord(bindInput);
    if (!result.success) {
      setBindError((result as { success: false; error: string }).error);
      return;
    }
    const { values: parsedValues } = result;
    // Reset the form first
    reset();
    // Set record type and trigger the select handler
    if (parsedValues.recordType) {
      setValue('recordType', parsedValues.recordType);
      setValue('ttlSelect', parsedValues.ttlSelect ?? 'global');
      if (parsedValues.ttl !== undefined) {
        setValue('ttl', parsedValues.ttl);
      }
      if (parsedValues.recordType === FieldTypeExtendedRecordsEnum.CAA) {
        setValue('flags', parsedValues.flags ?? 0);
      }
    }
    // Set all parsed values
    for (const [key, value] of Object.entries(parsedValues)) {
      if (key !== 'recordType' && key !== 'ttlSelect' && key !== 'ttl' && value !== undefined) {
        setValue(key, value as never, { shouldValidate: true });
      }
    }
    setBindSuccess(true);
    // Auto-close after short delay
    setTimeout(() => {
      setShowBindInput(false);
      setBindInput('');
      setBindSuccess(false);
    }, 1500);
  }, [bindInput, reset, setValue]);

  const { addRecord, isAddingRecord } = useAddZoneRecord(serviceName);

  const handleSelectRecordType = useCallback((fieldType: string) => {
    setValue('recordType', fieldType);
    setValue('ttlSelect', 'global');
    setValue('ttl', undefined);
    if (fieldType === FieldTypeExtendedRecordsEnum.CAA) {
      setValue('flags', 0);
    }
  }, [setValue]);

  const onSubmit = useCallback((data: AddEntrySchemaType) => {
    const recordType = data.recordType as string;

    // Compose the target value from all form fields
    const target = getTargetDisplayValue(recordType, data);

    // SPF/DKIM/DMARC are sent as TXT to the API
    const fieldType = RECORD_TYPES_AS_TXT.includes(recordType) ? 'TXT' : recordType;

    // Some record types don't support custom TTL
    const ttl = RECORD_TYPES_WITHOUT_TTL.includes(recordType) || data.ttlSelect === 'global'
      ? undefined
      : Number(data.ttl);

    addRecord(
      {
        fieldType,
        subDomain: (data.subDomain as string) ?? '',
        target,
        ttl,
      },
      {
        onSuccess: () => {
          reset();
          resetBindState();
          onSuccess?.();
        },
      },
    );
  }, [addRecord, reset, resetBindState, onSuccess]);

  const handleCancel = useCallback(() => {
    reset();
    resetBindState();
    onCancel?.();
  }, [reset, resetBindState, onCancel]);

  const selectItems = [
    {
      label: t('zone_page_record_pointing'),
      options: FIELD_TYPES_POINTING_RECORDS.map((type) => ({ value: type, label: type, customRendererData: { description: t(`zone_page_record_short_${type}`) } })),
    },
    {
      label: t('zone_page_record_mail'),
      options: ([...FIELD_TYPES_MAIL_RECORDS] as string[]).map((type) => ({ value: type, label: type, customRendererData: { isAdvanced: type === FieldTypeMailRecordsEnum.SPF || type === FieldTypeMailRecordsEnum.DKIM, description: t(`zone_page_record_short_${type}`) } })),
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <FormField className="w-1/2">
              <FormFieldLabel>
                {t('zone_page_type')}
              </FormFieldLabel>
              <Controller
                name="recordType"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <div className="flex w-full flex-wrap items-center gap-2">
                    <Select
                      name="recordType"
                      id="recordType"
                      className="min-w-[14rem] w-full max-w-sm"
                      value={field.value ? [field.value as string] : []}
                      items={selectItems}
                      invalid={!!error}
                      disabled={showBindInput}
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

            <Button
              type="button"
              variant={BUTTON_VARIANT.outline}
              size={BUTTON_SIZE.sm}
              onClick={() => {
                const opening = !showBindInput;
                setShowBindInput(opening);
                setBindError(null);
                setBindSuccess(false);
                if (opening) {
                  reset();
                  setBindInput('');
                }
              }}
            >
              {showBindInput ? t('zone_page_form_bind_back_to_form') : t('zone_page_form_bind_paste_button')}
            </Button>
          </div>

          {showBindInput && (
            <div className="flex flex-col gap-2 p-4 border rounded-md bg-[--ods-color-surface-lighter]">
              <FormField invalid={!!bindError}>
                <FormFieldLabel>{t('zone_page_form_bind_paste_description')}</FormFieldLabel>
                <Textarea
                  className="min-h-[60px] w-full font-mono"
                  placeholder={t('zone_page_form_bind_paste_placeholder')}
                  value={bindInput}
                  invalid={!!bindError}
                  onChange={(e) => {
                    setBindInput(e.target?.value ?? '');
                    setBindError(null);
                    setBindSuccess(false);
                  }}
                />
                <FormFieldError>
                  {bindError ? t(`zone_page_form_bind_error_${bindError}`) : ''}
                </FormFieldError>
              </FormField>
              {bindSuccess && (
                <Message color={MESSAGE_COLOR.success} variant={MESSAGE_VARIANT.light} dismissible={false}>
                  <MessageIcon name={ICON_NAME.circleCheck} />
                  <MessageBody>
                    {t('zone_page_form_bind_success')}
                  </MessageBody>
                </Message>
              )}
              <div className="flex justify-end">
                <Button
                  type="button"
                  size={BUTTON_SIZE.sm}
                  onClick={handleBindPaste}
                  disabled={!bindInput.trim()}
                >
                  {t('zone_page_form_bind_apply')}
                </Button>
              </div>
            </div>
          )}

          {recordTypeStr === FieldTypeMailRecordsEnum.SPF && (
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

          {recordTypeStr && recordTypeStr !== FieldTypeMailRecordsEnum.SPF && RECORD_FORM_CONFIGS[recordTypeStr] && (
            <DynamicRecordForm
              recordType={recordTypeStr}
              control={control}
              watch={watch}
              domainSuffix={serviceName}
            />
          )}

          {recordTypeStr && (
            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button
                type="button"
                variant={BUTTON_VARIANT.outline}
                size={BUTTON_SIZE.sm}
                onClick={handleCancel}
                disabled={isAddingRecord}
              >
                {t(`${NAMESPACES.ACTIONS}:cancel`)}
              </Button>
              {recordTypeStr === FieldTypeMailRecordsEnum.SPF ? (
                <Button
                  type="button"
                  size={BUTTON_SIZE.sm}
                  disabled={isAddingRecord}
                  loading={isAddingRecord}
                  onClick={() => {
                    const spfValue = "v=spf1 include:mx.ovh.com ~all";
                    setValue("target", spfValue);
                    setValue("subDomain", "");
                    handleSubmit(onSubmit)();
                  }}
                >
                  {t("zone_page_form_spf_button_use_spf_ovh")}
                </Button>
              ) : (
                <Button
                  type="submit"
                  size={BUTTON_SIZE.sm}
                  disabled={!isValid || isAddingRecord}
                  loading={isAddingRecord}
                >
                  {t(`${NAMESPACES.ACTIONS}:add`)}
                </Button>
              )}
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
