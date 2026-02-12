import { type Control, type UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";
import { SubDomainField } from "../fields/SubDomainField";
import { TextField } from "../fields/TextField";
import { TtlField } from "../fields/TtlField";

export interface RPRecordFormProps {
  readonly control: Control<AddEntrySchemaType>;
  readonly watch: UseFormWatch<AddEntrySchemaType>;
  readonly domainSuffix: string;
}

/**
 * Formulaire dédié pour les enregistrements DNS de type RP.
 *
 * Champs affichés :
 * - Ligne 1 : Sous-domaine + TTL
 * - Ligne 2 : Contact (mbox) + Infos (txt)
 */
export function RPRecordForm({
  control,
  watch,
  domainSuffix,
}: RPRecordFormProps) {
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
      <div className="grid grid-cols-2 items-start gap-4">
        <TextField
          name="mbox"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_rp_mbox")}
          required
          className="w-full"
          tooltipText={t("zone_page_tooltip_rp_mbox")}
        />
        <TextField
          name="txt"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_rp_txt")}
          required
          className="w-full"
          tooltipText={t("zone_page_tooltip_rp_txt")}
        />
      </div>
    </div>
  );
}
