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
import { Controller, type Control } from "react-hook-form";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioFieldProps {
  name: keyof AddEntrySchemaType;
  control: Control<AddEntrySchemaType>;
  label: string;
  options: RadioOption[];
  direction?: "row" | "column";
  className?: string;
}

export function RadioField({
  name,
  control,
  label,
  options,
  direction = "column",
  className = "mb-4",
}: RadioFieldProps) {
  return (
    <FormField className={className}>
      <FormFieldLabel>{label}</FormFieldLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={typeof field.value === "string" ? field.value : ""}
            onValueChange={(detail: { value: string }) => {
              field.onChange(detail.value);
            }}
            className={`flex ${direction === "row" ? "flex-row" : "flex-col"} gap-2 mt-2`}
          >
            {options.map((option) => (
              <Radio key={option.value} value={option.value}>
                <RadioControl />
                <RadioLabel className="ml-2">
                  <Text preset={TEXT_PRESET.span}>{option.label}</Text>
                </RadioLabel>
              </Radio>
            ))}
          </RadioGroup>
        )}
      />
    </FormField>
  );
}
