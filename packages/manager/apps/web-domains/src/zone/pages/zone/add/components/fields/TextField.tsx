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

export interface TextFieldProps {
  name: keyof AddEntrySchemaType;
  control: Control<AddEntrySchemaType>;
  label: string;
  required?: boolean;
  tooltipKey?: string;
  tooltipText?: string;
  maxLength?: number;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
}

export function TextField({
  name,
  control,
  label,
  required = false,
  tooltipKey,
  tooltipText,
  maxLength,
  className,
  inputClassName = "flex-1",
  disabled = false,
  readOnly = false,
  placeholder,
}: Readonly<TextFieldProps>) {
  const { t } = useTranslation([NAMESPACES.FORM]);
  const tooltip = tooltipKey ?? tooltipText;
  const resolvedInputClassName = readOnly ? `${inputClassName} border-[--ods-color-neutral-200]` : `${inputClassName} bg-white`;

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
          <Input
            type={INPUT_TYPE.text}
            className={resolvedInputClassName}
            name={field.name}
            value={typeof field.value === "string" || typeof field.value === "number" ? String(field.value) : ""}
            onChange={(e) => field.onChange(e.target?.value)}
            onBlur={field.onBlur}
            ref={field.ref}
            maxLength={maxLength}
            invalid={!!error}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
          />
          <FormFieldError>{error?.message}</FormFieldError>
        </FormField>
      )}
    />
  );
}
