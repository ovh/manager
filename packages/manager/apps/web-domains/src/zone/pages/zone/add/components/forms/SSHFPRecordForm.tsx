import { type Control, type UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";
import { SubDomainField } from "../fields/SubDomainField";
import { SelectField } from "../fields/SelectField";
import { TextField } from "../fields/TextField";
import { TtlField } from "../fields/TtlField";

export interface SSHFPRecordFormProps {
  readonly control: Control<AddEntrySchemaType>;
  readonly watch: UseFormWatch<AddEntrySchemaType>;
  readonly domainSuffix: string;
}

const SSHFP_ALGORITHM_ITEMS = [
  { labelKey: "zone_page_add_entry_modal_step_2_label_sshfp_algorithm_1", value: "1" },
  { labelKey: "zone_page_add_entry_modal_step_2_label_sshfp_algorithm_2", value: "2" },
  { labelKey: "zone_page_add_entry_modal_step_2_label_sshfp_algorithm_3", value: "3" },
  { labelKey: "zone_page_add_entry_modal_step_2_label_sshfp_algorithm_4", value: "4" },
];

const SSHFP_FPTYPE_ITEMS = [
  { labelKey: "zone_page_add_entry_modal_step_2_label_sshfp_fptype_1", value: "1" },
  { labelKey: "zone_page_add_entry_modal_step_2_label_sshfp_fptype_2", value: "2" },
];

/**
 * Formulaire dédié pour les enregistrements DNS de type SSHFP.
 *
 * Champs affichés :
 * - Ligne 1 : Sous-domaine + TTL
 * - Ligne 2 : Algorithme + Type d'empreinte + Empreinte
 */
export function SSHFPRecordForm({
  control,
  watch,
  domainSuffix,
}: SSHFPRecordFormProps) {
  const { t } = useTranslation("zone");

  const algorithmItems = SSHFP_ALGORITHM_ITEMS.map(({ labelKey, value }) => ({
    label: t(labelKey),
    value,
  }));

  const fptypeItems = SSHFP_FPTYPE_ITEMS.map(({ labelKey, value }) => ({
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
        <TtlField control={control} watch={watch} tooltip={t("zone_page_tooltip_ttl")} />
      </div>
      <div className="grid grid-cols-[auto_auto_1fr] items-start gap-4">
        <SelectField
          name="algorithm"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_algorithm")}
          required
          items={algorithmItems}
          tooltip={t("zone_page_tooltip_sshfp_algorithm")}
        />
        <SelectField
          name="fptype"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_fptype")}
          required
          items={fptypeItems}
          tooltip={t("zone_page_tooltip_sshfp_fptype")}
        />
        <TextField
          name="fp"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_fp")}
          required
          className="w-full"
          tooltipText={t("zone_page_tooltip_sshfp_fp")}
        />
      </div>
    </div>
  );
}
