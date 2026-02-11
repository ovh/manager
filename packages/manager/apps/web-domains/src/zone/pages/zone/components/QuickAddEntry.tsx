import { useMemo, useCallback } from "react";
import { type FieldErrors, FormProvider, type Resolver, useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { Button, BUTTON_SIZE, BUTTON_VARIANT, FormField, FormFieldError, FormFieldLabel, ICON_NAME, Input, INPUT_TYPE, Message, MESSAGE_COLOR, MessageIcon, Select, SelectContent, SelectControl } from "@ovhcloud/ods-react";
import { zForm, AddEntrySchemaType, FIELD_TYPES_POINTING_RECORDS, FIELD_TYPES_EXTENDED_RECORDS, FIELD_TYPES_MAIL_RECORDS, getRecordFields, RECORD_TYPES_WITHOUT_TTL } from "../../../utils/formSchema.utils";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { SubDomainField, TtlField } from "../add/components/SubDomainAndTtl.component";
import { RecordFieldInputs } from "../add/components/Inputs.component";
import { NaptrFormContent } from "../add/Steps/pointType/components/NaptrForm.component";
import { LocFormContent } from "../add/Steps/pointType/components/LocForm.component";
import { SpfFormContent } from "../add/Steps/mailType/SpfForm.component";
import { SpfFormHeader } from "../add/Steps/mailType/SpfFormHeader";
import {
  FieldTypeExtendedRecordsEnum,
  FieldTypeMailRecordsEnum,
  FieldTypePointingRecordsEnum,
} from "@/common/enum/zone.enum";
import { ARecordForm } from "../add/components/forms/ARecordForm";
import { AAAARecordForm } from "../add/components/forms/AAAARecordForm";
import { NSRecordForm } from "../add/components/forms/NSRecordForm";

function addEntryResolver(t: (key: string, params?: Record<string, unknown>) => string): Resolver<AddEntrySchemaType> {
  return (values) => {
    const recordType = String(values?.recordType ?? "");
    const schema = zForm((key: string, params?: Record<string, unknown>) => t(key, params), recordType).ADD_ENTRY_FORM_SCHEMA;
    const payload = {
      ...values,
      ttl: values?.ttlSelect === "global" ? undefined : (values?.ttl ?? 60),
    };
    const result = schema.safeParse(payload);
    if (result.success) {
      return Promise.resolve({ values: result.data as AddEntrySchemaType, errors: {} });
    }
    const errors: FieldErrors<AddEntrySchemaType> = {};
    for (const issue of result.error.issues) {
      const name = (issue.path[0] != null ? String(issue.path[0]) : "root") as keyof AddEntrySchemaType & string;
      errors[name] = { type: issue.code ?? "custom", message: String(issue.message) };
    }
    return Promise.resolve({ values: {} as AddEntrySchemaType, errors });
  };
}

interface QuickAddEntryProps {
  serviceName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function QuickAddEntry({ serviceName, onSuccess, onCancel }: QuickAddEntryProps) {
  const { t } = useTranslation(["zone", "form", NAMESPACES.ACTIONS]);

  const resolver = useMemo(() => addEntryResolver(t), [t]);

  const methods = useForm<AddEntrySchemaType>({
    defaultValues: { recordType: "", subDomain: "", ttlSelect: "global", ttl: 60 },
    mode: "onTouched",
    resolver,
  });

  const { watch, formState: { isValid }, handleSubmit, setValue, control } = methods;
  const recordType = watch("recordType");
  const subDomain = watch("subDomain");
  const target = watch("target");

  const fullDomain = subDomain ? `${subDomain}.${serviceName}` : serviceName;

  const { mutate: addEntry, isPending } = useMutation({
    mutationFn: async (_data: AddEntrySchemaType) => {
      // TODO: Replace with actual API call
      return Promise.resolve();
    },
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const handleSelectRecordType = useCallback((fieldType: string) => {
    setValue('recordType', fieldType);
    setValue('ttlSelect', 'global');
    setValue('ttl', undefined);
  }, [setValue]);

  const onSubmit = useCallback((data: AddEntrySchemaType) => {
    addEntry(data);
  }, [addEntry]);

  const selectItems = [
    {
      label: t('zone_page_add_entry_point'),
      options: FIELD_TYPES_POINTING_RECORDS.map((type) => ({ value: type, label: type })),
    },
    {
      label: t('zone_page_add_entry_extended'),
      options: FIELD_TYPES_EXTENDED_RECORDS.map((type) => ({ value: type, label: type })),
    },
    {
      label: t('zone_page_add_entry_mail'),
      options: ([...FIELD_TYPES_MAIL_RECORDS] as string[]).map((type) => ({ value: type, label: type })),
    },
  ];

  const recordTypeStr = typeof recordType === 'string' ? recordType : '';
  const fields = recordTypeStr ? getRecordFields(recordTypeStr) : [];
  const showTtl = recordTypeStr ? !RECORD_TYPES_WITHOUT_TTL.includes(recordTypeStr) : false;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-4">
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
                    value={typeof field.value === 'string' && field.value ? [field.value] : []}
                    items={selectItems}
                    invalid={!!error}
                    onValueChange={(detail: { value?: string[] }) => {
                      const selectedValue = Array.isArray(detail.value) ? (detail.value[0] ?? '') : '';
                      if (selectedValue) {
                        field.onChange(selectedValue);
                        handleSelectRecordType(selectedValue);
                      }
                    }}
                    onBlur={field.onBlur}
                  >
                    <SelectControl placeholder={t('zone_page_add_entry_modal_step_1_select_title')} />
                    <SelectContent />
                  </Select>
                  {error?.message && <FormFieldError>{error.message}</FormFieldError>}
                </div>
              )}
            />
          </FormField>

          {recordTypeStr === FieldTypeMailRecordsEnum.SPF && (
            <>
              <SpfFormHeader serviceName={serviceName} />
              <SubDomainField control={control} domainSuffix={serviceName} required={false} />
              <TtlField control={control} watch={watch} />
              <SpfFormContent />
            </>
          )}

          {recordTypeStr === FieldTypeExtendedRecordsEnum.NAPTR && (
            <>
              <SubDomainField control={control} domainSuffix={serviceName} required={false} />
              <TtlField control={control} watch={watch} />
              <NaptrFormContent />
            </>
          )}

          {recordTypeStr === FieldTypeExtendedRecordsEnum.LOC && (
            <>
              <SubDomainField control={control} domainSuffix={serviceName} required={false} />
              <TtlField control={control} watch={watch} />
              <LocFormContent />
            </>
          )}

          {recordTypeStr === FieldTypePointingRecordsEnum.A && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                {t("zone_page_quick_add_entry_description_A", { domain: fullDomain, ip: target || "[IPv4]" })}
              </Message>
              <ARecordForm control={control} watch={watch} domainSuffix={serviceName} />
            </>
          )}

          {recordTypeStr === FieldTypePointingRecordsEnum.AAAA && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                {t("zone_page_quick_add_entry_description_AAAA", { domain: fullDomain, ip: target || "[IPv6]" })}
              </Message>
              <AAAARecordForm control={control} watch={watch} domainSuffix={serviceName} />
            </>
          )}

          {recordTypeStr === FieldTypePointingRecordsEnum.NS && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                {t("zone_page_quick_add_entry_description_NS", { domain: fullDomain, target: target || "[serveur DNS]" })}
              </Message>
              <NSRecordForm control={control} watch={watch} domainSuffix={serviceName} />
            </>
          )}

          {recordTypeStr &&
            recordTypeStr !== FieldTypeMailRecordsEnum.SPF &&
            recordTypeStr !== FieldTypeExtendedRecordsEnum.NAPTR &&
            recordTypeStr !== FieldTypeExtendedRecordsEnum.LOC &&
            recordTypeStr !== FieldTypePointingRecordsEnum.A &&
            recordTypeStr !== FieldTypePointingRecordsEnum.AAAA &&
            recordTypeStr !== FieldTypePointingRecordsEnum.NS && (
              <div className="grid grid-cols-3 items-start gap-4">
                <SubDomainField
                  control={control}
                  domainSuffix={serviceName}
                  className="w-full"
                  required={recordTypeStr === FieldTypePointingRecordsEnum.NS}
                />
                <RecordFieldInputs fields={fields} control={control} fieldClassName="w-full" />
                {showTtl && (
                  <FormField className="w-full">
                    <FormFieldLabel>{t("zone_page_add_entry_modal_step_1_ttl")}</FormFieldLabel>
                    <Input
                      type={INPUT_TYPE.text}
                      className="w-full"
                      value={t("zone_page_add_entry_modal_step_1_ttl_global")}
                      readOnly
                      disabled
                    />
                  </FormField>
                )}
              </div>
            )}

          {recordTypeStr && (
            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button
                type="button"
                variant={BUTTON_VARIANT.outline}
                size={BUTTON_SIZE.sm}
                onClick={onCancel}
                disabled={isPending}
              >
                {t(`${NAMESPACES.ACTIONS}:cancel`)}
              </Button>
              <Button
                type="submit"
                size={BUTTON_SIZE.sm}
                disabled={!isValid || isPending}
                loading={isPending}
              >
                {t(`${NAMESPACES.ACTIONS}:add`)}
              </Button>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
