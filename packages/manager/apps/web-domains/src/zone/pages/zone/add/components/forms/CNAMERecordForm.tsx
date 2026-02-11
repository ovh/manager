import { type Control, type UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";
import { SubDomainField } from "../fields/SubDomainField";
import { TextField } from "../fields/TextField";
import { TtlField } from "../fields/TtlField";

export interface CNAMERecordFormProps {
  control: Control<AddEntrySchemaType>;
  watch: UseFormWatch<AddEntrySchemaType>;
  domainSuffix: string;
}

export function CNAMERecordForm({
  control,
  watch,
  domainSuffix,
}: Readonly<CNAMERecordFormProps>) {
  const { t } = useTranslation("zone");

  return (
    <div className="grid grid-cols-[2fr_minmax(200px,1fr)_200px] items-start gap-4">
      <SubDomainField
        control={control}
        domainSuffix={domainSuffix}
        className="w-full"
        tooltip={t("zone_page_tooltip_subdomain_cname")}
      />
      <TextField
        name="target"
        control={control}
        label={t("zone_page_add_entry_modal_step_2_label_cname_target")}
        required
        className="w-full"
        tooltipText={t("zone_page_tooltip_cname_target")}
      />
      <TtlField control={control} watch={watch} tooltip={t("zone_page_tooltip_ttl")} />
    </div>
  );
}
