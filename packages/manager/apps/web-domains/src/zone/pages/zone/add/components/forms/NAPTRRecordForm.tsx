import { type Control, type UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";
import { SubDomainField } from "../fields/SubDomainField";
import { NumberField } from "../fields/NumberField";
import { TextField } from "../fields/TextField";
import { TtlField } from "../fields/TtlField";

export interface NAPTRRecordFormProps {
  readonly control: Control<AddEntrySchemaType>;
  readonly watch: UseFormWatch<AddEntrySchemaType>;
  readonly domainSuffix: string;
}

/**
 * Formulaire dédié pour les enregistrements DNS de type NAPTR.
 *
 * Champs affichés :
 * - Ligne 1 : Sous-domaine + TTL
 * - Ligne 2 : Ordre + Préférence + Attribut + Service
 * - Ligne 3 : Expression régulière + Remplacement (mutuellement exclusifs)
 */
export function NAPTRRecordForm({
  control,
  watch,
  domainSuffix,
}: NAPTRRecordFormProps) {
  const { t } = useTranslation("zone");

  const regexValue = watch("regex");
  const replaceValue = watch("replace");
  const hasRegex = typeof regexValue === "string" && regexValue.trim() !== "";
  const hasReplace = typeof replaceValue === "string" && replaceValue.trim() !== "";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[2fr_200px] items-start gap-4">
        <SubDomainField
          control={control}
          domainSuffix={domainSuffix}
          className="w-full"
          tooltip={t("zone_page_tooltip_subdomain")}
        />
        <TtlField control={control} watch={watch} tooltip={t("zone_page_tooltip_ttl")} />
      </div>
      <div className="grid grid-cols-[auto_auto_auto_1fr] items-start gap-4">
        <NumberField
          name="order"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_naptr_order")}
          required
          min={0}
          max={65535}
          className="w-full"
          tooltip={t("zone_page_tooltip_naptr_order")}
        />
        <NumberField
          name="pref"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_naptr_pref")}
          required
          min={0}
          max={65535}
          className="w-full"
          tooltip={t("zone_page_tooltip_naptr_pref")}
        />
        <TextField
          name="flag"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_naptr_flag")}
          tooltipText={t("zone_page_add_entry_modal_step_2_naptr_flag_help")}
          maxLength={1}
          className="w-full"
        />
        <TextField
          name="service"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_naptr_service")}
          required
          tooltipText={t("zone_page_add_entry_modal_step_2_naptr_service_help")}
          className="w-full"
        />
      </div>
      <div className="grid grid-cols-2 items-start gap-4">
        <TextField
          name="regex"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_naptr_regex")}
          tooltipText={t("zone_page_add_entry_modal_step_2_naptr_regex_help")}
          disabled={hasReplace}
          className="w-full"
        />
        <TextField
          name="replace"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_naptr_replace")}
          tooltipText={t("zone_page_add_entry_modal_step_2_naptr_replace_help")}
          disabled={hasRegex}
          className="w-full"
        />
      </div>
    </div>
  );
}
