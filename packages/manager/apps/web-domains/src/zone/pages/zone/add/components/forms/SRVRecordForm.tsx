import { type Control, type UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";
import { SubDomainField } from "../fields/SubDomainField";
import { NumberField } from "../fields/NumberField";
import { TextField } from "../fields/TextField";
import { TtlField } from "../fields/TtlField";

export interface SRVRecordFormProps {
  readonly control: Control<AddEntrySchemaType>;
  readonly watch: UseFormWatch<AddEntrySchemaType>;
  readonly domainSuffix: string;
}

/**
 * Formulaire dédié pour les enregistrements DNS de type SRV.
 *
 * Champs affichés :
 * - Ligne 1 : Sous-domaine + TTL
 * - Ligne 2 : Priorité + Poids + Port + Cible
 */
export function SRVRecordForm({
  control,
  watch,
  domainSuffix,
}: SRVRecordFormProps) {
  const { t } = useTranslation("zone");

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
          name="priority"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_priority")}
          required
          min={0}
          max={65535}
          className="w-full"
          tooltip={t("zone_page_tooltip_srv_priority")}
        />
        <NumberField
          name="weight"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_weight")}
          required
          min={0}
          max={65535}
          className="w-full"
          tooltip={t("zone_page_tooltip_srv_weight")}
        />
        <NumberField
          name="port"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_port")}
          required
          min={0}
          max={65535}
          className="w-full"
          tooltip={t("zone_page_tooltip_srv_port")}
        />
        <TextField
          name="target"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_srv_target")}
          required
          tooltipText={t("zone_page_tooltip_srv_target")}
          className="w-full"
        />
      </div>
    </div>
  );
}
