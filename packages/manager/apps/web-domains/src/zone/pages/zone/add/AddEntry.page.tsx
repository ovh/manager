import { useMemo, useState } from "react";
import { type FieldErrors, FormProvider, type Resolver, useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { LinkType } from "@ovh-ux/manager-react-components";
import { Button, BUTTON_SIZE, BUTTON_VARIANT, TEXT_PRESET, Text, FormField, FormFieldError, Select, SelectContent, SelectControl } from "@ovhcloud/ods-react";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import { zForm, AddEntrySchemaType, FIELD_TYPES_POINTING_RECORDS, FIELD_TYPES_EXTENDED_RECORDS, FIELD_TYPES_MAIL_RECORDS } from "../../../utils/formSchema.utils";
import { FieldTypeExtendedRecordsEnum } from "@/common/enum/zone.enum";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { Link } from "@ovh-ux/muk";


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

export interface AddEntryPageProps {
  onSuccessCallback?: () => void;
}


export default function AddEntryPage({ onSuccessCallback }: AddEntryPageProps = {}) {
  const { t } = useTranslation(["zone", "form", NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const { serviceName } = useParams<{ serviceName: string }>();
  const [showStep3, setShowStep3] = useState(false);

  const resolver = useMemo(() => addEntryResolver(t), [t]);

  const methods = useForm<AddEntrySchemaType>({
    defaultValues: { recordType: "", subDomain: "", ttlSelect: "global", ttl: 60 },
    mode: "onTouched",
    resolver,
  });

  const { watch, formState: { isValid }, handleSubmit, setValue, control } = methods;
  const recordType = watch("recordType");

  const { mutate: addEntry, isPending } = useMutation({
    mutationFn: async (_data: AddEntrySchemaType) => {
      return Promise.resolve();
    },
    onSuccess: () => {
      onSuccessCallback?.();
    },
  });

  const onClose = () => {
    navigate(-1);
  };

  const onNextStep = () => {
    setShowStep3(true);
  };

  const onPreviousStep = () => {
    setShowStep3(false);
  };

  const handleSelectRecordType = (fieldType: string) => {
    setValue('recordType', fieldType);
    setValue('ttlSelect', 'global');
    setValue('ttl', undefined);
    if (fieldType === FieldTypeExtendedRecordsEnum.SSHFP) {
      setValue('algorithm', '1');
      setValue('fptype', '1');
    }
    setShowStep3(false);
  };

  const onSubmit = (data: AddEntrySchemaType) => {
    const payload = { ...data, ttl: data.ttlSelect === "global" ? 0 : (data.ttl ?? 60) };
    addEntry(payload);
  };

  const isStep2Valid = isValid;
  const isStep3Valid = true;

  const selectItems = [
    {
      label: t('zone_page_add_entry_point'),
      options: FIELD_TYPES_POINTING_RECORDS.map((type) => ({
        value: type,
        label: type,
      })),
    },
    {
      label: t('zone_page_add_entry_extended'),
      options: FIELD_TYPES_EXTENDED_RECORDS.map((type) => ({
        value: type,
        label: type,
      })),
    },
    {
      label: t('zone_page_add_entry_mail'),
      options: ([...FIELD_TYPES_MAIL_RECORDS] as string[]).map((type) => ({
        value: type,
        label: type,
      })),
    },
  ];


  return (
    <div className="flex w-full flex-col items-start" data-testid="add-entry-page">
      <div className="mb-6 flex w-full flex-col items-start space-y-4">
        <Link type={LinkType.back} onClick={() => onClose()}>
          {t('zone_page_back_to_zone')}
        </Link>
        <Text preset={TEXT_PRESET.heading3}>
          {t("zone_page_add_entry_modal_heading")}
        </Text>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-4 md:w-3/4"
      >
        <FormProvider {...methods}>
          <FormField className="w-1/2">
            <Controller
              name="recordType"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div className="flex w-full flex-wrap items-center gap-2">
                  <Select
                    name="recordType"
                    id="recordType"
                    className="min-w-[14rem] w-full max-w-sm"
                    value={field.value ? [String(field.value)] : []}
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

          {recordType && !showStep3 && (
            <div className="w-full">
              <Step2 />
            </div>
          )}

          {showStep3 && recordType && (
            <div className="w-full">
              <Step3 />
            </div>
          )}

          {recordType && (
            <FormField className="w-full">
              <div className="flex flex-row gap-4 justify-start pt-2 border-t border-t-default">
                {showStep3 ? (
                  <>
                    <Button
                      variant={BUTTON_VARIANT.outline}
                      size={BUTTON_SIZE.sm}
                      onClick={onPreviousStep}
                    >
                      {t(`${NAMESPACES.ACTIONS}:previous`)}
                    </Button>
                    <Button
                      variant={BUTTON_VARIANT.default}
                      size={BUTTON_SIZE.md}
                      onClick={() => handleSubmit(onSubmit)()}
                      loading={isPending}
                      disabled={!isStep3Valid}
                    >
                      {t(`${NAMESPACES.ACTIONS}:validate`)}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={BUTTON_VARIANT.default}
                    size={BUTTON_SIZE.md}
                    onClick={onNextStep}
                    disabled={!isStep2Valid}
                  >
                    {t(`${NAMESPACES.ACTIONS}:next`)}
                  </Button>
                )}
              </div>
            </FormField>
          )}
        </FormProvider>
      </form>
    </div>
  );
}
