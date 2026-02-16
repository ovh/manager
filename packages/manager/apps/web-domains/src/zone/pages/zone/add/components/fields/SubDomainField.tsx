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
}

export function SubDomainField({
  control,
  domainSuffix = "",
  className,
  required = true,
  tooltip,
  placeholder,
}: SubDomainFieldProps) {
  const { t } = useTranslation(["zone", NAMESPACES.FORM]);
  return (
    <Controller
      name="subDomain"
      control={control}
      render={({ field, fieldState: { error, invalid } }) => (
        <FormField className={className ?? "w-full"} invalid={!!error && invalid}>
          <FormFieldLabel>
            {t("zone_page_form_subdomain")}
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
          <div className="flex w-full gap-2">
            <Input
              type={INPUT_TYPE.text}
              className="flex-1 min-w-0"
              name={field.name}
              value={String(field.value ?? "")}
              onBlur={field.onBlur}
              onChange={(e) => field.onChange(e.target?.value)}
              invalid={!!error}
              placeholder={placeholder}
            />
            <Input type={INPUT_TYPE.text} value={domainSuffix} readOnly disabled className="flex-1 min-w-0" />
          </div>
          <FormFieldError>{error?.message}</FormFieldError>
        </FormField>
      )}
    />
  );
}
