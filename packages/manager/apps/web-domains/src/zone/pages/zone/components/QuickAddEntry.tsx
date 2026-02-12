import { useMemo, useCallback } from "react";
import { type FieldErrors, FormProvider, type Resolver, useForm, Controller } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { Badge, BADGE_COLOR, BADGE_SIZE, Button, BUTTON_SIZE, BUTTON_VARIANT, FormField, FormFieldError, FormFieldLabel, ICON_NAME, Message, MESSAGE_COLOR, MessageIcon, Select, SelectContent, SelectControl, type SelectCustomOptionRendererArg } from "@ovhcloud/ods-react";
import { zForm, AddEntrySchemaType, FIELD_TYPES_POINTING_RECORDS, FIELD_TYPES_EXTENDED_RECORDS, FIELD_TYPES_MAIL_RECORDS } from "../../../utils/formSchema.utils";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import {
  FieldTypeExtendedRecordsEnum,
  FieldTypeMailRecordsEnum,
  FieldTypePointingRecordsEnum,
} from "@/common/enum/zone.enum";
import { ARecordForm } from "../add/components/forms/ARecordForm";
import { AAAARecordForm } from "../add/components/forms/AAAARecordForm";
import { NSRecordForm } from "../add/components/forms/NSRecordForm";
import { CNAMERecordForm } from "../add/components/forms/CNAMERecordForm";
import { DNAMERecordForm } from "../add/components/forms/DNAMERecordForm";
import { CAARecordForm } from "../add/components/forms/CAARecordForm";
import { TXTRecordForm } from "../add/components/forms/TXTRecordForm";
import { NAPTRRecordForm } from "../add/components/forms/NAPTRRecordForm";
import { SRVRecordForm } from "../add/components/forms/SRVRecordForm";
import { LOCRecordForm } from "../add/components/forms/LOCRecordForm";
import { SSHFPRecordForm } from "../add/components/forms/SSHFPRecordForm";
import { TLSARecordForm } from "../add/components/forms/TLSARecordForm";
import { RPRecordForm } from "../add/components/forms/RPRecordForm";
import { SVCBRecordForm } from "../add/components/forms/SVCBRecordForm";
import { HTTPSRecordForm } from "../add/components/forms/HTTPSRecordForm";
import { MXRecordForm } from "../add/components/forms/MXRecordForm";
import { DKIMRecordForm } from "../add/components/forms/DKIMRecordForm";
import { DMARCRecordForm } from "../add/components/forms/DMARCRecordForm";
import { SPFRecordForm } from "../add/components/forms/SPFRecordForm";

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
  readonly serviceName: string;
  readonly onSuccess?: () => void;
  readonly onCancel?: () => void;
}

export default function QuickAddEntry({ serviceName, onSuccess, onCancel }: QuickAddEntryProps) {
  const { t } = useTranslation(["zone", "form", NAMESPACES.ACTIONS]);

  const resolver = useMemo(() => addEntryResolver(t), [t]);

  const methods = useForm<AddEntrySchemaType>({
    defaultValues: { recordType: "", subDomain: "", ttlSelect: "global", ttl: 60 },
    mode: "onTouched",
    resolver,
  });

  const { watch, formState: { isValid }, handleSubmit, setValue, control, reset } = methods;
  const recordType = watch("recordType");
  const subDomain = watch("subDomain");
  const target = watch("target");

  const fullDomain = subDomain ? `${subDomain}.${serviceName}` : `[sous-domaine].${serviceName}`;

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
    if (fieldType === FieldTypeExtendedRecordsEnum.CAA) {
      setValue('flags', 0);
    }
  }, [setValue]);

  const onSubmit = useCallback((data: AddEntrySchemaType) => {
    addEntry(data);
  }, [addEntry]);

  const handleCancel = useCallback(() => {
    reset();
    onCancel?.();
  }, [reset, onCancel]);

  const selectItems = [
    {
      label: t('zone_page_add_entry_point'),
      options: FIELD_TYPES_POINTING_RECORDS.map((type) => ({ value: type, label: type })),
    },
    {
      label: t('zone_page_add_entry_mail'),
      options: ([...FIELD_TYPES_MAIL_RECORDS] as string[]).map((type) => ({ value: type, label: type, customRendererData: { isAdvanced: type === FieldTypeMailRecordsEnum.SPF || type == FieldTypeMailRecordsEnum.DKIM ? true : false } })),
    },
    {
      label: t('zone_page_add_entry_extended'),
      options: FIELD_TYPES_EXTENDED_RECORDS.map((type) => ({ value: type, label: type, customRendererData: { isAdvanced: true } })),
    },
  ];

  function renderOption({ customData, label }: SelectCustomOptionRendererArg<{ isAdvanced?: boolean }>) {
    return (
      <div className="flex items-center gap-2">
        {customData?.isAdvanced && (
          <Badge color={BADGE_COLOR.warning} size={BADGE_SIZE.sm}>
            {t('zone_page_add_entry_badge_advanced')}
          </Badge>
        )}
        <span className="flex-1">{label}</span>
      </div>
    );
  }

  const recordTypeStr = typeof recordType === 'string' ? recordType : '';

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
                    <SelectContent customOptionRenderer={renderOption} />
                  </Select>
                  {error?.message && <FormFieldError>{error.message}</FormFieldError>}
                </div>
              )}
            />
          </FormField>

          {recordTypeStr === FieldTypeMailRecordsEnum.SPF && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                <div>
                  {t("zone_page_quick_add_entry_explanation_SPF")}
                  <br />
                  <Trans
                    t={t}
                    i18nKey="zone_page_quick_add_entry_description_SPF"
                    values={{ domain: serviceName }}
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </div>
              </Message>
              <SPFRecordForm serviceName={serviceName} />
            </>
          )}

          {recordTypeStr === FieldTypeExtendedRecordsEnum.NAPTR && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                <div>
                  {t("zone_page_quick_add_entry_explanation_NAPTR")}
                  <br />
                  <Trans
                    t={t}
                    i18nKey="zone_page_quick_add_entry_description_NAPTR"
                    values={{ domain: fullDomain }}
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </div>
              </Message>
              <NAPTRRecordForm control={control} watch={watch} domainSuffix={serviceName} />
            </>
          )}

          {recordTypeStr === FieldTypeExtendedRecordsEnum.LOC && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                <div>
                  {t("zone_page_quick_add_entry_explanation_LOC")}
                  <br />
                  <Trans
                    t={t}
                    i18nKey="zone_page_quick_add_entry_description_LOC"
                    values={{ domain: fullDomain }}
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </div>
              </Message>
              <LOCRecordForm control={control} watch={watch} domainSuffix={serviceName} />
            </>
          )}

          {recordTypeStr === FieldTypePointingRecordsEnum.A && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                <div>
                  {t("zone_page_quick_add_entry_explanation_A")}
                  <br />
                  <Trans
                    t={t}
                    i18nKey="zone_page_quick_add_entry_description_A"
                    values={{ domain: fullDomain, ip: target || "[IPv4]" }}
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </div>
              </Message>
              <ARecordForm control={control} watch={watch} domainSuffix={serviceName} />
            </>
          )}

          {recordTypeStr === FieldTypePointingRecordsEnum.AAAA && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                <div>
                  {t("zone_page_quick_add_entry_explanation_AAAA")}
                  <br />
                  <Trans
                    t={t}
                    i18nKey="zone_page_quick_add_entry_description_AAAA"
                    values={{ domain: fullDomain, ip: target || "[IPv6]" }}
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </div>
              </Message>
              <AAAARecordForm control={control} watch={watch} domainSuffix={serviceName} />
            </>
          )}

          {recordTypeStr === FieldTypePointingRecordsEnum.NS && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                <div>
                  {t("zone_page_quick_add_entry_explanation_NS")}
                  <br />
                  <Trans
                    t={t}
                    i18nKey="zone_page_quick_add_entry_description_NS"
                    values={{ domain: fullDomain, target: target || "[serveur DNS]" }}
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </div>
              </Message>
              <NSRecordForm control={control} watch={watch} domainSuffix={serviceName} />
            </>
          )}

          {recordTypeStr === FieldTypePointingRecordsEnum.CNAME && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                <div>
                  {t("zone_page_quick_add_entry_explanation_CNAME")}
                  <br />
                  <Trans
                    t={t}
                    i18nKey="zone_page_quick_add_entry_description_CNAME"
                    values={{ domain: fullDomain, target: target || "[nom d'hôte]" }}
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </div>
              </Message>
              <CNAMERecordForm control={control} watch={watch} domainSuffix={serviceName} />
            </>
          )}

          {recordTypeStr === FieldTypePointingRecordsEnum.DNAME && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                <div>
                  {t("zone_page_quick_add_entry_explanation_DNAME")}
                  <br />
                  <Trans
                    t={t}
                    i18nKey="zone_page_quick_add_entry_description_DNAME"
                    values={{ domain: fullDomain, target: target || "[nom de domaine]" }}
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </div>
              </Message>
              <DNAMERecordForm control={control} watch={watch} domainSuffix={serviceName} />
            </>
          )}

          {recordTypeStr === FieldTypeExtendedRecordsEnum.CAA && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                <div>
                  {t("zone_page_quick_add_entry_explanation_CAA")}
                  <br />
                  <Trans
                    t={t}
                    i18nKey="zone_page_quick_add_entry_description_CAA"
                    values={{ domain: fullDomain, target: target || "[autorité de certification]" }}
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </div>
              </Message>
              <CAARecordForm control={control} watch={watch} domainSuffix={serviceName} />
            </>
          )}

          {recordTypeStr === FieldTypeExtendedRecordsEnum.TXT && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                <div>
                  {t("zone_page_quick_add_entry_explanation_TXT")}
                  <br />
                  <Trans
                    t={t}
                    i18nKey="zone_page_quick_add_entry_description_TXT"
                    values={{ domain: fullDomain, target: target || "[valeur]" }}
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </div>
              </Message>
              <TXTRecordForm control={control} watch={watch} domainSuffix={serviceName} />
            </>
          )}

          {recordTypeStr === FieldTypeExtendedRecordsEnum.SRV && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                <div>
                  {t("zone_page_quick_add_entry_explanation_SRV")}
                  <br />
                  <Trans
                    t={t}
                    i18nKey="zone_page_quick_add_entry_description_SRV"
                    values={{ domain: fullDomain, target: target || "[serveur]" }}
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </div>
              </Message>
              <SRVRecordForm control={control} watch={watch} domainSuffix={serviceName} />
            </>
          )}

          {recordTypeStr === FieldTypeExtendedRecordsEnum.SSHFP && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                <div>
                  {t("zone_page_quick_add_entry_explanation_SSHFP")}
                  <br />
                  <Trans
                    t={t}
                    i18nKey="zone_page_quick_add_entry_description_SSHFP"
                    values={{ domain: fullDomain }}
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </div>
              </Message>
              <SSHFPRecordForm control={control} watch={watch} domainSuffix={serviceName} />
            </>
          )}

          {recordTypeStr === FieldTypeExtendedRecordsEnum.TLSA && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                <div>
                  {t("zone_page_quick_add_entry_explanation_TLSA")}
                  <br />
                  <Trans
                    t={t}
                    i18nKey="zone_page_quick_add_entry_description_TLSA"
                    values={{ domain: fullDomain }}
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </div>
              </Message>
              <TLSARecordForm control={control} watch={watch} domainSuffix={serviceName} />
            </>
          )}

          {recordTypeStr === FieldTypeExtendedRecordsEnum.RP && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                <div>
                  {t("zone_page_quick_add_entry_explanation_RP")}
                  <br />
                  <Trans
                    t={t}
                    i18nKey="zone_page_quick_add_entry_description_RP"
                    values={{ domain: fullDomain }}
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </div>
              </Message>
              <RPRecordForm control={control} watch={watch} domainSuffix={serviceName} />
            </>
          )}

          {recordTypeStr === FieldTypeExtendedRecordsEnum.SVCB && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                <div>
                  {t("zone_page_quick_add_entry_explanation_SVCB")}
                  <br />
                  <Trans
                    t={t}
                    i18nKey="zone_page_quick_add_entry_description_SVCB"
                    values={{ domain: fullDomain, target: target || "[cible]" }}
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </div>
              </Message>
              <SVCBRecordForm control={control} watch={watch} domainSuffix={serviceName} />
            </>
          )}

          {recordTypeStr === FieldTypeExtendedRecordsEnum.HTTPS && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                <div>
                  {t("zone_page_quick_add_entry_explanation_HTTPS")}
                  <br />
                  <Trans
                    t={t}
                    i18nKey="zone_page_quick_add_entry_description_HTTPS"
                    values={{ domain: fullDomain, target: target || "[cible]" }}
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </div>
              </Message>
              <HTTPSRecordForm control={control} watch={watch} domainSuffix={serviceName} />
            </>
          )}

          {recordTypeStr === FieldTypeMailRecordsEnum.MX && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                <div>
                  {t("zone_page_quick_add_entry_explanation_MX")}
                  <br />
                  <Trans
                    t={t}
                    i18nKey="zone_page_quick_add_entry_description_MX"
                    values={{ domain: fullDomain, target: target || "[serveur]" }}
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </div>
              </Message>
              <MXRecordForm control={control} watch={watch} domainSuffix={serviceName} />
            </>
          )}

          {recordTypeStr === FieldTypeMailRecordsEnum.DKIM && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                <div>
                  {t("zone_page_quick_add_entry_explanation_DKIM")}
                  <br />
                  <Trans
                    t={t}
                    i18nKey="zone_page_quick_add_entry_description_DKIM"
                    values={{ domain: fullDomain }}
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </div>
              </Message>
              <DKIMRecordForm control={control} watch={watch} domainSuffix={serviceName} />
            </>
          )}

          {recordTypeStr === FieldTypeMailRecordsEnum.DMARC && (
            <>
              <Message color={MESSAGE_COLOR.information} dismissible={false}>
                <MessageIcon name={ICON_NAME.circleInfo} />
                <div>
                  {t("zone_page_quick_add_entry_explanation_DMARC")}
                  <br />
                  <Trans
                    t={t}
                    i18nKey="zone_page_quick_add_entry_description_DMARC"
                    values={{ domain: fullDomain }}
                    components={{ bold: <span className="font-bold" /> }}
                  />
                </div>
              </Message>
              <DMARCRecordForm control={control} watch={watch} domainSuffix={serviceName} />
            </>
          )}

          {recordTypeStr && (
            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button
                type="button"
                variant={BUTTON_VARIANT.outline}
                size={BUTTON_SIZE.sm}
                onClick={handleCancel}
                disabled={isPending}
              >
                {t(`${NAMESPACES.ACTIONS}:cancel`)}
              </Button>
              {recordTypeStr === FieldTypeMailRecordsEnum.SPF ? (
                <Button
                  type="button"
                  size={BUTTON_SIZE.sm}
                  disabled={isPending}
                  loading={isPending}
                  onClick={() => {
                    const spfValue = "v=spf1 include:mx.ovh.com ~all";
                    setValue("target", spfValue);
                    setValue("subDomain", "");
                    handleSubmit(onSubmit)();
                  }}
                >
                  {t("zone_page_add_entry_modal_spf_button_use_spf_ovh")}
                </Button>
              ) : (
                  <Button
                    type="submit"
                    size={BUTTON_SIZE.sm}
                    disabled={!isValid || isPending}
                    loading={isPending}
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
