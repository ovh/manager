import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  Quantity,
  QuantityControl,
  QuantityInput,
  Select,
  SelectContent,
  SelectControl,
  Text,
  TEXT_PRESET,
} from "@ovhcloud/ods-react";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";

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

export function LocFormContent() {
  const { t } = useTranslation(["zone", NAMESPACES.FORM, NAMESPACES.ACTIONS]);
  const { control } = useFormContext<AddEntrySchemaType>();

  const numField = (
    name: keyof AddEntrySchemaType,
    labelKey: string,
    min: number,
    max: number,
    step: number,
    required: boolean,
    inline?: boolean,
    suffix?: string,
  ) => (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => {
        const numValue =
          field.value !== undefined && field.value !== "" ? String(field.value) : undefined;
        const inputControl = (
          <Quantity
            className="w-fit min-w-0"
            name={field.name}
            value={numValue}
            onValueChange={({ valueAsNumber }) =>
              field.onChange(Number.isNaN(valueAsNumber) ? undefined : valueAsNumber)
            }
            min={min}
            max={max}
            step={step}
            invalid={!!error}
          >
            <QuantityControl className="!w-auto min-w-[7rem] max-w-[10rem]">
              <QuantityInput ref={field.ref} onBlur={field.onBlur} />
            </QuantityControl>
          </Quantity>
        );
        return (
          <FormField className={inline ? "w-auto shrink-0" : "w-full"} invalid={!!error && invalid}>
            <FormFieldLabel>
              {t(labelKey)}
              {required ? " *" : ""}
            </FormFieldLabel>
            {suffix ? (
              <div className="flex flex-row items-center gap-2">
                {inputControl}
                <Text preset={TEXT_PRESET.span} className="pb-0.5">
                  {suffix}
                </Text>
              </div>
            ) : (
              inputControl
            )}
            <FormFieldError>{error?.message}</FormFieldError>
          </FormField>
        );
      }}
    />
  );

  const locMetersCell = (field: (typeof LOC_METERS_FIELDS)[number]) =>
    numField(
      field.name,
      field.labelKey,
      field.min,
      field.max,
      field.step,
      field.required,
      false,
      t("zone_page_add_entry_modal_step_2_label_loc_meters"),
    );

  return (
    <div className="mt-4 w-full space-y-4" data-testid="loc-form">
      <FormField className="w-full gap-4">
        <FormFieldLabel slot="label">
          {t("zone_page_add_entry_modal_step_2_label_loc_lat")}
        </FormFieldLabel>
        <div className="flex flex-row flex-wrap items-start gap-4">
          {numField("lat_deg", "zone_page_add_entry_modal_step_2_label_loc_lat_deg", 0, 90, 1, true, true)}
          {numField("lat_min", "zone_page_add_entry_modal_step_2_label_loc_lat_min", 0, 59, 1, true, true)}
          {numField("lat_sec", "zone_page_add_entry_modal_step_2_label_loc_lat_sec", 0, 59.999, 0.001, true, true)}
          <Controller
            name="latitude"
            control={control}
            render={({ field, fieldState: { error, invalid } }) => (
              <FormField className="w-auto shrink-0 min-w-[6rem]" invalid={!!error && invalid}>
                <FormFieldLabel>
                  {t("zone_page_add_entry_modal_step_2_label_loc_lat_direction")} *
                </FormFieldLabel>
                <Select
                  name={field.name}
                  className="w-full"
                  value={field.value != null ? [String(field.value)] : []}
                  onValueChange={({ value }) => field.onChange(value[0] ?? "")}
                  onBlur={() => field.onBlur?.()}
                  items={LOC_LATITUDE_ITEMS.map(({ labelKey: k, value }) => ({
                    label: t(k),
                    value,
                  }))}
                >
                  <SelectControl placeholder={t(`${NAMESPACES.ACTIONS}:select_imperative`)} />
                  <SelectContent />
                </Select>
                <FormFieldError>{error?.message}</FormFieldError>
              </FormField>
            )}
          />
        </div>
      </FormField>

      <FormField className="w-full gap-4">
        <FormFieldLabel slot="label">
          {t("zone_page_add_entry_modal_step_2_label_loc_long")}
        </FormFieldLabel>
        <div className="flex flex-row flex-wrap items-start gap-4">
          {numField("long_deg", "zone_page_add_entry_modal_step_2_label_loc_long_deg", 0, 180, 1, true, true)}
          {numField("long_min", "zone_page_add_entry_modal_step_2_label_loc_long_min", 0, 59, 1, true, true)}
          {numField("long_sec", "zone_page_add_entry_modal_step_2_label_loc_long_sec", 0, 59.999, 0.001, true, true)}
          <Controller
            name="longitude"
            control={control}
            render={({ field, fieldState: { error, invalid } }) => (
              <FormField className="w-auto shrink-0 min-w-[6rem]" invalid={!!error && invalid}>
                <FormFieldLabel>
                  {t("zone_page_add_entry_modal_step_2_label_loc_long_direction")} *
                </FormFieldLabel>
                <Select
                  name={field.name}
                  className="w-full"
                  value={field.value != null ? [String(field.value)] : []}
                  onValueChange={({ value }) => field.onChange(value[0] ?? "")}
                  onBlur={() => field.onBlur?.()}
                  items={LOC_LONGITUDE_ITEMS.map(({ labelKey: k, value }) => ({
                    label: t(k),
                    value,
                  }))}
                >
                  <SelectControl placeholder={t(`${NAMESPACES.ACTIONS}:select_imperative`)} />
                  <SelectContent />
                </Select>
                <FormFieldError>{error?.message}</FormFieldError>
              </FormField>
            )}
          />
        </div>
      </FormField>

      {LOC_METERS_FIELDS.slice(0, 1).map((field) => (
        <div key={field.name} className="flex w-1/2 flex-wrap items-end gap-2">
          {locMetersCell(field)}
        </div>
      ))}

      <Text preset={TEXT_PRESET.paragraph} className="font-medium">
        {t("zone_page_add_entry_modal_step_2_label_loc_size_hp_vp")}
      </Text>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
        {LOC_METERS_FIELDS.slice(1).map((field) => (
          <div key={field.name} className="flex flex-wrap items-end gap-2">
            {locMetersCell(field)}
          </div>
        ))}
      </div>
    </div>
  );
}
