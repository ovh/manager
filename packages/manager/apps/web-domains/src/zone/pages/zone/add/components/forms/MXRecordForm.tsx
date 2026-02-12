import { type Control, type UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";
import { SubDomainField } from "../fields/SubDomainField";
import { NumberField } from "../fields/NumberField";
import { TextField } from "../fields/TextField";
import { TtlField } from "../fields/TtlField";

export interface MXRecordFormProps {
  readonly control: Control<AddEntrySchemaType>;
  readonly watch: UseFormWatch<AddEntrySchemaType>;
  readonly domainSuffix: string;
}

/**
 * Formulaire dédié pour les enregistrements DNS de type MX.
 *
 * Champs affichés :
 * - Ligne 1 : Sous-domaine + TTL
 * - Ligne 2 : Priorité + Cible (serveur mail)
 */
export function MXRecordForm({
  control,
  watch,
  domainSuffix,
}: MXRecordFormProps) {
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
        <TtlField
          control={control}
          watch={watch}
          tooltip={t("zone_page_tooltip_ttl")}
        />
      </div>
      <div className="grid grid-cols-[auto_1fr] items-start gap-4">
        <NumberField
          name="priority"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_priority")}
          required
          min={0}
          max={65535}
          tooltip={t("zone_page_tooltip_mx_priority")}
        />
        <TextField
          name="target"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_mx_target")}
          required
          className="w-full"
          tooltipText={t("zone_page_tooltip_mx_target")}
        />
      </div>
    </div>
  );
}
