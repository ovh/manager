import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  Icon,
  ICON_NAME,
  Text,
  TEXT_PRESET,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ovhcloud/ods-react";
import { Controller, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";

export interface TextareaFieldProps {
  readonly name: keyof AddEntrySchemaType;
  readonly control: Control<AddEntrySchemaType>;
  readonly label: string;
  readonly required?: boolean;
  readonly className?: string;
  readonly tooltip?: string;
  readonly placeholder?: string;
}

export function TextareaField({
  name,
  control,
  label,
  required = false,
  className = "w-1/2",
  tooltip,
  placeholder,
}: Readonly<TextareaFieldProps>) {
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
          <Textarea
            className="min-h-24 w-full"
            name={field.name}
            value={
              typeof field.value === "string" ||
                typeof field.value === "number" ||
                Array.isArray(field.value)
                ? field.value
                : ""
            }
            onChange={(event) => field.onChange(event.target?.value)}
            onBlur={field.onBlur}
            ref={field.ref}
            invalid={!!error}
            placeholder={placeholder}
          />
          <FormFieldError>
            {typeof error?.message === "string" ? error.message : ""}
          </FormFieldError>
        </FormField>
      )}
    />
  );
}
