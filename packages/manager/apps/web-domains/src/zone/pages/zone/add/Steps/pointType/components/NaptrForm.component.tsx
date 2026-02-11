import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";
import { NumberField } from "../../../components/fields/NumberField";
import { TextField } from "../../../components/fields/TextField";

const TOOLTIP_KEYS = {
  flag: "zone_page_add_entry_modal_step_2_naptr_flag_help",
  service: "zone_page_add_entry_modal_step_2_naptr_service_help",
  regex: "zone_page_add_entry_modal_step_2_naptr_regex_help",
  replace: "zone_page_add_entry_modal_step_2_naptr_replace_help",
} as const;

export function NaptrFormContent() {
  const { t } = useTranslation("zone");
  const { control, watch } = useFormContext<AddEntrySchemaType>();
  const regexValue = watch("regex");
  const replaceValue = watch("replace");
  const hasRegex = typeof regexValue === "string" && regexValue.trim() !== "";
  const hasReplace = typeof replaceValue === "string" && replaceValue.trim() !== "";

  return (
    <div className="mt-4 w-full space-y-4" data-testid="naptr-form">
      <NumberField
        name="order"
        control={control}
        label={t("zone_page_add_entry_modal_step_2_label_naptr_order")}
        required
        min={0}
        max={65535}
        step={1}
        className="w-1/2"
      />

      <NumberField
        name="pref"
        control={control}
        label={t("zone_page_add_entry_modal_step_2_label_naptr_pref")}
        required
        min={0}
        max={65535}
        step={1}
        className="w-1/2"
      />

      <TextField
        name="flag"
        control={control}
        label={t("zone_page_add_entry_modal_step_2_label_naptr_flag")}
        tooltipText={t(TOOLTIP_KEYS.flag)}
        maxLength={1}
        className="w-1/2"
        inputClassName="max-w-[4rem]"
      />

      <TextField
        name="service"
        control={control}
        label={t("zone_page_add_entry_modal_step_2_label_naptr_service")}
        required
        tooltipText={t(TOOLTIP_KEYS.service)}
        className="w-1/2"
      />

      <TextField
        name="regex"
        control={control}
        label={t("zone_page_add_entry_modal_step_2_label_naptr_regex")}
        tooltipText={t(TOOLTIP_KEYS.regex)}
        disabled={hasReplace}
        className="w-1/2"
      />

      <TextField
        name="replace"
        control={control}
        label={t("zone_page_add_entry_modal_step_2_label_naptr_replace")}
        tooltipText={t(TOOLTIP_KEYS.replace)}
        disabled={hasRegex}
        className="w-1/2"
      />
    </div>
  );
}
