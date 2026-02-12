import { type Control, type UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";
import { SubDomainField } from "../fields/SubDomainField";
import { TextareaField } from "../fields/TextareaField";
import { TtlField } from "../fields/TtlField";

export interface TXTRecordFormProps {
  readonly control: Control<AddEntrySchemaType>;
  readonly watch: UseFormWatch<AddEntrySchemaType>;
  readonly domainSuffix: string;
}

/**
 * Formulaire dédié pour les enregistrements DNS de type TXT.
 *
 * Champs affichés :
 * - Sous-domaine (SubDomainField) + TTL (TtlField)
 * - Valeur (TextareaField, requis)
 */
export function TXTRecordForm({
  control,
  watch,
  domainSuffix,
}: TXTRecordFormProps) {
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
      <TextareaField
        name="target"
        control={control}
        label={t("zone_page_add_entry_modal_step_2_label_value")}
        required
        className="w-full"
        tooltip={t("zone_page_tooltip_txt_value")}
      />
    </div>
  );
}
