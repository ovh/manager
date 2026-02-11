import {
  Text,
  TEXT_PRESET,
} from "@ovhcloud/ods-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";
import { BooleanRadioField } from "../../components/fields/BooleanRadioField";
import { TextareaField } from "../../components/fields/TextareaField";
import { TextField } from "../../components/fields/TextField";
import { RadioField } from "../../components/fields/RadioField";

const SPF_ALL_OPTIONS = [
  { value: "-all", label: "zone_page_add_entry_modal_spf_all_title_yes" },
  { value: "~all", label: "zone_page_add_entry_modal_spf_all_title_safe" },
  { value: "?all", label: "zone_page_add_entry_modal_spf_all_title_no" },
];

export function SpfFormContent() {
  const { t } = useTranslation("zone");
  const { serviceName } = useParams<{ serviceName: string }>();
  const { control } = useFormContext<AddEntrySchemaType>();

  const allOptions = SPF_ALL_OPTIONS.map(({ value, label }) => ({
    value,
    label: t(label),
  }));

  return (
    <div className="mt-4 w-full" data-testid="spf-form">
      <BooleanRadioField
        name="aSender"
        control={control}
        label={t("zone_page_add_entry_modal_spf_senders_ip_title", { serviceName })}
        className="mb-4"
      />

      <BooleanRadioField
        name="mxSender"
        control={control}
        label={t("zone_page_add_entry_modal_spf_senders_mx_title", { serviceName })}
        className="mb-4"
      />

      <BooleanRadioField
        name="ptrSender"
        control={control}
        label={t("zone_page_add_entry_modal_spf_senders_all_title", { serviceName })}
        className="mb-4"
      />

      <div className="mb-4">
        <Text preset={TEXT_PRESET.paragraph} className="mb-3">
          {t("zone_page_add_entry_modal_spf_other_title", { serviceName })}
        </Text>

        <TextareaField name="a" control={control} label="a:" className="mb-3 w-1/2" />
        <TextareaField name="mx" control={control} label="mx:" className="mb-3 w-1/2" />
        <TextareaField name="ptr" control={control} label="ptr:" className="mb-3 w-1/2" />
        <TextareaField name="ip4" control={control} label="ip4:" className="mb-3 w-1/2" />
        <TextareaField name="ip6" control={control} label="ip6:" className="mb-3 w-1/2" />
      </div>

      <div className="mb-4">
        <Text preset={TEXT_PRESET.paragraph} className="mb-3">
          {t("zone_page_add_entry_modal_spf_other_ds_title", { serviceName })}
        </Text>
        <TextField
          name="include"
          control={control}
          label="include:"
          maxLength={255}
          className="w-1/2"
        />
      </div>

      <RadioField
        name="all"
        control={control}
        label={t("zone_page_add_entry_modal_spf_all_title", { serviceName })}
        options={allOptions}
        direction="column"
        className="mb-4"
      />
    </div>
  );
}
