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
} from '@/common/enum/zone.enum';
import type { FieldConfig } from '@/zone/types/recordFormConfig.types';
import { RECORD_FORM_CONFIGS } from '@/zone/utils/recordFormConfig';

// ---------------------------------------------------------------------------
// Helpers to extract field info from the declarative form configs
// ---------------------------------------------------------------------------

/**
 * Builds a lookup map of field name → FieldConfig from a record type's
 * form config, filtering out the special 'subdomain' / 'ttl' tokens.
 */
function getFieldMap(recordType: string): Map<string, FieldConfig> {
  const config = RECORD_FORM_CONFIGS[recordType];
  const map = new Map<string, FieldConfig>();
  if (!config) return map;
  for (const row of config.rows) {
    for (const field of row.fields) {
      if (field !== 'subdomain' && field !== 'ttl') {
        map.set(field.name, field);
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

const HOST_REGEX = /^[a-zA-Z0-9.-]+$/;
const NAPTR_FLAG_REGEX = /^[a-zA-Z0-9]?$/;
const NAPTR_SERVICE_REGEX = /^(?:(?:[a-zA-Z0-9]+|[a-zA-Z0-9]+\+[a-zA-Z0-9]+(?!\+))(?::(?!$)|(?=$)))+$/;
const NAPTR_REGEX_REGEX = /^[^"\s]*$/;
const NAPTR_REPLACE_REGEX = /^((?:[^.\s](?:\.(?!$))?)+)\.?$/;

const ALL_KEYS = [
  'recordType', 'subDomain', 'ttlSelect', 'ttl', 'target', 'priority', 'weight', 'port', 'flags', 'tag',
  'mbox', 'txt', 'algorithm', 'fptype', 'fp', 'usage', 'selector', 'matchingType', 'certificateData',
  'params', 'p', 'pct', 'rua', 'sp', 'aspf',
  'order', 'pref', 'flag', 'service', 'regex', 'replace',
  'lat_deg', 'lat_min', 'lat_sec', 'latitude', 'long_deg', 'long_min', 'long_sec', 'longitude',
  'altitude', 'size', 'hp', 'vp',
] as const;

const NUM_KEYS = new Set([
  'target', 'priority', 'weight', 'port', 'flags', 'usage', 'selector', 'matchingType', 'pct',
  'order', 'pref',
  'lat_deg', 'lat_min', 'lat_sec', 'long_deg', 'long_min', 'long_sec', 'altitude', 'size', 'hp', 'vp',
]);

function createFormSchemas(t: (key: string, params?: Record<string, unknown>) => string) {
  const zone = (key: string) => t(key.startsWith('zone:') ? key : `zone:${key}`);
  const requiredMsg = t(`${NAMESPACES.FORM}:required_field`);
  const minMsg = (v: number) => t(`${NAMESPACES.FORM}:min_chars`, { value: v });
  const maxMsg = (v: number) => t(`${NAMESPACES.FORM}:max_chars`, { value: v });

  const numCoerce = z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === '' || v == null ? undefined : Number(v)));

  const numOpt = () => numCoerce.pipe(z.number().optional());
  const numReq = (min: number, max: number) =>
    numCoerce.pipe(
      z.number({ message: requiredMsg }).min(min, minMsg(min)).max(max, maxMsg(max)),
    );

  return {
    requiredMsg,
    zone,
    /** Required for NS (Angular: required when fieldType === 'NS'). Optional otherwise. */
    subDomainRequired: z.string().min(1, minMsg(1)).max(250, maxMsg(250)),
    subDomainOptional: z.string().max(250, maxMsg(250)),
    ttlSelect: z.enum(['global', 'custom']),
    ttl: numCoerce.pipe(z.number().min(60).max(86400).optional()),
    ttlMinMsg: zone('zone_page_form_ttl_min_value'),
    ipv4: (required: boolean) => {
      const s = z.ipv4({ message: zone('zone_page_form_target_ipv4_valid') });
      return required ? s : s.optional();
    },
    ipv6: (required: boolean) => {
      const s = z.ipv6({ message: zone('zone_page_form_target_ipv6_valid') });
      return required ? s : s.optional();
    },
    host: (required: boolean) => {
      const s = z
        .string()
        .min(1, minMsg(1))
        .max(250, maxMsg(250))
        .regex(HOST_REGEX, zone('zone_page_form_target_host_valid'));
      return required ? s : s.optional();
    },
    stringRequired: z.string().min(1, requiredMsg),
    stringOptional: z.string().optional(),
    numOpt,
    numReq,
  };
}

function buildAddEntrySchema(recordType: string, t: (key: string, params?: Record<string, unknown>) => string) {
  const s = createFormSchemas(t);
  const config = RECORD_FORM_CONFIGS[recordType];
  const fieldMap = getFieldMap(recordType);
  const validation = config?.validation;

  const fieldSchema = (key: string): z.ZodTypeAny => {
    const f = fieldMap.get(key);
    const kind = validation?.[key];
    const required = f?.required ?? false;
    const targetOptionalForTxt = recordType === FieldTypeExtendedRecordsEnum.TXT && key === 'target';

    if (recordType === FieldTypeExtendedRecordsEnum.NAPTR) {
      if (key === 'flag') {
        return z
          .string()
          .max(1, s.zone('zone_page_form_naptr_flag_valid'))
          .regex(NAPTR_FLAG_REGEX, s.zone('zone_page_form_naptr_flag_valid'))
          .optional()
          .or(z.literal(''));
      }
      if (key === 'service') {
        return z
          .string()
          .min(1, s.requiredMsg)
          .regex(NAPTR_SERVICE_REGEX, s.zone('zone_page_form_naptr_service_valid'));
      }
      if (key === 'regex') {
        return z
          .string()
          .regex(NAPTR_REGEX_REGEX, s.zone('zone_page_form_naptr_regex_valid'))
          .optional()
          .or(z.literal(''));
      }
      if (key === 'replace') {
        return z.string().optional().or(z.literal(''));
      }
    }

    if (recordType === FieldTypeExtendedRecordsEnum.LOC) {
      if (key === 'latitude') {
        return z.enum(['N', 'S'], {
          message: s.requiredMsg
        });
      }
      if (key === 'longitude') {
        return z.enum(['E', 'W'], {
          message: s.requiredMsg
        });
      }
    }
    if (kind === 'ipv4') return s.ipv4(required);
    if (kind === 'ipv6') return s.ipv6(required);
    if (kind === 'host') return s.host(required);
    if (f?.type === 'number') {
      const min = f.min ?? 0;
      const max = f.max ?? 65535;
      return required ? s.numReq(min, max) : s.numOpt().pipe(z.number().min(min).max(max).optional());
    }
    if (f?.type === 'select') {
      return required
        ? z.string({ message: s.requiredMsg }).min(1, s.requiredMsg)
        : z.string().optional();
    }
    if (required && f && !targetOptionalForTxt) return s.stringRequired;
    return s.stringOptional;
  };

  const shape: Record<string, z.ZodTypeAny> = {
    recordType: z.string(),
    subDomain: recordType === FieldTypePointingRecordsEnum.NS ? s.subDomainRequired : s.subDomainOptional,
    ttlSelect: s.ttlSelect,
    ttl: s.ttl,
  };

  for (const key of ALL_KEYS) {
    if (key === 'recordType' || key === 'subDomain' || key === 'ttlSelect' || key === 'ttl') continue;
    shape[key] = fieldMap.has(key)
      ? fieldSchema(key)
      : NUM_KEYS.has(key)
        ? s.numOpt()
        : s.stringOptional;
  }

  return z
    .object(shape)
    .refine(
      (data) => data.ttlSelect !== 'custom' || (typeof data.ttl === 'number' && data.ttl >= 60),
      { message: s.ttlMinMsg, path: ['ttl'] },
    )
    .refine(
      (data) => {
        if (recordType !== FieldTypeExtendedRecordsEnum.SVCB && recordType !== FieldTypeExtendedRecordsEnum.HTTPS) return true;
        const priority = data.priority;
        const params = data.params;
        const priorityZero = priority === 0 || priority === '0' || Number(priority) === 0;
        return !priorityZero || !params || String(params ?? '').trim() === '';
      },
      {
        message: s.zone('zone_page_form_svcb_params_priority_zero'),
        path: ['params'],
      },
    )
    .refine(
      (data) => {
        if (recordType !== FieldTypeExtendedRecordsEnum.NAPTR) return true;
        const replace = data.replace;
        if (replace == null || String(replace).trim() === '') return true;
        const val = String(replace).trim();
        return val === '.' || NAPTR_REPLACE_REGEX.test(val) || HOST_REGEX.test(val);
      },
      {
        message: s.zone('zone_page_form_naptr_replace_valid'),
        path: ['replace'],
      },
    );
}

export const zForm = (t: (key: string, params?: Record<string, unknown>) => string, recordType?: string) => {
  const ADD_ENTRY_FORM_SCHEMA = buildAddEntrySchema(recordType ?? '', t);
  return { ADD_ENTRY_FORM_SCHEMA };
};

export type AddEntrySchemaType = z.infer<ReturnType<typeof buildAddEntrySchema>>;

export function applyZodErrorsToForm<T extends Record<string, unknown>>(
  error: z.ZodError,
  setError: (name: keyof T & string, payload: { type: string; message: string }) => void,
) {
  for (const issue of error.issues) {
    const name = (issue.path[0] != null ? String(issue.path[0]) : 'root') as keyof T & string;
    setError(name, { type: issue.code ?? 'custom', message: String(issue.message) });
  }
}

export function getResumeDomain(subDomain: string | undefined, domainName: string): string {
  const sub = String(subDomain ?? '').trim();
  const subPart = sub ? (() => { try { return toASCII(sub); } catch { return sub; } })() : '';
  return subPart ? `${subPart}.${domainName}.` : `${domainName}.`;
}

function formatLocTarget(formValues: Partial<AddEntrySchemaType>): string {
  const latDeg = formValues?.lat_deg;
  const latMin = formValues?.lat_min;
  const latSec = formValues?.lat_sec;
  const latitude = formValues?.latitude ?? '';
  const longDeg = formValues?.long_deg;
  const longMin = formValues?.long_min;
  const longSec = formValues?.long_sec;
  const longitude = formValues?.longitude ?? '';
  const altitude = formValues?.altitude;
  const size = formValues?.size;
  const hp = formValues?.hp;
  const vp = formValues?.vp;
  return [
    latDeg != null && latDeg !== '' ? String(latDeg) : '',
    latMin != null && latMin !== '' ? String(latMin) : '',
    latSec != null && latSec !== '' ? String(latSec) : '',
    latitude,
    longDeg != null && longDeg !== '' ? String(longDeg) : '',
    longMin != null && longMin !== '' ? String(longMin) : '',
    longSec != null && longSec !== '' ? String(longSec) : '',
    longitude,
    altitude != null && altitude !== '' ? `${String(altitude)}m` : '',
    size != null && size !== '' ? `${String(size)}m` : '',
    hp != null && hp !== '' ? `${String(hp)}m` : '',
    vp != null && vp !== '' ? `${String(vp)}m` : '',
  ]
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function formatNaptrTarget(formValues: Partial<AddEntrySchemaType>): string {
  let lastItem = '.';
  const replace = formValues?.replace;
  if (replace != null && String(replace).trim() !== '') {
    const val = String(replace).trim();
    lastItem = /\.$/.test(val) ? toASCII(val) : `${toASCII(val)}.`;
  }
  const order = formValues?.order;
  const pref = formValues?.pref;
  const flag = formValues?.flag;
  const service = formValues?.service ?? '';
  const regex = formValues?.regex ?? '';
  return [
    order != null && order !== '' ? String(order) : '',
    pref != null && pref !== '' ? String(pref) : '',
    `"${flag != null && flag !== '' ? String(flag).toUpperCase() : ''}"`,
    `"${service}"`,
    `"${regex}"`,
    lastItem,
  ]
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function getTargetDisplayValue(
  recordType: string,
  formValues: Partial<AddEntrySchemaType>,
): string {
  if (recordType === FieldTypeMailRecordsEnum.SPF && formValues?.target) {
    const targetValue = String(formValues.target);
    return targetValue || '';
  }

  if (recordType === FieldTypeExtendedRecordsEnum.NAPTR) {
    return formatNaptrTarget(formValues);
  }

  if (recordType === FieldTypeExtendedRecordsEnum.LOC) {
    return formatLocTarget(formValues);
  }

  const fieldMap = getFieldMap(recordType);
  const fieldNames = Array.from(fieldMap.keys());
  const isTxtRecordType = (RECORD_TYPES_AS_TXT as readonly string[]).includes(recordType);
  const rdataNeedsTrailingDot = (RECORD_TYPES_TARGET_WITH_TRAILING_DOT as readonly string[]).includes(
    recordType,
  );
  const fieldValues = fieldNames
    .map((name) => formValues?.[name as keyof AddEntrySchemaType])
    .filter((v) => v !== undefined && v !== '' && v != null)
    .map(String);
  const valuePart = fieldValues.join(' ');
  if (isTxtRecordType) return valuePart ? `"${valuePart}"` : '';
  if (rdataNeedsTrailingDot && valuePart) return `${valuePart}.`;
  return valuePart;
}
