import {
  FormField,
  FormFieldLabel,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  Text,
  TEXT_PRESET,
} from "@ovhcloud/ods-react";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { Controller, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";

export interface BooleanRadioFieldProps {
  name: keyof AddEntrySchemaType;
  control: Control<AddEntrySchemaType>;
  label: string;
  className?: string;
}

export function BooleanRadioField({
  name,
  control,
  label,
  className = "mb-4",
}: BooleanRadioFieldProps) {
  const { t } = useTranslation([NAMESPACES.FORM]);

  return (
    <FormField className={className}>
      <FormFieldLabel>{label}</FormFieldLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value?.toString() ?? ""}
            onValueChange={(detail) => {
              field.onChange(detail.value === "true");
            }}
          >
            <div className="flex flex-row gap-4 mt-2">
              <Radio value="true">
                <RadioControl />
                <RadioLabel className="ml-2">
                  <Text preset={TEXT_PRESET.span}>
                    {t(`${NAMESPACES.FORM}:yes`)}
                  </Text>
                </RadioLabel>
              </Radio>
              <Radio value="false">
                <RadioControl />
                <RadioLabel className="ml-2">
                  <Text preset={TEXT_PRESET.span}>
                    {t(`${NAMESPACES.FORM}:no`)}
                  </Text>
                </RadioLabel>
              </Radio>
            </div>
          </RadioGroup>
        )}
      />
    </FormField>
  );
}
