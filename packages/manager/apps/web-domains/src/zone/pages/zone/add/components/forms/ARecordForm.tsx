import {
  FormField,
  FormFieldLabel,
  Input,
  INPUT_TYPE,
} from "@ovhcloud/ods-react";
import { type Control, type UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";
import { SubDomainField } from "../fields/SubDomainField";
import { TextField } from "../fields/TextField";

export interface ARecordFormProps {
  control: Control<AddEntrySchemaType>;
  watch: UseFormWatch<AddEntrySchemaType>;
  domainSuffix: string;
}

export function ARecordForm({
  control,
  domainSuffix,
}: Readonly<ARecordFormProps>) {
  const { t } = useTranslation("zone");

  return (
    <div className="grid grid-cols-[2fr_minmax(200px,1fr)_200px] items-start gap-4">
      <SubDomainField
        control={control}
        domainSuffix={domainSuffix}
        className="w-full"
      />
      <TextField
        name="target"
        control={control}
        label={t("zone_page_add_entry_modal_step_2_label_ipv4")}
        required
        className="w-full"
      />
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
    </div>
  );
}
