import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  Input,
  INPUT_TYPE,
  Select,
  SelectContent,
  SelectControl,
  Text,
  TEXT_PRESET,
} from "@ovhcloud/ods-react";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { Controller, type Control, type UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";

export interface TtlFieldProps {
  control: Control<AddEntrySchemaType>;
  watch: UseFormWatch<AddEntrySchemaType>;
  className?: string;
}

export function TtlField({ control, watch, className }: TtlFieldProps) {
  const { t } = useTranslation(["zone", NAMESPACES.FORM]);
  const ttlSelectValue = watch("ttlSelect");
  const isExtended = ttlSelectValue === "custom";
  const widthClass = isExtended ? "w-full" : "w-1/2";
  return (
    <FormField className={`${(className ?? "").trim()} ${widthClass}`.trim()}>
      <FormFieldLabel>{t("zone_page_add_entry_modal_step_1_ttl")}</FormFieldLabel>
      <div className="flex w-full flex-wrap items-center gap-2">
        <Controller
          name="ttlSelect"
          control={control}
          render={({ field: ttlSelectField }) => (
            <Select
              name={ttlSelectField.name}
              className="w-full"
              value={ttlSelectField.value == null ? ["global"] : [String(ttlSelectField.value)]}
              onValueChange={({ value }) => ttlSelectField.onChange(value[0] ?? "global")}
              onBlur={() => ttlSelectField.onBlur?.()}
              items={[
                { label: t("zone_page_add_entry_modal_step_1_ttl_global"), value: "global" },
                { label: t("zone_page_add_entry_modal_step_1_ttl_custom"), value: "custom" },
              ]}
            >
              <SelectControl placeholder={t(`${NAMESPACES.FORM}:select_placeholder`)} />
              <SelectContent />
            </Select>
          )}
        />
        <Controller
          name="ttl"
          control={control}
          render={({ field: ttlField, fieldState: { error: ttlError } }) => {
            const ttlSelectValue = watch("ttlSelect");
            if (ttlSelectValue !== "custom") return null;
            return (
              <div className="flex flex-col gap-1 min-w-[6rem]">
                <div className="flex items-center gap-2">
                  <Input
                    type={INPUT_TYPE.number}
                    className="w-24"
                    name={ttlField.name}
                    value={
                      ttlField.value !== undefined && ttlField.value !== ""
                        ? String(ttlField.value)
                        : ""
                    }
                    onChange={(e) =>
                      ttlField.onChange(
                        e.target?.value === "" ? undefined : Number(e.target?.value),
                      )
                    }
                    onBlur={ttlField.onBlur}
                    min='60'
                    step={1}
                    invalid={!!ttlError}
                  />
                  <Text preset={TEXT_PRESET.span}>s.</Text>
                </div>
                {ttlError?.message && <FormFieldError>{ttlError.message}</FormFieldError>}
              </div>
            );
          }}
        />
      </div>
    </FormField>
  );
}
