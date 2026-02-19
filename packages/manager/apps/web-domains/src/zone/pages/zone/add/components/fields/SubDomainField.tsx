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
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { Controller, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";

export interface SubDomainFieldProps {
  control: Control<AddEntrySchemaType>;
  domainSuffix?: string;
  className?: string;
  required?: boolean;
  tooltip?: string;
  placeholder?: string;
  labelKey?: string;
}

export function SubDomainField({
  control,
  domainSuffix = "",
  className,
  required = true,
  tooltip,
  placeholder,
  labelKey,
}: SubDomainFieldProps) {
  const { t } = useTranslation(["zone", NAMESPACES.FORM]);
  return (
    <Controller
      name="subDomain"
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <FormField className={className ?? "w-full"} invalid={!!error && invalid}>
          <FormFieldLabel>
            {t(labelKey ?? "zone_page_form_subdomain")}
            {required && <span className="text-xs"> - {t(NAMESPACES.FORM + ":required_field")}</span>}
            {tooltip && (
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
            className="w-full bg-white"
            name={field.name}
            value={String(field.value ?? "")}
            onBlur={field.onBlur}
            onChange={(e) => field.onChange(e.target?.value)}
            invalid={!!error}
            placeholder={placeholder}
          />
          <FormFieldError>{error?.message}</FormFieldError>
        </FormField>
      )}
    />
  );
}
