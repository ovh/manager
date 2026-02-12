import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  Icon,
  ICON_NAME,
  Input,
  INPUT_TYPE,
  Text,
  TEXT_PRESET,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ovhcloud/ods-react";
import { Controller, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";

export interface NumberFieldProps {
  name: keyof AddEntrySchemaType;
  control: Control<AddEntrySchemaType>;
  label: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number | string;
  className?: string;
  disabled?: boolean;
  tooltip?: string;
  /** Unité affichée à droite de l'input (ex : "m", "s") */
  suffix?: string;
}

export function NumberField({
  name,
  control,
  label,
  required = false,
  min,
  max,
  step,
  className,
  disabled = false,
  tooltip,
  suffix,
}: Readonly<NumberFieldProps>) {
  const { t } = useTranslation([NAMESPACES.FORM]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <FormField className={className} invalid={!!error && invalid}>
          <FormFieldLabel>
            {label}
            {required && <span className="text-xs"> - {t(NAMESPACES.FORM + ":required_field")}</span>}
            {tooltip != null && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Icon name={ICON_NAME.circleQuestion} className="text-[--ods-color-primary-500] ml-1" />
                </TooltipTrigger>
                <TooltipContent>
                  <Text preset={TEXT_PRESET.paragraph}>{tooltip}</Text>
                </TooltipContent>
              </Tooltip>
            )}
          </FormFieldLabel>
          <div className={suffix ? "relative" : undefined}>
            <Input
              type={INPUT_TYPE.number}
              className="w-full"
              style={suffix ? { paddingRight: "3.5rem" } : undefined}
              name={field.name}
              value={typeof field.value === "number" || typeof field.value === "string" ? String(field.value) : ""}
              onChange={(e) =>
                field.onChange(
                  e.target?.value === "" ? undefined : Number(e.target?.value),
                )
              }
              onBlur={field.onBlur}
              ref={field.ref}
              min={min}
              max={max}
              step={step}
              invalid={!!error}
              disabled={disabled}
            />
            {suffix && (
              <Text preset={TEXT_PRESET.span} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">{suffix}</Text>
            )}
          </div>
          <FormFieldError>{error?.message}</FormFieldError>
        </FormField>
      )}
    />
  );
}
