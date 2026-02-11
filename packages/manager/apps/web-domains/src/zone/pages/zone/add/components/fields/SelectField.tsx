import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  Select,
  SelectContent,
  SelectControl,
} from "@ovhcloud/ods-react";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { Controller, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";

export interface SelectFieldProps {
  readonly name: keyof AddEntrySchemaType;
  readonly control: Control<AddEntrySchemaType>;
  readonly label: string;
  readonly required?: boolean;
  readonly items: { label: string; value: string }[];
  readonly placeholder?: string;
  readonly className?: string;
}

export function SelectField({
  name,
  control,
  label,
  required = false,
  items,
  placeholder,
  className = "w-1/2",
}: SelectFieldProps) {
  const { t } = useTranslation([NAMESPACES.ACTIONS, NAMESPACES.FORM]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <FormField className={className} invalid={!!error && invalid}>
          <FormFieldLabel>
            {label}
            {required && <span className="text-xs"> - {t(NAMESPACES.FORM + ":required_field")}</span>}
          </FormFieldLabel>
          <Select
            name={field.name}
            className="w-full"
            value={field.value == null ? [] : [field.value as string]}
            onValueChange={({ value }) => field.onChange(value[0] ?? "")}
            onBlur={() => field.onBlur?.()}
            items={items}
          >
            <SelectControl
              placeholder={placeholder ?? t(`${NAMESPACES.ACTIONS}:select_imperative`)}
            />
            <SelectContent />
          </Select>
          <FormFieldError>{error?.message}</FormFieldError>
        </FormField>
      )}
    />
  );
}
