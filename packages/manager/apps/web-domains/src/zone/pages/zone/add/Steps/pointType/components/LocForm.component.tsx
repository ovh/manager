import {
  FormField,
  FormFieldLabel,
  Text,
  TEXT_PRESET,
} from "@ovhcloud/ods-react";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";
import { NumberField } from "../../../components/fields/NumberField";
import { SelectField } from "../../../components/fields/SelectField";

const LOC_LATITUDE_ITEMS = [
  { labelKey: "zone_page_add_entry_modal_step_2_label_loc_lat_N", value: "N" },
  { labelKey: "zone_page_add_entry_modal_step_2_label_loc_lat_S", value: "S" },
];
const LOC_LONGITUDE_ITEMS = [
  { labelKey: "zone_page_add_entry_modal_step_2_label_loc_long_E", value: "E" },
  { labelKey: "zone_page_add_entry_modal_step_2_label_loc_long_W", value: "W" },
];

const LOC_METERS_FIELDS = [
  {
    name: "altitude",
    labelKey: "zone_page_add_entry_modal_step_2_label_loc_altitude",
    min: -100000,
    max: 42849672.95,
    step: 0.01,
    required: true,
  },
  {
    name: "size",
    labelKey: "zone_page_add_entry_modal_step_2_label_loc_size",
    min: 0,
    max: 90000000,
    step: 0.01,
    required: false,
  },
  {
    name: "hp",
    labelKey: "zone_page_add_entry_modal_step_2_label_loc_hp",
    min: 0,
    max: 90000000,
    step: 0.01,
    required: false,
  },
  {
    name: "vp",
    labelKey: "zone_page_add_entry_modal_step_2_label_loc_vp",
    min: 0,
    max: 90000000,
    step: 0.01,
    required: false,
  },
] as const;

function LocMetersCell({
  name,
  labelKey,
  min,
  max,
  step,
  required,
  control,
}: (typeof LOC_METERS_FIELDS)[number] & { control: ReturnType<typeof useFormContext<AddEntrySchemaType>>["control"] }) {
  const { t } = useTranslation("zone");
  return (
    <>
      <FormField className="w-1/2">
        <NumberField
          name={name}
          control={control}
          label={t(labelKey)}
          required={required}
          min={min}
          max={max}
          step={step}
        />
      </FormField>
      <Text preset={TEXT_PRESET.span} className="pb-2">
        {t("zone_page_add_entry_modal_step_2_label_loc_meters")}
      </Text>
    </>
  );
}

export function LocFormContent() {
  const { t } = useTranslation(["zone", NAMESPACES.FORM, NAMESPACES.ACTIONS]);
  const { control } = useFormContext<AddEntrySchemaType>();

  const latItems = LOC_LATITUDE_ITEMS.map(({ labelKey, value }) => ({
    label: t(labelKey),
    value,
  }));
  const longItems = LOC_LONGITUDE_ITEMS.map(({ labelKey, value }) => ({
    label: t(labelKey),
    value,
  }));

  return (
    <div className="mt-4 w-full space-y-4" data-testid="loc-form">
      <FormField className="w-full gap-4">
        <FormFieldLabel slot="label">
          {t("zone_page_add_entry_modal_step_2_label_loc_lat")}
        </FormFieldLabel>
        <div className="grid grid-cols-2 gap-4">
          <NumberField name="lat_deg" control={control} label={t("zone_page_add_entry_modal_step_2_label_loc_lat_deg")} required min={0} max={90} step={1} />
          <NumberField name="lat_min" control={control} label={t("zone_page_add_entry_modal_step_2_label_loc_lat_min")} required min={0} max={59} step={1} />
          <NumberField name="lat_sec" control={control} label={t("zone_page_add_entry_modal_step_2_label_loc_lat_sec")} required min={0} max={59.999} step={0.001} />
          <SelectField
            name="latitude"
            control={control}
            label={t("zone_page_add_entry_modal_step_2_label_loc_lat_direction")}
            required
            items={latItems}
          />
        </div>
      </FormField>

      <FormField className="w-full gap-4">
        <FormFieldLabel slot="label">
          {t("zone_page_add_entry_modal_step_2_label_loc_long")}
        </FormFieldLabel>
        <div className="grid grid-cols-2 gap-4">
          <NumberField name="long_deg" control={control} label={t("zone_page_add_entry_modal_step_2_label_loc_long_deg")} required min={0} max={180} step={1} />
          <NumberField name="long_min" control={control} label={t("zone_page_add_entry_modal_step_2_label_loc_long_min")} required min={0} max={59} step={1} />
          <NumberField name="long_sec" control={control} label={t("zone_page_add_entry_modal_step_2_label_loc_long_sec")} required min={0} max={59.999} step={0.001} />
          <SelectField
            name="longitude"
            control={control}
            label={t("zone_page_add_entry_modal_step_2_label_loc_long_direction")}
            required
            items={longItems}
          />
        </div>
      </FormField>

      {LOC_METERS_FIELDS.slice(0, 1).map((field) => (
        <div key={field.name} className="flex w-1/2 flex-wrap items-end gap-2">
          <LocMetersCell {...field} control={control} />
        </div>
      ))}

      <Text preset={TEXT_PRESET.paragraph} className="font-medium">
        {t("zone_page_add_entry_modal_step_2_label_loc_size_hp_vp")}
      </Text>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
        {LOC_METERS_FIELDS.slice(1).map((field) => (
          <div key={field.name} className="flex flex-wrap items-end gap-2">
            <LocMetersCell {...field} control={control} />
          </div>
        ))}
      </div>
    </div>
  );
}
