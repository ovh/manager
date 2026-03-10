import { useEffect, useCallback } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Badge,
  BADGE_COLOR,
  BADGE_SIZE,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  FormField,
  FormFieldError,
  FormFieldLabel,
  Icon,
  ICON_NAME,
  Message,
  MESSAGE_COLOR,
  MESSAGE_VARIANT,
  MessageIcon,
  Select,
  SelectContent,
  SelectControl,
  type SelectCustomOptionRendererArg,
  Text,
  TEXT_PRESET,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ovhcloud/ods-react";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import type { AddEntrySchemaType } from "@/zone/utils/formSchema.utils";
import { parseSpfLines } from "@/zone/utils/formSchema.utils";
import { SubDomainField } from "../fields/SubDomainField";
import { TtlField } from "../fields/TtlField";
import { RecordPreviewBox } from "@/zone/pages/zone/components/RecordPreviewBox";
import { useIsDesktop } from "@/zone/hooks/useIsDesktop";

// ---------------------------------------------------------------------------
// SPF policy options
// ---------------------------------------------------------------------------

const SPF_POLICIES = [
  { value: "~all", labelKey: "zone_page_form_spf_policy_softfail", badge: "recommended" as const },
  { value: "-all", labelKey: "zone_page_form_spf_policy_fail", badge: null as null },
  { value: "?all", labelKey: "zone_page_form_spf_policy_neutral", badge: null as null },
  { value: "+all", labelKey: "zone_page_form_spf_policy_pass", badge: "not-recommended" as const },
] as const;

const BADGE_CONFIG_MAP: Record<string, { labelKey: string; color: BADGE_COLOR }> = {
  recommended: { labelKey: "zone_page_form_spf_badge_recommended", color: BADGE_COLOR.information },
  "not-recommended": { labelKey: "zone_page_form_spf_badge_not_recommended", color: BADGE_COLOR.warning },
};

// ---------------------------------------------------------------------------
// Custom option renderer for SPF policy select
// ---------------------------------------------------------------------------

interface SpfPolicyRendererData {
  description?: string;
  badgeLabel?: string;
  badgeColor?: BADGE_COLOR;
}

function SpfPolicyOptionRenderer({
  customData,
  label: optionLabel,
}: Readonly<SelectCustomOptionRendererArg<SpfPolicyRendererData>>) {
  return (
    <div className="flex items-center gap-2">
      {customData?.badgeLabel && customData?.badgeColor && (
        <Badge color={customData.badgeColor} size={BADGE_SIZE.sm}>
          {customData.badgeLabel}
        </Badge>
      )}
      <span className="font-medium">{optionLabel}</span>
      {customData?.description && (
        <span className="text-xs text-[--ods-color-text-muted]">
          — {customData.description}
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SPFRecordForm — main component
// ---------------------------------------------------------------------------

export interface SPFRecordFormProps {
  readonly serviceName: string;
}

export function SPFRecordForm({ serviceName }: SPFRecordFormProps) {
  const { t } = useTranslation(["zone", NAMESPACES.FORM, NAMESPACES.ACTIONS]);
  const { control, setValue, watch } = useFormContext<AddEntrySchemaType>();
  const isDesktop = useIsDesktop();

  // -- Watch SPF fields from react-hook-form --
  const includeOvh = !!watch('spf_includeOvh');
  const useMx = !!watch('spf_useMx');
  const useA = !!watch('spf_useA');
  const includesRaw = (watch('spf_includesRaw') as string) ?? '';
  const ip4Raw = (watch('spf_ip4Raw') as string) ?? '';
  const ip6Raw = (watch('spf_ip6Raw') as string) ?? '';
  const spfPolicy = (watch('spf_policy') as string) ?? '~all';

  // -- Compose SPF string from structured fields --
  const composeSPF = useCallback((): string => {
    const parts: string[] = ["v=spf1"];

    if (includeOvh) parts.push("include:mx.ovh.com");

    for (const val of parseSpfLines(includesRaw)) {
      parts.push(`include:${val}`);
    }

    for (const val of parseSpfLines(ip4Raw)) {
      parts.push(`ip4:${val}`);
    }

    for (const val of parseSpfLines(ip6Raw)) {
      parts.push(`ip6:${val}`);
    }

    if (useMx) parts.push("mx");
    if (useA) parts.push("a");

    parts.push(spfPolicy);
    return parts.join(" ");
  }, [includeOvh, includesRaw, ip4Raw, ip6Raw, useMx, useA, spfPolicy]);

  // -- Sync composed value to the shared form target field --
  useEffect(() => {
    setValue("target", composeSPF(), { shouldValidate: true });
  }, [composeSPF, setValue]);

  // -- Computed preview --
  const spfPreview = composeSPF();

  return (
    <div className="flex flex-col gap-6">
      {/* ── 2-column grid (stacks on mobile) ─────────────── */}
      <div className={isDesktop ? "grid grid-cols-2 gap-x-8 gap-y-6" : "flex flex-col gap-6"}>

        {/* ── LEFT COLUMN ──────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* SubDomain */}
          <SubDomainField
            control={control}
            className="w-full"
            required
            tooltip={t("zone_page_form_spf_subdomain_tooltip")}
            placeholder="www, mail, blog…"
          />

          {/* TTL */}
          <TtlField
            control={control}
            watch={watch}
            tooltip={t("zone_page_tooltip_ttl")}
          />

          {/* Authorization mechanisms */}
          <div className="flex flex-col gap-3">
            <Text preset={TEXT_PRESET.paragraph} className="font-semibold">
              {t("zone_page_form_spf_mechanisms_label")}
            </Text>

            <FormField>
              <Controller
                name="spf_includeOvh"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    className="max-w-full"
                    checked={!!field.value}
                    onCheckedChange={(detail) =>
                      field.onChange(detail.checked === true)
                    }
                  >
                    <CheckboxControl />
                    <CheckboxLabel>
                      {t("zone_page_form_spf_include_ovh")}
                    </CheckboxLabel>
                  </Checkbox>
                )}
              />
            </FormField>

            <FormField>
              <Controller
                name="spf_useMx"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    className="max-w-full"
                    checked={!!field.value}
                    onCheckedChange={(detail) =>
                      field.onChange(detail.checked === true)
                    }
                  >
                    <CheckboxControl />
                    <CheckboxLabel>
                      {t("zone_page_form_spf_mx")}
                    </CheckboxLabel>
                  </Checkbox>
                )}
              />
            </FormField>

            <FormField>
              <Controller
                name="spf_useA"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    className="max-w-full"
                    checked={!!field.value}
                    onCheckedChange={(detail) =>
                      field.onChange(detail.checked === true)
                    }
                  >
                    <CheckboxControl />
                    <CheckboxLabel>
                      {t("zone_page_form_spf_a")}
                    </CheckboxLabel>
                  </Checkbox>
                )}
              />
            </FormField>
          </div>

          {/* Policy select */}
          <FormField>
            <FormFieldLabel className="items-baseline">
              {t("zone_page_form_spf_policy_label")}
              <span className="text-xs ml-1">
                - {t(`${NAMESPACES.FORM}:required_field`)}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Icon
                    name={ICON_NAME.circleQuestion}
                    className="text-[--ods-color-primary-500] ml-1"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <Text preset={TEXT_PRESET.paragraph}>
                    {t("zone_page_form_spf_policy_tooltip")}
                  </Text>
                </TooltipContent>
              </Tooltip>
            </FormFieldLabel>
            <Controller
              name="spf_policy"
              control={control}
              render={({ field }) => (
                <Select
                  name="spf-policy"
                  className="w-full"
                  value={field.value ? [field.value as string] : ['~all']}
                  items={SPF_POLICIES.map((p) => {
                    const badgeCfg = p.badge ? BADGE_CONFIG_MAP[p.badge] : undefined;
                    return {
                      label: p.value,
                      value: p.value,
                      customRendererData: {
                        description: t(p.labelKey),
                        badgeLabel: badgeCfg ? t(badgeCfg.labelKey) : undefined,
                        badgeColor: badgeCfg?.color,
                      },
                    };
                  })}
                  onValueChange={(detail: { value?: string[] }) => {
                    const val = detail.value?.[0];
                    if (val) field.onChange(val);
                  }}
                >
                  <SelectControl />
                  <SelectContent
                    customOptionRenderer={SpfPolicyOptionRenderer}
                  />
                </Select>
              )}
            />
          </FormField>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          {/* Additional includes */}
          <Controller
            name="spf_includesRaw"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormField>
                <FormFieldLabel className="items-baseline">
                  {t("zone_page_form_spf_includes_label")}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icon
                        name={ICON_NAME.circleQuestion}
                        className="text-[--ods-color-primary-500] ml-1"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <Text preset={TEXT_PRESET.paragraph}>
                        {t("zone_page_form_spf_includes_tooltip")}
                      </Text>
                    </TooltipContent>
                  </Tooltip>
                </FormFieldLabel>
                <Textarea
                  className="w-full bg-white"
                  rows={3}
                  value={(field.value as string) ?? ''}
                  placeholder={t("zone_page_form_spf_includes_placeholder")}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    field.onChange(e.target.value)
                  }
                  onBlur={field.onBlur}
                />
                {error?.message && <FormFieldError>{error.message}</FormFieldError>}
              </FormField>
            )}
          />

          {/* IPv4 addresses */}
          <Controller
            name="spf_ip4Raw"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormField>
                <FormFieldLabel className="items-baseline">
                  {t("zone_page_form_spf_ip4_label")}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icon
                        name={ICON_NAME.circleQuestion}
                        className="text-[--ods-color-primary-500] ml-1"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <Text preset={TEXT_PRESET.paragraph}>
                        {t("zone_page_form_spf_ip4_tooltip")}
                      </Text>
                    </TooltipContent>
                  </Tooltip>
                </FormFieldLabel>
                <Textarea
                  className="w-full bg-white"
                  rows={2}
                  value={(field.value as string) ?? ''}
                  placeholder={t("zone_page_form_spf_ip4_placeholder")}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    field.onChange(e.target.value)
                  }
                  onBlur={field.onBlur}
                />
                {error?.message && <FormFieldError>{error.message}</FormFieldError>}
              </FormField>
            )}
          />

          {/* IPv6 addresses */}
          <Controller
            name="spf_ip6Raw"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormField>
                <FormFieldLabel className="items-baseline">
                  {t("zone_page_form_spf_ip6_label")}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icon
                        name={ICON_NAME.circleQuestion}
                        className="text-[--ods-color-primary-500] ml-1"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <Text preset={TEXT_PRESET.paragraph}>
                        {t("zone_page_form_spf_ip6_tooltip")}
                      </Text>
                    </TooltipContent>
                  </Tooltip>
                </FormFieldLabel>
                <Textarea
                  className="w-full bg-white"
                  rows={2}
                  value={(field.value as string) ?? ''}
                  placeholder={t("zone_page_form_spf_ip6_placeholder")}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    field.onChange(e.target.value)
                  }
                  onBlur={field.onBlur}
                />
                {error?.message && <FormFieldError>{error.message}</FormFieldError>}
              </FormField>
            )}
          />
        </div>
      </div>

      {/* ── Live preview (full width) ────────────────────── */}
      <RecordPreviewBox
        label={t("zone_page_form_spf_preview_label")}
        record={`${serviceName}. IN TXT "${spfPreview}"`}
      />

      {/* ── Info message ─────────────────────────────────── */}
      <Message color={MESSAGE_COLOR.information} variant={MESSAGE_VARIANT.light} dismissible={false}>
        <MessageIcon name={ICON_NAME.circleInfo} />
        {t("zone_page_info_SPF")}
      </Message>
    </div>
  );
}
