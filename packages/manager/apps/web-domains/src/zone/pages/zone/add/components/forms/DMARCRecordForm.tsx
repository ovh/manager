import { type Control, type UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";
import { SubDomainField } from "../fields/SubDomainField";
import { NumberField } from "../fields/NumberField";
import { SelectField } from "../fields/SelectField";
import { TextField } from "../fields/TextField";
import { TtlField } from "../fields/TtlField";

export interface DMARCRecordFormProps {
  readonly control: Control<AddEntrySchemaType>;
  readonly watch: UseFormWatch<AddEntrySchemaType>;
  readonly domainSuffix: string;
}

const DMARC_POLICY_ITEMS = [
  { labelKey: "zone_page_add_entry_modal_step_2_label_dmarc_policy_none", value: "none" },
  { labelKey: "zone_page_add_entry_modal_step_2_label_dmarc_policy_quarantine", value: "quarantine" },
  { labelKey: "zone_page_add_entry_modal_step_2_label_dmarc_policy_reject", value: "reject" },
];

const DMARC_ASPF_ITEMS = [
  { labelKey: "zone_page_add_entry_modal_step_2_label_dmarc_aspf_r", value: "r" },
  { labelKey: "zone_page_add_entry_modal_step_2_label_dmarc_aspf_s", value: "s" },
];

/**
 * Formulaire dédié pour les enregistrements DNS de type DMARC.
 *
 * Champs affichés :
 * - Ligne 1 : Sous-domaine + TTL
 * - Ligne 2 : Règle domaine + Pourcentage + URI rapports
 * - Ligne 3 : Règle sous-domaines + Alignement SPF
 */
export function DMARCRecordForm({
  control,
  watch,
  domainSuffix,
}: DMARCRecordFormProps) {
  const { t } = useTranslation("zone");

  const policyItems = DMARC_POLICY_ITEMS.map(({ labelKey, value }) => ({
    label: t(labelKey),
    value,
  }));

  const aspfItems = DMARC_ASPF_ITEMS.map(({ labelKey, value }) => ({
    label: t(labelKey),
    value,
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[2fr_200px] items-start gap-4">
        <SubDomainField
          control={control}
          domainSuffix={domainSuffix}
          className="w-full"
          tooltip={t("zone_page_tooltip_subdomain")}
        />
        <TtlField
          control={control}
          watch={watch}
          tooltip={t("zone_page_tooltip_ttl")}
        />
      </div>
      <div className="grid grid-cols-3 items-start gap-4">
        <SelectField
          name="p"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_dmarc_p")}
          required
          items={policyItems}
          tooltip={t("zone_page_tooltip_dmarc_p")}
        />
        <NumberField
          name="pct"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_dmarc_pct")}
          min={0}
          max={100}
          tooltip={t("zone_page_tooltip_dmarc_pct")}
        />
        <TextField
          name="rua"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_dmarc_rua")}
          className="w-full"
          tooltipText={t("zone_page_tooltip_dmarc_rua")}
        />
      </div>
      <div className="grid grid-cols-2 items-start gap-4">
        <SelectField
          name="sp"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_dmarc_sp")}
          items={policyItems}
          tooltip={t("zone_page_tooltip_dmarc_sp")}
        />
        <SelectField
          name="aspf"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_dmarc_aspf")}
          items={aspfItems}
          tooltip={t("zone_page_tooltip_dmarc_aspf")}
        />
      </div>
    </div>
  );
}
