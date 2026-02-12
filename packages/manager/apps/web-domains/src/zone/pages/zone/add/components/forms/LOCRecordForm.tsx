import { type Control, type UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Divider,
  DIVIDER_SPACING,
  FormField, Text,
  TEXT_PRESET
} from "@ovhcloud/ods-react";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";
import { SubDomainField } from "../fields/SubDomainField";
import { NumberField } from "../fields/NumberField";
import { SelectField } from "../fields/SelectField";
import { TtlField } from "../fields/TtlField";

export interface LOCRecordFormProps {
  readonly control: Control<AddEntrySchemaType>;
  readonly watch: UseFormWatch<AddEntrySchemaType>;
  readonly domainSuffix: string;
}

const LOC_LATITUDE_ITEMS = [
  { labelKey: "zone_page_add_entry_modal_step_2_label_loc_lat_N", value: "N" },
  { labelKey: "zone_page_add_entry_modal_step_2_label_loc_lat_S", value: "S" },
];

const LOC_LONGITUDE_ITEMS = [
  { labelKey: "zone_page_add_entry_modal_step_2_label_loc_long_E", value: "E" },
  { labelKey: "zone_page_add_entry_modal_step_2_label_loc_long_W", value: "W" },
];

/**
 * Formulaire dédié pour les enregistrements DNS de type LOC.
 *
 * Champs affichés :
 * - Ligne 1 : Sous-domaine + TTL
 * - Ligne 2 : Latitude (degrés + minutes + secondes + direction)
 * - Ligne 3 : Longitude (degrés + minutes + secondes + direction)
 * - Ligne 4 : Altitude
 * - Ligne 5 : Taille + Précision horizontale + Précision verticale
 */
export function LOCRecordForm({
  control,
  watch,
  domainSuffix,
}: LOCRecordFormProps) {
  const { t } = useTranslation("zone");

  const latItems = LOC_LATITUDE_ITEMS.map(({ labelKey, value }) => ({
    label: t(labelKey),
    value,
  }));

  const longItems = LOC_LONGITUDE_ITEMS.map(({ labelKey, value }) => ({
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

      <Divider spacing={DIVIDER_SPACING._12} />

      <div>
        <Text preset={TEXT_PRESET.heading6} className="mb-2">
          {t("zone_page_add_entry_modal_step_2_label_loc_lat")}
        </Text>
        <div className="grid grid-cols-4 gap-4">
          <FormField className="w-full gap-2">
            <NumberField
              name="lat_deg"
              control={control}
              label={t("zone_page_add_entry_modal_step_2_label_loc_lat_deg")}
              required
              min={0}
              max={90}
              step={1}
              tooltip={t("zone_page_tooltip_loc_lat_deg")}
            />
          </FormField>
          <NumberField
            name="lat_min"
            control={control}
            label={t("zone_page_add_entry_modal_step_2_label_loc_lat_min")}
            required
            min={0}
            max={59}
            step={1}
            tooltip={t("zone_page_tooltip_loc_lat_min")}
          />
          <NumberField
            name="lat_sec"
            control={control}
            label={t("zone_page_add_entry_modal_step_2_label_loc_lat_sec")}
            required
            min={0}
            max={59.999}
            step={0.001}
            tooltip={t("zone_page_tooltip_loc_lat_sec")}
          />
          <SelectField
            name="latitude"
            control={control}
            label={t("zone_page_add_entry_modal_step_2_label_loc_lat_direction")}
            required
            items={latItems}
            tooltip={t("zone_page_tooltip_loc_lat_direction")}
          />
        </div>
      </div>

      <Divider spacing={DIVIDER_SPACING._12} />

      <div>
        <Text preset={TEXT_PRESET.heading6} className="mb-2">
          {t("zone_page_add_entry_modal_step_2_label_loc_long")}
        </Text>
        <div className="grid grid-cols-4 gap-4">
          <NumberField
            name="long_deg"
            control={control}
            label={t("zone_page_add_entry_modal_step_2_label_loc_long_deg")}
            required
            min={0}
            max={180}
            step={1}
            tooltip={t("zone_page_tooltip_loc_long_deg")}
          />
          <NumberField
            name="long_min"
            control={control}
            label={t("zone_page_add_entry_modal_step_2_label_loc_long_min")}
            required
            min={0}
            max={59}
            step={1}
            tooltip={t("zone_page_tooltip_loc_long_min")}
          />
          <NumberField
            name="long_sec"
            control={control}
            label={t("zone_page_add_entry_modal_step_2_label_loc_long_sec")}
            required
            min={0}
            max={59.999}
            step={0.001}
            tooltip={t("zone_page_tooltip_loc_long_sec")}
          />
          <SelectField
            name="longitude"
            control={control}
            label={t("zone_page_add_entry_modal_step_2_label_loc_long_direction")}
            required
            items={longItems}
            tooltip={t("zone_page_tooltip_loc_long_direction")}
          />
        </div>
      </div>

      <Divider spacing={DIVIDER_SPACING._12} />

      <Text preset={TEXT_PRESET.heading6} className="mb-2">
        {t("zone_page_add_entry_modal_step_2_label_loc_size_hp_vp")}
      </Text>
      <div className="grid w-full grid-cols-4 gap-4">
        <NumberField
          name="altitude"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_loc_altitude")}
          required
          min={-100000}
          max={42849672.95}
          step={0.01}
          tooltip={t("zone_page_tooltip_loc_altitude")}
          suffix={t("zone_page_add_entry_modal_step_2_label_loc_meters")}
        />
        <NumberField
          name="size"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_loc_size")}
          min={0}
          max={90000000}
          step={0.01}
          tooltip={t("zone_page_tooltip_loc_size")}
          suffix={t("zone_page_add_entry_modal_step_2_label_loc_meters")}
        />
        <NumberField
          name="hp"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_loc_hp")}
          min={0}
          max={90000000}
          step={0.01}
          tooltip={t("zone_page_tooltip_loc_hp")}
          suffix={t("zone_page_add_entry_modal_step_2_label_loc_meters")}
        />
        <NumberField
          name="vp"
          control={control}
          label={t("zone_page_add_entry_modal_step_2_label_loc_vp")}
          min={0}
          max={90000000}
          step={0.01}
          tooltip={t("zone_page_tooltip_loc_vp")}
          suffix={t("zone_page_add_entry_modal_step_2_label_loc_meters")}
        />
      </div>
    </div>
  );
}
