import { type Control, type UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";
import { SubDomainField } from "../fields/SubDomainField";
import { NumberField } from "../fields/NumberField";
import { SelectField } from "../fields/SelectField";
import { TextField } from "../fields/TextField";
import { TtlField } from "../fields/TtlField";

export interface CAARecordFormProps {
  readonly control: Control<AddEntrySchemaType>;
  readonly watch: UseFormWatch<AddEntrySchemaType>;
  readonly domainSuffix: string;
}

/**
 * Formulaire dédié pour les enregistrements DNS de type CAA.
 *
 * Champs affichés :
 * - Sous-domaine (SubDomainField)
 * - Indicateur / flags (NumberField, 0-255, requis)
 * - Étiquette / tag (SelectField : issue, issuewild, iodef, requis)
 * - Cible (TextField, nom d'hôte, requis)
 * - TTL (TtlField)
 */
export function CAARecordForm({
  control,
  watch,
  domainSuffix,
}: CAARecordFormProps) {
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
      <div className="grid grid-cols-[auto_minmax(300px,1fr)_minmax(200px,1fr)] items-start gap-4">
        <NumberField
          name="flags"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_caa_flags")}
          required
          min={0}
          max={255}
          className="w-full"
          tooltip={t("zone_page_tooltip_caa_flags")}
        />
        <SelectField
          name="tag"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_caa_tag")}
          required
          items={[
            { label: t("zone_page_caa_tag_option_issue"), value: "issue" },
            { label: t("zone_page_caa_tag_option_issuewild"), value: "issuewild" },
            { label: t("zone_page_caa_tag_option_iodef"), value: "iodef" },
          ]}
          className="w-full"
          tooltip={t("zone_page_tooltip_caa_tag")}
        />
        <TextField
          name="target"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_caa_target")}
          required
          className="w-full"
          tooltipText={t("zone_page_tooltip_caa_target")}
        />
      </div>
    </div>
  );
}
