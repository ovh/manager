import { type Control, type UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";
import { SubDomainField } from "../fields/SubDomainField";
import { NumberField } from "../fields/NumberField";
import { TextField } from "../fields/TextField";
import { TtlField } from "../fields/TtlField";

export interface TLSARecordFormProps {
  readonly control: Control<AddEntrySchemaType>;
  readonly watch: UseFormWatch<AddEntrySchemaType>;
  readonly domainSuffix: string;
}

/**
 * Formulaire dédié pour les enregistrements DNS de type TLSA.
 *
 * Champs affichés :
 * - Ligne 1 : Sous-domaine + TTL
 * - Ligne 2 : Usage + Sélecteur + Type de correspondance + Données du certificat
 */
export function TLSARecordForm({
  control,
  watch,
  domainSuffix,
}: TLSARecordFormProps) {
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
      <div className="grid grid-cols-[auto_auto_auto_1fr] items-start gap-4">
        <NumberField
          name="usage"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_tlsa_usage")}
          required
          min={0}
          max={3}
          tooltip={t("zone_page_tooltip_tlsa_usage")}
        />
        <NumberField
          name="selector"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_tlsa_selector")}
          required
          min={0}
          max={1}
          tooltip={t("zone_page_tooltip_tlsa_selector")}
        />
        <NumberField
          name="matchingType"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_tlsa_matching")}
          required
          min={1}
          max={2}
          tooltip={t("zone_page_tooltip_tlsa_matching")}
        />
        <TextField
          name="certificateData"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_tlsa_cert")}
          required
          className="w-full"
          tooltipText={t("zone_page_tooltip_tlsa_cert")}
        />
      </div>
    </div>
  );
}
