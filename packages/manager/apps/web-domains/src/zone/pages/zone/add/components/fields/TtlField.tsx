import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  Icon,
  ICON_NAME,
  Input,
  INPUT_TYPE,
  Select,
  SelectContent,
  SelectControl,
  Text,
  TEXT_PRESET,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ovhcloud/ods-react";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { Controller, type Control, type UseFormWatch, useFormState } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";
import { TtlSelectEnum } from "@/common/enum/zone.enum";

export interface TtlFieldProps {
  readonly control: Control<AddEntrySchemaType>;
  readonly watch: UseFormWatch<AddEntrySchemaType>;
  readonly className?: string;
  readonly tooltip?: string;
}

export function TtlField({ control, watch, className, tooltip }: TtlFieldProps) {
  const { t } = useTranslation(["zone", NAMESPACES.FORM]);
  const { errors } = useFormState({ control });
  const ttlError = errors.ttl;
  const ttlSelectValue = watch("ttlSelect");

  return (
    <FormField className={`${(className ?? "").trim()} w-full`} invalid={!!ttlError && ttlSelectValue === TtlSelectEnum.CUSTOM}>
      <FormFieldLabel>
        {t("zone_page_form_ttl")}
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
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <div className="w-full md:flex-1">
          <Controller
            name="ttlSelect"
            control={control}
            render={({ field: ttlSelectField }) => (
              <Select
                name={ttlSelectField.name}
                className="w-full"
                value={ttlSelectField.value == null ? [TtlSelectEnum.GLOBAL] : [ttlSelectField.value as string]}
                onValueChange={({ value }) => ttlSelectField.onChange(value[0] ?? TtlSelectEnum.GLOBAL)}
                onBlur={() => ttlSelectField.onBlur?.()}
                items={[
                  { label: t("zone_page_form_ttl_global"), value: TtlSelectEnum.GLOBAL },
                  { label: t("zone_page_form_ttl_custom"), value: TtlSelectEnum.CUSTOM },
                ]}
              >
                <SelectControl placeholder={t(`${NAMESPACES.FORM}:select_placeholder`)} />
                <SelectContent />
              </Select>
            )}
          />
        </div>
        <div className="w-full md:flex-1">
          <Controller
            name="ttl"
            control={control}
            render={({ field: ttlField }) => {
              if (ttlSelectValue !== TtlSelectEnum.CUSTOM) return <></>;
              return (
                <div className="relative">
                  <Input
                    type={INPUT_TYPE.number}
                    className="w-full pr-[6rem] bg-white"
                    name={ttlField.name}
                    value={typeof ttlField.value === "number" || typeof ttlField.value === "string" ? String(ttlField.value) : ""}
                    onChange={(e) => ttlField.onChange(e.target?.value ?? "")}
                    onBlur={ttlField.onBlur}
                    invalid={!!ttlError}
                  />
                  <span className="absolute right-0 top-0 h-full flex items-center px-3 text-[--ods-color-neutral-600] text-sm pointer-events-none">
                    {t('zone_page_form_label_seconds')}
                  </span>
                </div>
              );
            }}
          />
        </div>
      </div>
      <FormFieldError>{ttlError?.message}</FormFieldError>
    </FormField>
  );
}
