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
import { Controller, type Control, type UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";

export interface TtlFieldProps {
  readonly control: Control<AddEntrySchemaType>;
  readonly watch: UseFormWatch<AddEntrySchemaType>;
  readonly className?: string;
  readonly tooltip?: string;
}

export function TtlField({ control, watch, className, tooltip }: TtlFieldProps) {
  const { t } = useTranslation(["zone", NAMESPACES.FORM]);
  return (
    <FormField className={`${(className ?? "").trim()} w-full`}>
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
      <div className="grid w-full grid-cols-2 items-start gap-2">
        <Controller
          name="ttlSelect"
          control={control}
          render={({ field: ttlSelectField }) => (
            <Select
              name={ttlSelectField.name}
              className="w-full"
              value={ttlSelectField.value == null ? ["global"] : [ttlSelectField.value as string]}
              onValueChange={({ value }) => ttlSelectField.onChange(value[0] ?? "global")}
              onBlur={() => ttlSelectField.onBlur?.()}
              items={[
                { label: t("zone_page_form_ttl_global"), value: "global" },
                { label: t("zone_page_form_ttl_custom"), value: "custom" },
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
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Input
                    type={INPUT_TYPE.number}
                    className="w-full"
                    name={ttlField.name}
                    value={
                      ttlField.value !== undefined && ttlField.value !== ""
                        ? ttlField.value as string
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
