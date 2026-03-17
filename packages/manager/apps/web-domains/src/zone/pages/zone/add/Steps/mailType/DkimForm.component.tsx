import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  FormField,
  FormFieldError,
  FormFieldLabel,
  Input,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  Text,
  TEXT_PRESET,
  Textarea,
} from "@ovhcloud/ods-react";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";

export function DkimFormContent() {
  const { t } = useTranslation(["zone", NAMESPACES.FORM]);
  const { control, watch, setValue } = useFormContext<AddEntrySchemaType>();
  const dkimPRevoke = watch("dkimPRevoke");

  return (
    <div className="mt-4 w-full space-y-4" data-testid="dkim-form">
      <FormField className="mb-4">
        <Controller
          name="dkimV"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value === true || field.value === "true"}
              onCheckedChange={(detail) => field.onChange(detail.checked)}
            >
              <CheckboxControl />
              <CheckboxLabel>
                <Text preset={TEXT_PRESET.span}>
                  {t("zone_page_add_entry_modal_step_2_dkim_label_version")}
                </Text>
              </CheckboxLabel>
            </Checkbox>
          )}
        />
      </FormField>

      <FormField className="mb-4 w-1/2">
        <FormFieldLabel>
          {t("zone_page_add_entry_modal_step_2_dkim_label_granularity")}
        </FormFieldLabel>
        <Controller
          name="dkimG"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <Input
                type="text"
                className="w-full"
                maxLength={255}
                value={String(field.value ?? "")}
                onChange={(e) => field.onChange(e.target?.value ?? "")}
                onBlur={field.onBlur}
                invalid={!!error}
              />
              <FormFieldError>{error?.message}</FormFieldError>
            </>
          )}
        />
      </FormField>

      <FormField className="mb-4">
        <FormFieldLabel>
          {t("zone_page_add_entry_modal_step_2_dkim_label_algorithm_hash")}
        </FormFieldLabel>
        <div className="flex flex-row gap-6 mt-2">
          <Controller
            name="dkimHsha1"
            control={control}
            render={({ field }) => (
              <Checkbox
                name={field.name}
                id="dkim-h-sha1"
                checked={field.value === true || field.value === "true"}
                onCheckedChange={(detail) => field.onChange(detail.checked)}
              >
                <CheckboxControl />
                <CheckboxLabel>
                  <Text preset={TEXT_PRESET.span}>{t("zone_page_add_entry_modal_step_2_dkim_hash_1")}</Text>
                </CheckboxLabel>
              </Checkbox>
            )}
          />
          <Controller
            name="dkimHsha256"
            control={control}
            render={({ field }) => (
              <Checkbox
                name={field.name}
                id="dkim-h-sha256"
                checked={field.value === true || field.value === "true"}
                onCheckedChange={(detail) => field.onChange(detail.checked)}
              >
                <CheckboxControl />
                <CheckboxLabel>
                  <Text preset={TEXT_PRESET.span}>{t("zone_page_add_entry_modal_step_2_dkim_hash_256")}</Text>
                </CheckboxLabel>
              </Checkbox>
            )}
          />
        </div>
      </FormField>

      <FormField className="mb-4">
        <div className="flex flex-row items-center gap-2">
          <FormFieldLabel className="mb-0 shrink-0">
            {t("zone_page_add_entry_modal_step_2_dkim_label_algorithm_key")}
          </FormFieldLabel>
          <Controller
            name="dkimKrsa"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value === true || field.value === "true"}
                onCheckedChange={(detail) => field.onChange(detail.checked)}
                aria-label={t("zone_page_add_entry_modal_step_2_dkim_label_algorithm_key")}
              >
                <CheckboxControl />
              </Checkbox>
            )}
          />
        </div>
      </FormField>

      <FormField className="mb-4 w-1/2">
        <FormFieldLabel>
          {t("zone_page_add_entry_modal_step_2_dkim_label_notes")}
        </FormFieldLabel>
        <Controller
          name="dkimN"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <Input
                type="text"
                className="w-full"
                maxLength={255}
                value={String(field.value ?? "")}
                onChange={(e) => field.onChange(e.target?.value ?? "")}
                onBlur={field.onBlur}
                invalid={!!error}
              />
              <FormFieldError>{error?.message}</FormFieldError>
            </>
          )}
        />
      </FormField>

      <FormField className="mb-4 w-full">
        <FormFieldLabel>
          {t("zone_page_add_entry_modal_step_2_dkim_label_publickey")} *
        </FormFieldLabel>
        <Controller
          name="dkimPublicKey"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <Textarea
                className="w-1/2 min-h-24 resize-y"
                value={String(field.value ?? "")}
                onChange={(e) => field.onChange(e.target?.value ?? "")}
                onBlur={field.onBlur}
                invalid={!!error}
                disabled={dkimPRevoke === true || dkimPRevoke === "true"}
              />
              <FormFieldError>{error?.message}</FormFieldError>
            </>
          )}
        />
        <Controller
          name="dkimPRevoke"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value === true || field.value === "true"}
              onCheckedChange={(detail) => {
                field.onChange(detail.checked);
                if (detail.checked) {
                  setValue("dkimPublicKey", "");
                }
              }}
              className="mt-3"
            >
              <CheckboxControl />
              <CheckboxLabel>
                <Text preset={TEXT_PRESET.span}>
                  {t("zone_page_add_entry_modal_step_2_dkim_label_publickey_revoke")}
                </Text>
              </CheckboxLabel>
            </Checkbox>
          )}
        />
      </FormField>

      <FormField className="mb-4">
        <FormFieldLabel>
          {t("zone_page_add_entry_modal_step_2_dkim_label_servicetypes")}
        </FormFieldLabel>
        <Controller
          name="dkimS"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={String(field.value ?? "")}
              onValueChange={(detail) => field.onChange(String(detail.value ?? ""))}
              className="flex flex-col gap-2 mt-2"
            >
              <Radio value="*">
                <RadioControl />
                <RadioLabel className="ml-2">
                  <Text preset={TEXT_PRESET.span}>
                    {t("zone_page_add_entry_modal_step_2_dkim_servicetypes_all")}
                  </Text>
                </RadioLabel>
              </Radio>
              <Radio value="email">
                <RadioControl />
                <RadioLabel className="ml-2">
                  <Text preset={TEXT_PRESET.span}>
                    {t("zone_page_add_entry_modal_step_2_dkim_servicetypes_email")}
                  </Text>
                </RadioLabel>
              </Radio>
              <Radio value="">
                <RadioControl />
                <RadioLabel className="ml-2">
                  <Text preset={TEXT_PRESET.span}>
                    {t("zone_page_add_entry_modal_step_2_dkim_servicetypes_none")}
                  </Text>
                </RadioLabel>
              </Radio>
            </RadioGroup>
          )}
        />
      </FormField>

      <FormField className="mb-4">
        <FormFieldLabel>
          {t("zone_page_add_entry_modal_step_2_dkim_label_t_y")}
        </FormFieldLabel>
        <Controller
          name="dkimTY"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value?.toString() ?? "false"}
              onValueChange={(detail) => field.onChange(detail.value === "true")}
              className="flex flex-col gap-2 mt-2"
            >
              <Radio value="false">
                <RadioControl />
                <RadioLabel className="ml-2">
                  <Text preset={TEXT_PRESET.span}>
                    {t("zone_page_add_entry_modal_step_2_dkim_t_y_no")}
                  </Text>
                </RadioLabel>
              </Radio>
              <Radio value="true">
                <RadioControl />
                <RadioLabel className="ml-2">
                  <Text preset={TEXT_PRESET.span}>
                    {t("zone_page_add_entry_modal_step_2_dkim_t_y_yes")}
                  </Text>
                </RadioLabel>
              </Radio>
            </RadioGroup>
          )}
        />
      </FormField>

      <FormField className="mb-4">
        <FormFieldLabel>
          {t("zone_page_add_entry_modal_step_2_dkim_label_t_s")}
        </FormFieldLabel>
        <Controller
          name="dkimTS"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value?.toString() ?? "false"}
              onValueChange={(detail) => field.onChange(detail.value === "true")}
              className="flex flex-col gap-2 mt-2"
            >
              <Radio value="true">
                <RadioControl />
                <RadioLabel className="ml-2">
                  <Text preset={TEXT_PRESET.span}>
                    {t("zone_page_add_entry_modal_step_2_dkim_t_s_yes")}
                  </Text>
                </RadioLabel>
              </Radio>
              <Radio value="false">
                <RadioControl />
                <RadioLabel className="ml-2">
                  <Text preset={TEXT_PRESET.span}>
                    {t("zone_page_add_entry_modal_step_2_dkim_t_s_no")}
                  </Text>
                </RadioLabel>
              </Radio>
            </RadioGroup>
          )}
        />
      </FormField>
    </div>
  );
}
