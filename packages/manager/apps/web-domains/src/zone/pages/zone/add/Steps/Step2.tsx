import {
  FormField,
  FormFieldLabel,
  Message,
  MESSAGE_COLOR,
  Text,
  Textarea,
  TEXT_PRESET,
} from "@ovhcloud/ods-react";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { toASCII } from "punycode";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import type { AddEntrySchemaType } from "../../../../utils/formSchema.utils";
import {
  FIELD_TYPES_MAIL_RECORDS,
  getRecordFields,
  getTargetDisplayValue,
  RECORD_TYPES_AS_TXT,
  RECORD_TYPES_TARGET_WITH_TRAILING_DOT,
  RECORD_TYPES_WITHOUT_TTL,
} from "../../../../utils/formSchema.utils";
import { RecordFieldInputs } from "../components/Inputs.component";
import { SubDomainField, TtlField } from "../components/SubDomainAndTtl.component";
import Dkim from "./mailType/Dkim";
import Spf from "./mailType/Spf";
import Naptr from "./pointType/Naptr";
import Loc from "./pointType/Loc";

export default function Step2() {
  const { t } = useTranslation(["zone", NAMESPACES.FORM, NAMESPACES.ACTIONS]);
  const { watch, control } = useFormContext<AddEntrySchemaType>();
  const recordType = String(watch("recordType") ?? "");
  const { serviceName } = useParams();
  const fields = getRecordFields(recordType);
  const showTtl = !RECORD_TYPES_WITHOUT_TTL.includes(recordType);

  const isMailRecord = (FIELD_TYPES_MAIL_RECORDS as readonly string[]).includes(recordType);
  const showMxHelp = isMailRecord && recordType === "MX";

  const formValues = watch();
  const subDomainRaw = String(formValues?.subDomain ?? "").trim();
  const subDomainPart = subDomainRaw ? (() => { try { return toASCII(subDomainRaw); } catch { return subDomainRaw; } })() : "";
  const ttlSelect = formValues?.ttlSelect;
  const ttl = formValues?.ttl;
  const ttlPart = ttlSelect === "custom" && ttl != null && ttl !== "" ? String(ttl) : "";
  const isTxtRecordType = (RECORD_TYPES_AS_TXT as readonly string[]).includes(recordType);
  const displayType = isTxtRecordType ? "TXT" : recordType;
  
  let valuePart: string;
  if (recordType === "SPF" && formValues?.target) {
    valuePart = String(formValues.target);
  } else if (recordType === "DKIM") {
    valuePart = getTargetDisplayValue("DKIM", formValues);
  } else if (recordType === "NAPTR") {
    valuePart = getTargetDisplayValue("NAPTR", formValues);
  } else if (recordType === "LOC") {
    valuePart = getTargetDisplayValue("LOC", formValues);
  } else {
    const fieldValues = fields
      .map((f) => formValues?.[f.name as keyof AddEntrySchemaType])
      .filter((v) => v !== undefined && v !== "" && v != null)
      .map(String);
    valuePart = fieldValues.join(" ");
  }
  
  const rdataNeedsTrailingDot = (RECORD_TYPES_TARGET_WITH_TRAILING_DOT as readonly string[]).includes(
    recordType,
  );
  const rdataPart = recordType === "SPF"
    ? valuePart
    : isTxtRecordType
      ? `"${valuePart}"`
      : rdataNeedsTrailingDot && valuePart
        ? `${valuePart}.`
        : valuePart;
  const recordPreview = [subDomainPart, ttlPart, "IN", displayType, rdataPart]
    .filter(Boolean)
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim();


  return (
    <div className="w-full space-y-4">
      <Text preset={TEXT_PRESET.caption}>{t(`${NAMESPACES.FORM}:mandatory_fields`)}</Text>
      {recordType !== "SPF" && recordType !== "DKIM" && recordType !== "NAPTR" && recordType !== "LOC" && (
        <SubDomainField
          control={control}
          domainSuffix={serviceName ?? ""}
          className="mb-4 w-full"
          required={recordType === "NS"}
        />
      )}
      {recordType === "SPF" && <Spf />}
      {recordType === "DKIM" && <Dkim />}
      {recordType === "NAPTR" && <Naptr />}
      {recordType === "LOC" && <Loc />}
      {recordType !== "SPF" && recordType !== "DKIM" && recordType !== "NAPTR" && recordType !== "LOC" && showTtl && (
        <TtlField control={control} watch={watch} className="mb-4" />
      )}
      {recordType !== "SPF" && recordType !== "DKIM" && recordType !== "NAPTR" && recordType !== "LOC" && (
        <RecordFieldInputs fields={fields} control={control} />
      )}
      <FormField className="w-1/2">
        <FormFieldLabel>{t('zone_page_add_entry_modal_step_2_record_type_label', { recordType })}</FormFieldLabel>
        <Textarea className="w-full" value={recordPreview} readOnly disabled />
      </FormField>
      {showMxHelp && (
        <Message color={MESSAGE_COLOR.warning} className="w-full" dismissible={false}>
          {t("zone_page_add_entry_modal_step_2_mx_help")}
        </Message>
      )}
    </div>
  );
}
