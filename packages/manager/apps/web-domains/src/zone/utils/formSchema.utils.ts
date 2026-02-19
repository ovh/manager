/**
 * DNS Zone Record Form — Zod Schema & Validation
 * ================================================
 *
 * Builds Zod schemas for every DNS record type supported by the zone entry
 * form.  Validation rules are derived from the declarative form configs
 * (RECORD_FORM_CONFIGS) and enriched with DNS-specific checks.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  VALIDATION CHECKS SUMMARY                                              │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │  COMMON                                                                  │
 * │  • subDomain : max 250 chars ; required for NS                          │
 * │  • ttl       : 60 – 86 400 s (custom mode only)                         │
 * │                                                                          │
 * │  POINTING RECORDS                                                        │
 * │  • A / AAAA  : target = valid IPv4 / IPv6                               │
 * │  • NS        : target = hostname (RFC 1035)                             │
 * │  • CNAME     : target = hostname                                        │
 * │  • DNAME     : target = hostname                                        │
 * │                                                                          │
 * │  MAIL RECORDS                                                            │
 * │  • MX        : target = hostname ; priority 0 – 65 535                  │
 * │  • SPF       : target = free text                                       │
 * │  • DKIM      : p (public key) must be base64                            │
 * │  • DMARC     : rua = mailto: URI ; p required ; pct 0 – 100            │
 * │                                                                          │
 * │  EXTENDED RECORDS                                                        │
 * │  • SRV       : priority / weight / port 0 – 65 535 ; target = hostname  │
 * │  • TXT       : target = optional free text                              │
 * │  • CAA       : flags 0 – 255 ; tag = select ;                           │
 * │                issue / issuewild → target = hostname                     │
 * │                iodef             → target = URL (mailto: / https://)     │
 * │  • SSHFP     : fp = hexadecimal                                         │
 * │  • TLSA      : certificateData = hexadecimal                            │
 * │  • NAPTR     : service = protocol(+rs) format                           │
 * │                regex = no quotes / spaces                                │
 * │                replace = hostname or "."                                 │
 * │                flag U → regex required  ;  flag S → replace required     │
 * │  • LOC       : lat/long degrees + hemisphere enum ; alt/size/hp/vp      │
 * │  • SVCB/HTTPS: priority 0 – 65 535 ; params empty when priority = 0    │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

import { toASCII } from 'punycode';
import { z } from 'zod';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  FieldTypeExtendedRecordsEnum,
  FieldTypePointingRecordsEnum,
  FieldTypeMailRecordsEnum,
  RecordTypesWithoutTTLEnum,
  RecordTypesAsTxtEnum,
  RecordTypesTargetWithTrailingDotEnum,
  NaptrFlagEnum,
  CaaTagEnum,
  TtlSelectEnum,
  DkimStatusEnum,
  LocLatitudeEnum,
  LocLongitudeEnum,
  BoolSelectEnum,
} from '@/common/enum/zone.enum';
import type { FieldConfig } from '@/zone/types/recordFormConfig.types';
import { RECORD_FORM_CONFIGS } from '@/zone/utils/recordFormConfig';

// ---------------------------------------------------------------------------
// Utility — safe stringification of Zod-inferred values
// ---------------------------------------------------------------------------

/**
 * Converts a Zod-inferred value to `string` without risking `[object Object]`.
 * Handles `string`, `number`, and falls back to `''` for `undefined` / `{}`.
 */
const str = (v: unknown): string => {
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  return '';
};

// ---------------------------------------------------------------------------
// Helpers — extract field info from declarative form configs
// ---------------------------------------------------------------------------

/**
 * Builds a lookup map  field name → FieldConfig  for a given record type,
 * skipping the layout-only 'subdomain' / 'ttl' tokens and recursing into
 * GroupFieldConfig children.
 */
function getFieldMap(recordType: string): Map<string, FieldConfig> {
  const config = RECORD_FORM_CONFIGS[recordType];
  const map = new Map<string, FieldConfig>();
  if (!config) return map;
  for (const row of config.rows) {
    for (const field of row.fields) {
      if (field === 'subdomain' || field === 'ttl') continue;
      if ('name' in field) {
        map.set(field.name, field);
      } else if (field.type === 'group') {
        for (const child of field.children) {
          map.set(child.name, child);
        }
      }
    }
  }
  return map;
}

export const FIELD_TYPES_POINTING_RECORDS: string[] = Object.values(FieldTypePointingRecordsEnum);

export const FIELD_TYPES_EXTENDED_RECORDS: string[] = Object.values(FieldTypeExtendedRecordsEnum);

export const FIELD_TYPES_MAIL_RECORDS: string[] = Object.values(FieldTypeMailRecordsEnum);

export const RECORD_TYPES_WITHOUT_TTL: string[] = Object.values(RecordTypesWithoutTTLEnum);

export const RECORD_TYPES_AS_TXT: string[] = Object.values(RecordTypesAsTxtEnum);

export const RECORD_TYPES_TARGET_WITH_TRAILING_DOT: string[] = Object.values(RecordTypesTargetWithTrailingDotEnum);

// ---------------------------------------------------------------------------
// Regex patterns for field validation
// ---------------------------------------------------------------------------

/** RFC 1035 / RFC 1123 hostname: alphanumeric labels separated by dots,
 *  no leading/trailing hyphens, no underscores, at least one letter required
 *  (prevents pure-numeric values like "1" or "123.456"). Optional trailing dot. */
const HOSTNAME_REGEX = /^(?=.*[a-zA-Z])[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.?$/;

/** Hexadecimal string (SSHFP fingerprint, TLSA certificate data). */
const HEX_REGEX = /^[0-9a-fA-F]+$/;

/** Base64 encoding (DKIM public key p= tag).
 *  Validates structure: groups of 4 base64 chars, optional padding with = or ==,
 *  whitespace allowed (stripped before check). */
const BASE64_REGEX = /^[A-Za-z0-9+/\s]+={0,2}$/;

/** Checks that a string is valid base64 by verifying length is a multiple of 4 (after stripping whitespace). */
function isValidBase64(value: string): boolean {
  const stripped = value.replaceAll(/\s+/g, '');
  if (stripped.length === 0) return false;
  if (stripped.length % 4 !== 0) return false;
  return BASE64_REGEX.test(value);
}

/** DMARC rua tag — must start with mailto: followed by an e-mail address. */
const DMARC_RUA_REGEX = /^mailto:.+@.+/;

/** NAPTR service field — one or more `token(+token)?` segments joined by `:`. */
const NAPTR_SERVICE_REGEX = /^\w+(?:\+\w+)?(?::\w+(?:\+\w+)?)*$/;

/** NAPTR regex field — no double-quotes or whitespace allowed. */
const NAPTR_REGEX_REGEX = /^[^"\s]*$/;

/** NAPTR replacement field — a dot-separated label or bare dot. */
const NAPTR_REPLACE_REGEX = /^((?:[^.\s](?:\.(?!$))?)+)\.?$/;

// ---------------------------------------------------------------------------
// Schema field keys — exhaustive list of every possible form field
// ---------------------------------------------------------------------------

/** Every form field key that may appear across all record types. */
const ALL_KEYS = [
  'recordType', 'subDomain', 'ttlSelect', 'ttl', 'target', 'priority', 'weight', 'port', 'flags', 'tag',
  'mbox', 'txt', 'algorithm', 'fptype', 'fp', 'usage', 'selector', 'matchingType', 'certificateData',
  'params', 'v', 'p', 'pct', 'rua', 'sp', 'aspf',
  'k', 'h', 'g', 'n', 's', 't_y', 't_s', 'dkim_status',
  'order', 'pref', 'flag', 'service', 'regex', 'replace',
  'lat_deg', 'lat_min', 'lat_sec', 'latitude', 'long_deg', 'long_min', 'long_sec', 'longitude',
  'altitude', 'size', 'hp', 'vp',
] as const;

/** Keys whose default (fallback) schema is a coerced optional number. */
const NUM_KEYS = new Set([
  'target', 'priority', 'weight', 'port', 'flags', 'usage', 'selector', 'matchingType', 'pct',
  'order', 'pref',
  'lat_deg', 'lat_min', 'lat_sec', 'long_deg', 'long_min', 'long_sec', 'altitude', 'size', 'hp', 'vp',
]);

// ---------------------------------------------------------------------------
// Base Zod schemas — reusable building blocks
// ---------------------------------------------------------------------------

/**
 * Creates all the reusable Zod schema helpers used throughout the form.
 *
 * Schemas produced:
 * - `subDomainRequired / subDomainOptional` : string, max 250 chars
 * - `ttlSelect`   : enum 'global' | 'custom'
 * - `ttl`         : numCoerce → 60–86 400 (optional)
 * - `ipv4 / ipv6` : Zod ipv4 / ipv6 validators
 * - `host`        : HOSTNAME_REGEX, max 253 chars (RFC 1035 FQDN limit)
 * - `numReq`      : required number within [min, max] (string → number coercion)
 * - `numOpt`      : optional number (string → number coercion)
 * - `stringRequired / stringOptional` : basic presence checks
 */
function createFormSchemas(t: (key: string, params?: Record<string, unknown>) => string) {
  // -- Translated error message factories --
  const zone = (key: string, params?: Record<string, unknown>) => t(key.startsWith('zone:') ? key : `zone:${key}`, params);
  const requiredMsg = t(`${NAMESPACES.FORM}:required_field`);
  const minMsg = (v: number) => t(`${NAMESPACES.FORM}:min_chars`, { value: v });
  const maxMsg = (v: number) => t(`${NAMESPACES.FORM}:max_chars`, { value: v });
  const numMinMsg = (v: number) => zone('zone_page_form_number_min', { value: v });
  const numMaxMsg = (v: number) => zone('zone_page_form_number_max', { value: v });

  // -- Number coercion: ODS inputs emit strings, Zod expects numbers --
  const numCoerce = z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === '' || v == null ? undefined : Number(v)));

  const numOpt = () => numCoerce.pipe(z.number().optional());
  const numReq = (min: number, max: number) =>
    numCoerce.pipe(
      z.number({ message: requiredMsg }).min(min, numMinMsg(min)).max(max, numMaxMsg(max)),
    );

  return {
    requiredMsg,
    zone,
    /** subDomain — required for NS, optional for all other record types. */
    subDomainRequired: z.string({ message: requiredMsg }).min(1, minMsg(1)).max(250, maxMsg(250)),
    subDomainOptional: z.string({ message: requiredMsg }).max(250, maxMsg(250)),
    /** TTL mode selector — 'global' uses the zone default, 'custom' unlocks the TTL field. */
    ttlSelect: z.enum([TtlSelectEnum.GLOBAL, TtlSelectEnum.CUSTOM]),
    /** TTL value — 60…86 400 s, coerced from string.  Only validated in 'custom' mode. */
    ttl: numCoerce.pipe(z.number()
      .min(60, zone('zone_page_form_ttl_min_value'))
      .max(86400, zone('zone_page_form_ttl_max_value'))
      .optional()),
    ttlMinMsg: zone('zone_page_form_ttl_min_value'),
    /** IPv4 target — Zod z.ipv4() built-in format check. */
    ipv4: (required: boolean) => {
      const s = z.ipv4({ message: zone('zone_page_form_target_ipv4_valid') });
      return required ? z.string({ message: requiredMsg }).pipe(s) : s.optional();
    },
    /** IPv6 target — Zod z.ipv6() built-in format check. */
    ipv6: (required: boolean) => {
      const s = z.ipv6({ message: zone('zone_page_form_target_ipv6_valid') });
      return required ? z.string({ message: requiredMsg }).pipe(s) : s.optional();
    },
    /** Hostname target — max 253 (RFC 1035 FQDN), validated via HOSTNAME_REGEX. */
    host: (required: boolean) => {
      const s = z
        .string({ message: requiredMsg })
        .min(1, minMsg(1))
        .max(253, maxMsg(253))
        .regex(HOSTNAME_REGEX, zone('zone_page_form_target_host_valid'));
      return required ? s : s.optional();
    },
    stringRequired: z.string({ message: requiredMsg }).min(1, requiredMsg),
    stringOptional: z.string({ message: requiredMsg }).optional(),
    numOpt,
    numReq,
    numMinMsg,
    numMaxMsg,
  };
}

/** Convenience alias for the return type of createFormSchemas. */
type FormSchemas = ReturnType<typeof createFormSchemas>;

// ---------------------------------------------------------------------------
// Record-specific field schema helpers (extracted to reduce complexity)
// ---------------------------------------------------------------------------

/**
 * NAPTR-specific schemas.
 * - flag   : optional string (U, S, A, P or empty)
 * - service: required, must match protocol(+rs) format  (e.g. "E2U+sip")
 * - regex  : optional, no double-quotes or whitespace
 * - replace: optional string (validated cross-field in refines)
 */
function naptrFieldSchema(key: string, s: FormSchemas): z.ZodTypeAny | null {
  if (key === 'flag') return z.string().optional().or(z.literal(''));
  if (key === 'service') {
    return z.string().min(1, s.requiredMsg).regex(NAPTR_SERVICE_REGEX, s.zone('zone_page_form_naptr_service_valid'));
  }
  if (key === 'regex') {
    return z.string().regex(NAPTR_REGEX_REGEX, s.zone('zone_page_form_naptr_regex_valid')).optional().or(z.literal(''));
  }
  if (key === 'replace') return z.string().optional().or(z.literal(''));
  return null;
}

/**
 * LOC-specific schemas.
 * - latitude  : hemisphere enum N | S
 * - longitude : hemisphere enum E | W
 */
function locFieldSchema(key: string, s: FormSchemas): z.ZodTypeAny | null {
  if (key === 'latitude') return z.enum([LocLatitudeEnum.N, LocLatitudeEnum.S], { message: s.requiredMsg });
  if (key === 'longitude') return z.enum([LocLongitudeEnum.E, LocLongitudeEnum.W], { message: s.requiredMsg });
  return null;
}

/**
 * Per-record-type field overrides that don't fit the generic type-based
 * dispatch (SSHFP, TLSA, DKIM, DMARC).
 */
function recordSpecificFieldSchema(
  recordType: string,
  key: string,
  s: FormSchemas,
): z.ZodTypeAny | null {
  // SSHFP: fingerprint (fp) must be hexadecimal
  if (recordType === FieldTypeExtendedRecordsEnum.SSHFP && key === 'fp') {
    return z.string({ message: s.requiredMsg }).min(1, s.requiredMsg).regex(HEX_REGEX, s.zone('zone_page_form_hex_valid'));
  }
  // TLSA: certificate association data must be hexadecimal
  if (recordType === FieldTypeExtendedRecordsEnum.TLSA && key === 'certificateData') {
    return z.string({ message: s.requiredMsg }).min(1, s.requiredMsg).regex(HEX_REGEX, s.zone('zone_page_form_hex_valid'));
  }
  // DKIM: public key (p) must be valid base64
  if (recordType === FieldTypeMailRecordsEnum.DKIM && key === 'p') {
    return z.string({ message: s.requiredMsg }).min(1, s.requiredMsg).refine(
      (v) => isValidBase64(v),
      { message: s.zone('zone_page_form_base64_valid') },
    );
  }
  // DMARC: rua (aggregate report URI) must be a mailto: address when provided
  if (recordType === FieldTypeMailRecordsEnum.DMARC && key === 'rua') {
    return z
      .string()
      .refine((v) => !v || DMARC_RUA_REGEX.test(v), {
        message: s.zone('zone_page_form_dmarc_rua_valid'),
      })
      .optional();
  }
  return null;
}

/**
 * Generic field schema based on the field's declared type / validation kind.
 * Handles: ipv4, ipv6, host, number, select, and plain string.
 */
function genericFieldSchema(
  kind: string | undefined,
  required: boolean,
  f: FieldConfig | undefined,
  s: FormSchemas,
  isTargetOptionalForTxt: boolean,
): z.ZodTypeAny {
  // -- Target type checks (from recordFormConfig `validation` map) --
  if (kind === 'ipv4') return s.ipv4(required);
  if (kind === 'ipv6') return s.ipv6(required);
  if (kind === 'host') return s.host(required);

  // -- Typed fields --
  if (f?.type === 'number') {
    const min = f.min ?? 0;
    const max = f.max ?? 65535;
    return required
      ? s.numReq(min, max)
      : s.numOpt().pipe(z.number().min(min, s.numMinMsg(min)).max(max, s.numMaxMsg(max)).optional());
  }
  if (f?.type === 'select') {
    return required
      ? z.string({ message: s.requiredMsg }).min(1, s.requiredMsg)
      : z.string({ message: s.requiredMsg }).optional();
  }

  // -- Default: required or optional string --
  if (required && f && !isTargetOptionalForTxt) return s.stringRequired;
  return s.stringOptional;
}

// ---------------------------------------------------------------------------
// Main schema builder
// ---------------------------------------------------------------------------

function buildAddEntrySchema(recordType: string, t: (key: string, params?: Record<string, unknown>) => string) {
  const s = createFormSchemas(t);
  const config = RECORD_FORM_CONFIGS[recordType];
  const fieldMap = getFieldMap(recordType);
  const validation = config?.validation;

  /**
   * Determines the Zod schema for a single form field.
   * Priority: record-specific override → generic type-based dispatch.
   */
  const fieldSchema = (key: string): z.ZodTypeAny => {
    const f = fieldMap.get(key);
    const kind = validation?.[key];
    const required = f?.required ?? false;
    const isTargetOptionalForTxt = recordType === FieldTypeExtendedRecordsEnum.TXT && key === 'target';

    // 1. Record-specific overrides
    if (recordType === FieldTypeExtendedRecordsEnum.NAPTR) {
      const schema = naptrFieldSchema(key, s);
      if (schema) return schema;
    }
    if (recordType === FieldTypeExtendedRecordsEnum.LOC) {
      const schema = locFieldSchema(key, s);
      if (schema) return schema;
    }
    const specific = recordSpecificFieldSchema(recordType, key, s);
    if (specific) return specific;

    // 2. Generic type-based dispatch
    return genericFieldSchema(kind, required, f, s, isTargetOptionalForTxt);
  };

  // -- Build the object shape: one key per possible form field --
  const shape: Record<string, z.ZodTypeAny> = {
    recordType: z.string(),
    /** subDomain is required only for NS records. */
    subDomain: recordType === FieldTypePointingRecordsEnum.NS ? s.subDomainRequired : s.subDomainOptional,
    ttlSelect: s.ttlSelect,
    ttl: s.ttl,
  };

  for (const key of ALL_KEYS) {
    if (key === 'recordType' || key === 'subDomain' || key === 'ttlSelect' || key === 'ttl') continue;

    if (fieldMap.has(key)) {
      shape[key] = fieldSchema(key);
    } else if (NUM_KEYS.has(key)) {
      shape[key] = s.numOpt();
    } else {
      shape[key] = s.stringOptional;
    }
  }

  // -----------------------------------------------------------------------
  // Cross-field refines (validated after the whole object is parsed)
  // -----------------------------------------------------------------------

  return z
    .object(shape)
    // -- TTL: if mode is 'custom', the TTL value must be ≥ 60 s --
    .refine(
      (data) => data.ttlSelect !== TtlSelectEnum.CUSTOM || (typeof data.ttl === 'number' && data.ttl >= 60),
      { message: s.ttlMinMsg, path: ['ttl'] },
    )
    // -- SVCB / HTTPS: params must be empty when priority = 0 (alias mode, RFC 9460) --
    .refine(
      (data) => {
        if (recordType !== FieldTypeExtendedRecordsEnum.SVCB && recordType !== FieldTypeExtendedRecordsEnum.HTTPS) return true;
        const priority = data.priority;
        const params = str(data.params);
        const priorityZero = priority === 0 || priority === '0' || Number(priority) === 0;
        return !priorityZero || params.trim() === '';
      },
      {
        message: s.zone('zone_page_form_svcb_params_priority_zero'),
        path: ['params'],
      },
    )
    // -- NAPTR: replace must be a valid hostname or "." --
    .refine(
      (data) => {
        if (recordType !== FieldTypeExtendedRecordsEnum.NAPTR) return true;
        const replace = str(data.replace).trim();
        if (!replace) return true;
        return replace === '.' || NAPTR_REPLACE_REGEX.test(replace) || HOSTNAME_REGEX.test(replace);
      },
      {
        message: s.zone('zone_page_form_naptr_replace_valid'),
        path: ['replace'],
      },
    )
    // -- NAPTR flag U: regex field is required --
    .refine(
      (data) => {
        if (recordType !== FieldTypeExtendedRecordsEnum.NAPTR) return true;
        if (str(data.flag) !== NaptrFlagEnum.U) return true;
        return typeof data.regex === 'string' && data.regex.trim() !== '';
      },
      {
        message: s.requiredMsg,
        path: ['regex'],
      },
    )
    // -- NAPTR flag S: replace field is required --
    .refine(
      (data) => {
        if (recordType !== FieldTypeExtendedRecordsEnum.NAPTR) return true;
        if (str(data.flag) !== NaptrFlagEnum.S) return true;
        return typeof data.replace === 'string' && data.replace.trim() !== '';
      },
      {
        message: s.requiredMsg,
        path: ['replace'],
      },
    )
    // -- CAA issue / issuewild: target must be a valid hostname --
    .refine(
      (data) => {
        if (recordType !== FieldTypeExtendedRecordsEnum.CAA) return true;
        const tag = str(data.tag);
        if (tag === CaaTagEnum.IODEF) return true;
        const target = str(data.target).trim();
        return !target || HOSTNAME_REGEX.test(target);
      },
      {
        message: s.zone('zone_page_form_target_host_valid'),
        path: ['target'],
      },
    )
    // -- CAA iodef: target must be a URL (mailto: or https://) --
    .refine(
      (data) => {
        if (recordType !== FieldTypeExtendedRecordsEnum.CAA) return true;
        if (str(data.tag) !== CaaTagEnum.IODEF) return true;
        const target = str(data.target).trim();
        return !target || /^(mailto:|https?:\/\/)/.test(target);
      },
      {
        message: s.zone('zone_page_form_caa_iodef_valid'),
        path: ['target'],
      },
    );
}

// ---------------------------------------------------------------------------
// Public API — schema factory & type
// ---------------------------------------------------------------------------

/** Creates a Zod schema for the record-type-specific add-entry form. */
export const zForm = (t: (key: string, params?: Record<string, unknown>) => string, recordType?: string) => {
  const ADD_ENTRY_FORM_SCHEMA = buildAddEntrySchema(recordType ?? '', t);
  return { ADD_ENTRY_FORM_SCHEMA };
};

/** Inferred TypeScript type from the Zod schema (used for react-hook-form). */
export type AddEntrySchemaType = z.infer<ReturnType<typeof buildAddEntrySchema>>;

// ---------------------------------------------------------------------------
// Error mapping & domain formatting helpers
// ---------------------------------------------------------------------------

/** Maps Zod validation issues to react-hook-form `setError` calls. */
export function applyZodErrorsToForm<T extends Record<string, unknown>>(
  error: z.ZodError,
  setError: (name: keyof T & string, payload: { type: string; message: string }) => void,
) {
  for (const issue of error.issues) {
    const name = (issue.path[0] == null ? 'root' : String(issue.path[0])) as keyof T & string;
    setError(name, { type: issue.code ?? 'custom', message: String(issue.message) });
  }
}

/** Builds the full FQDN from subDomain + domainName (IDN-safe via punycode). */
export function getResumeDomain(subDomain: string | undefined, domainName: string): string {
  const sub = String(subDomain ?? '').trim();
  const subPart = sub ? (() => { try { return toASCII(sub); } catch { return sub; } })() : '';
  return subPart ? `${subPart}.${domainName}.` : `${domainName}.`;
}

// ---------------------------------------------------------------------------
// Target display-value formatters (preview the DNS record value)
// ---------------------------------------------------------------------------

/** Converts a NAPTR replacement value to wire-format (punycode + trailing dot). */
function toNaptrReplacement(replace: unknown): string {
  const val = str(replace).trim();
  if (!val) return '.';
  return val.endsWith('.') ? toASCII(val) : `${toASCII(val)}.`;
}

/**
 * Formats the RDATA for a LOC record.
 * Components: lat_deg lat_min lat_sec N/S long_deg long_min long_sec E/W alt size hp vp
 */
function formatLocTarget(formValues: Partial<AddEntrySchemaType>): string {
  /** Extracts a field value as string. */
  const v = (k: keyof AddEntrySchemaType) => str(formValues?.[k]);
  /** Extracts a field value with a unit suffix (e.g. "100m"). */
  const withUnit = (k: keyof AddEntrySchemaType, unit: string) => {
    const s = v(k);
    return s ? `${s}${unit}` : '';
  };

  return [
    v('lat_deg'), v('lat_min'), v('lat_sec'), v('latitude'),
    v('long_deg'), v('long_min'), v('long_sec'), v('longitude'),
    withUnit('altitude', 'm'), withUnit('size', 'm'), withUnit('hp', 'm'), withUnit('vp', 'm'),
  ]
    .join(' ')
    .replaceAll(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Formats the RDATA for a NAPTR record.
 * Wire format: order pref "flag" "service" "regex" replacement
 *
 * Flag determines which fields are used:
 * - U : URI resolution — regex is filled, replacement is always "."
 * - S : SRV lookup    — replacement is filled (hostname)
 * - A : A/AAAA lookup — replacement is filled
 * - P : protocol-specific — both regex and replacement can be set
 */
function formatNaptrTarget(formValues: Partial<AddEntrySchemaType>): string {
  const flag = str(formValues?.flag).toUpperCase();
  const service = str(formValues?.service);

  let regex = '';
  let lastItem = '.';
  if (flag === NaptrFlagEnum.U) {
    regex = str(formValues?.regex);
  } else if (flag === NaptrFlagEnum.S || flag === NaptrFlagEnum.A) {
    lastItem = toNaptrReplacement(formValues?.replace);
  } else {
    regex = str(formValues?.regex);
    lastItem = toNaptrReplacement(formValues?.replace);
  }

  return [
    str(formValues?.order), str(formValues?.pref),
    `"${flag}"`, `"${service}"`, `"${regex}"`, lastItem,
  ]
    .join(' ')
    .replaceAll(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Formats the RDATA for a DMARC record (as a TXT value).
 * Parts: v=DMARC1; p=policy; pct=N; rua=mailto:…; sp=policy; aspf=mode
 */
function formatDmarcTarget(formValues: Partial<AddEntrySchemaType>): string {
  const parts: string[] = [];
  parts.push(`v=${str(formValues?.v) || 'DMARC1'}`);
  const p = str(formValues?.p);
  if (p) parts.push(`p=${p}`);
  const pct = str(formValues?.pct);
  if (pct) parts.push(`pct=${pct}`);
  const rua = str(formValues?.rua);
  if (rua) parts.push(`rua=${rua}`);
  const sp = str(formValues?.sp);
  if (sp) parts.push(`sp=${sp}`);
  const aspf = str(formValues?.aspf);
  if (aspf) parts.push(`aspf=${aspf}`);
  return `"${parts.join('; ')}"`;
}

/**
 * Formats the RDATA for a DKIM record (as a TXT value).
 * Parts: v=DKIM1; g=…; h=…; k=…; n=…; p=publicKey; s=…; t=flags
 */
function formatDkimTarget(formValues: Partial<AddEntrySchemaType>): string {
  const isRevoked = formValues?.dkim_status === DkimStatusEnum.REVOKED;
  /** Shortcut to read a field as string. */
  const tag = (k: keyof AddEntrySchemaType) => str(formValues?.[k]);

  const parts = ['v=DKIM1'];

  // Optional tags: granularity, hash algorithm, key type, notes
  const g = tag('g');
  if (g) parts.push(`g=${g}`);
  const h = tag('h');
  if (h) parts.push(`h=${h}`);
  const k = tag('k');
  if (k) parts.push(`k=${k}`);
  const n = tag('n');
  if (n) parts.push(`n=${n}`);

  // Public key — empty when revoked
  if (isRevoked) {
    parts.push('p=');
  } else {
    const p = tag('p').replaceAll(/\s+/g, '');
    if (p) parts.push(`p=${p}`);
  }

  // Service type
  const svc = tag('s');
  if (svc) parts.push(`s=${svc}`);

  // Flags (combine t_y and t_s)
  const flags: string[] = [];
  if (str(formValues?.t_y) === BoolSelectEnum.YES) flags.push('y');
  if (str(formValues?.t_s) === BoolSelectEnum.YES) flags.push('s');
  if (flags.length) parts.push(`t=${flags.join(':')}`);

  const joined = parts.map((p) => `${p};`).join(' ').trim();
  return `"${joined}"`;
}

// ---------------------------------------------------------------------------
// Target display value — delegates to the appropriate per-record formatter
// ---------------------------------------------------------------------------

/**
 * Returns the display-ready target value for the record confirmation panel.
 * Handles special formatting for NAPTR, LOC, DMARC = DKIM records, wraps
 * TXT-like records in quotes, and appends trailing dots where required.
 */
export function getTargetDisplayValue(
  recordType: string,
  formValues: Partial<AddEntrySchemaType>,
): string {
  // SPF: target is a raw text value
  if (recordType === FieldTypeMailRecordsEnum.SPF && formValues?.target) {
    return str(formValues.target);
  }

  // Records with custom formatters
  if (recordType === FieldTypeExtendedRecordsEnum.NAPTR) return formatNaptrTarget(formValues);
  if (recordType === FieldTypeExtendedRecordsEnum.LOC) return formatLocTarget(formValues);
  if (recordType === FieldTypeMailRecordsEnum.DMARC) return formatDmarcTarget(formValues);
  if (recordType === FieldTypeMailRecordsEnum.DKIM) return formatDkimTarget(formValues);

  // Generic: concatenate all field values in declaration order
  const fieldMap = getFieldMap(recordType);
  const fieldNames = Array.from(fieldMap.keys());
  const isTxtRecordType = (RECORD_TYPES_AS_TXT as readonly string[]).includes(recordType);
  const rdataNeedsTrailingDot = (RECORD_TYPES_TARGET_WITH_TRAILING_DOT as readonly string[]).includes(
    recordType,
  );
  const fieldValues = fieldNames
    .map((name) => formValues?.[name])
    .filter((v) => v !== undefined && v !== '' && v != null)
    .map(String);
  const valuePart = fieldValues.join(' ');
  if (isTxtRecordType) return valuePart ? `"${valuePart}"` : '';
  if (rdataNeedsTrailingDot && valuePart) return `${valuePart}.`;
  return valuePart;
}
