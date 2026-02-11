import { toASCII } from 'punycode';
import { z } from 'zod';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export type FieldInputType = 'text' | 'number' | 'select' | 'textarea';
export type FieldValidationKind = 'ipv4' | 'ipv6' | 'host';

export interface RecordFieldDef {
  name: string;
  labelKey: string;
  inputType: FieldInputType;
  options?: { value: string; labelKey?: string }[];
  min?: number;
  max?: number;
  step?: number | string;
  required?: boolean;
  tooltipKey?: string;
}

export interface RecordTypeConfig {
  fields: RecordFieldDef[];
  validation?: Partial<Record<string, FieldValidationKind>>;
}

const LABEL_KEYS = {
  TARGET: 'zone_page_add_entry_modal_step_2_label_target',
  VALUE: 'zone_page_add_entry_modal_step_2_label_value',
  PRIORITY: 'zone_page_add_entry_modal_step_2_label_priority',
  WEIGHT: 'zone_page_add_entry_modal_step_2_label_weight',
  PORT: 'zone_page_add_entry_modal_step_2_label_port',
  CAA_FLAGS: 'zone_page_add_entry_modal_step_2_label_caa_flags',
  CAA_TAG: 'zone_page_add_entry_modal_step_2_label_caa_tag',
  RP_MBOX: 'zone_page_add_entry_modal_step_2_label_rp_mbox',
  RP_TXT: 'zone_page_add_entry_modal_step_2_label_rp_txt',
  ALGORITHM: 'zone_page_add_entry_modal_step_2_label_algorithm',
  FPTYPE: 'zone_page_add_entry_modal_step_2_label_fptype',
  FP: 'zone_page_add_entry_modal_step_2_label_fp',
  TLSA_USAGE: 'zone_page_add_entry_modal_step_2_label_tlsa_usage',
  TLSA_SELECTOR: 'zone_page_add_entry_modal_step_2_label_tlsa_selector',
  TLSA_MATCHING: 'zone_page_add_entry_modal_step_2_label_tlsa_matching',
  TLSA_CERT: 'zone_page_add_entry_modal_step_2_label_tlsa_cert',
  SVCB_PRIORITY: 'zone_page_add_entry_modal_step_2_label_svcb_priority',
  SVCB_TARGET: 'zone_page_add_entry_modal_step_2_label_svcb_target',
  SVCB_PARAMS: 'zone_page_add_entry_modal_step_2_label_svcb_params',
  DMARC_P: 'zone_page_add_entry_modal_step_2_label_dmarc_p',
  DMARC_PCT: 'zone_page_add_entry_modal_step_2_label_dmarc_pct',
  DMARC_RUA: 'zone_page_add_entry_modal_step_2_label_dmarc_rua',
  DMARC_SP: 'zone_page_add_entry_modal_step_2_label_dmarc_sp',
  DMARC_ASPF: 'zone_page_add_entry_modal_step_2_label_dmarc_aspf',
  NAPTR_ORDER: 'zone_page_add_entry_modal_step_2_label_naptr_order',
  NAPTR_PREF: 'zone_page_add_entry_modal_step_2_label_naptr_pref',
  NAPTR_FLAG: 'zone_page_add_entry_modal_step_2_label_naptr_flag',
  NAPTR_SERVICE: 'zone_page_add_entry_modal_step_2_label_naptr_service',
  NAPTR_REGEX: 'zone_page_add_entry_modal_step_2_label_naptr_regex',
  NAPTR_REPLACE: 'zone_page_add_entry_modal_step_2_label_naptr_replace',
  LOC_LAT_DEG: 'zone_page_add_entry_modal_step_2_label_loc_lat_deg',
  LOC_LAT_MIN: 'zone_page_add_entry_modal_step_2_label_loc_lat_min',
  LOC_LAT_SEC: 'zone_page_add_entry_modal_step_2_label_loc_lat_sec',
  LOC_LAT: 'zone_page_add_entry_modal_step_2_label_loc_lat',
  LOC_LONG_DEG: 'zone_page_add_entry_modal_step_2_label_loc_long_deg',
  LOC_LONG_MIN: 'zone_page_add_entry_modal_step_2_label_loc_long_min',
  LOC_LONG_SEC: 'zone_page_add_entry_modal_step_2_label_loc_long_sec',
  LOC_LONG: 'zone_page_add_entry_modal_step_2_label_loc_long',
  LOC_ALTITUDE: 'zone_page_add_entry_modal_step_2_label_loc_altitude',
  LOC_SIZE: 'zone_page_add_entry_modal_step_2_label_loc_size',
  LOC_HP: 'zone_page_add_entry_modal_step_2_label_loc_hp',
  LOC_VP: 'zone_page_add_entry_modal_step_2_label_loc_vp',
};

type RecordFieldOverrides = Partial<Omit<RecordFieldDef, 'name' | 'labelKey' | 'inputType'>>;

function createTextField(name: string, labelKey: string, overrides: RecordFieldOverrides = {}): RecordFieldDef {
  return { name, labelKey, inputType: 'text', ...overrides };
}

function createNumberField(name: string, labelKey: string, overrides: RecordFieldOverrides = {}): RecordFieldDef {
  return { name, labelKey, inputType: 'number', ...overrides };
}

function createTextareaField(name: string, labelKey: string, overrides: RecordFieldOverrides = {}): RecordFieldDef {
  return { name, labelKey, inputType: 'textarea', ...overrides };
}

function createSelectField(
  name: string,
  labelKey: string,
  options: { value: string; labelKey?: string }[],
  overrides: RecordFieldOverrides = {},
): RecordFieldDef {
  return { name, labelKey, inputType: 'select', options, ...overrides };
}

const CAA_TAG_OPTIONS = [{ value: 'issue' }, { value: 'issuewild' }, { value: 'iodef' }];
const SSHFP_ALGORITHM_OPTIONS = [
  { value: '1', labelKey: 'zone_page_add_entry_modal_step_2_label_sshfp_algorithm_1' },
  { value: '2', labelKey: 'zone_page_add_entry_modal_step_2_label_sshfp_algorithm_2' },
  { value: '3', labelKey: 'zone_page_add_entry_modal_step_2_label_sshfp_algorithm_3' },
  { value: '4', labelKey: 'zone_page_add_entry_modal_step_2_label_sshfp_algorithm_4' },
];
const SSHFP_FPTYPE_OPTIONS = [
  { value: '1', labelKey: 'zone_page_add_entry_modal_step_2_label_sshfp_fptype_1' },
  { value: '2', labelKey: 'zone_page_add_entry_modal_step_2_label_sshfp_fptype_2' },
];
const DMARC_POLICY_OPTIONS = [{ value: 'none' }, { value: 'quarantine' }, { value: 'reject' }];
const DMARC_ASPF_OPTIONS = [{ value: 'r' }, { value: 's' }];
const LOC_LATITUDE_OPTIONS = [{ value: 'N', labelKey: 'zone_page_add_entry_modal_step_2_label_loc_lat_N' }, { value: 'S', labelKey: 'zone_page_add_entry_modal_step_2_label_loc_lat_S' }];
const LOC_LONGITUDE_OPTIONS = [{ value: 'E', labelKey: 'zone_page_add_entry_modal_step_2_label_loc_long_E' }, { value: 'W', labelKey: 'zone_page_add_entry_modal_step_2_label_loc_long_W' }];

const TOOLTIP_KEYS = {
  targetHostValid: 'zone_page_add_entry_modal_step_2_target_host_valid',
  svcbPriorityHelp: 'zone_page_add_entry_modal_step_2_svcb_priority_help',
  svcbParamsHelp: 'zone_page_add_entry_modal_step_2_svcb_params_help',
  naptrFlagHelp: 'zone_page_add_entry_modal_step_2_naptr_flag_help',
  naptrServiceHelp: 'zone_page_add_entry_modal_step_2_naptr_service_help',
  naptrRegexHelp: 'zone_page_add_entry_modal_step_2_naptr_regex_help',
  naptrReplaceHelp: 'zone_page_add_entry_modal_step_2_naptr_replace_help',
} as const;

const FIELD = {
  target: createTextField('target', LABEL_KEYS.TARGET, { required: true }),
  targetHost: createTextField('target', LABEL_KEYS.TARGET, {
    required: true,
    tooltipKey: TOOLTIP_KEYS.targetHostValid,
  }),
  /** Target for CAA: host validation, no tooltip */
  targetHostCaa: createTextField('target', LABEL_KEYS.TARGET, { required: true }),
  targetValue: createTextField('target', LABEL_KEYS.VALUE, { required: true }),
  targetValueTextarea: createTextareaField('target', LABEL_KEYS.VALUE, { required: true }),
  targetSvcb: createTextField('target', LABEL_KEYS.SVCB_TARGET, {
    required: true,
    tooltipKey: TOOLTIP_KEYS.targetHostValid,
  }),
  priority: createNumberField('priority', LABEL_KEYS.PRIORITY, { required: true, min: 0, max: 65535 }),
  prioritySvcb: createNumberField('priority', LABEL_KEYS.SVCB_PRIORITY, {
    required: true,
    min: 0,
    max: 65535,
    tooltipKey: TOOLTIP_KEYS.svcbPriorityHelp,
  }),
  weight: createNumberField('weight', LABEL_KEYS.WEIGHT, { required: true, min: 0, max: 65535 }),
  port: createNumberField('port', LABEL_KEYS.PORT, { required: true, min: 0, max: 65535 }),
  params: createTextField('params', LABEL_KEYS.SVCB_PARAMS, { tooltipKey: TOOLTIP_KEYS.svcbParamsHelp }),
  naptrOrder: createNumberField('order', LABEL_KEYS.NAPTR_ORDER, { required: true, min: 0, max: 65535 }),
  naptrPref: createNumberField('pref', LABEL_KEYS.NAPTR_PREF, { required: true, min: 0, max: 65535 }),
  naptrFlag: createTextField('flag', LABEL_KEYS.NAPTR_FLAG, { required: false, tooltipKey: TOOLTIP_KEYS.naptrFlagHelp }),
  naptrService: createTextField('service', LABEL_KEYS.NAPTR_SERVICE, {
    required: true,
    tooltipKey: TOOLTIP_KEYS.naptrServiceHelp,
  }),
  naptrRegex: createTextField('regex', LABEL_KEYS.NAPTR_REGEX, { required: false, tooltipKey: TOOLTIP_KEYS.naptrRegexHelp }),
  naptrReplace: createTextField('replace', LABEL_KEYS.NAPTR_REPLACE, {
    required: false,
    tooltipKey: TOOLTIP_KEYS.naptrReplaceHelp,
  }),
  locLatDeg: createNumberField('lat_deg', LABEL_KEYS.LOC_LAT_DEG, { required: true, min: 0, max: 90 }),
  locLatMin: createNumberField('lat_min', LABEL_KEYS.LOC_LAT_MIN, { required: true, min: 0, max: 59 }),
  locLatSec: createNumberField('lat_sec', LABEL_KEYS.LOC_LAT_SEC, { required: true, min: 0, max: 59.999, step: 0.001 }),
  locLatitude: createSelectField('latitude', LABEL_KEYS.LOC_LAT, LOC_LATITUDE_OPTIONS, { required: true }),
  locLongDeg: createNumberField('long_deg', LABEL_KEYS.LOC_LONG_DEG, { required: true, min: 0, max: 180 }),
  locLongMin: createNumberField('long_min', LABEL_KEYS.LOC_LONG_MIN, { required: true, min: 0, max: 59 }),
  locLongSec: createNumberField('long_sec', LABEL_KEYS.LOC_LONG_SEC, { required: true, min: 0, max: 59.999, step: 0.001 }),
  locLongitude: createSelectField('longitude', LABEL_KEYS.LOC_LONG, LOC_LONGITUDE_OPTIONS, { required: true }),
  locAltitude: createNumberField('altitude', LABEL_KEYS.LOC_ALTITUDE, { required: true, min: -100000, max: 42849672.95, step: 0.01 }),
  locSize: createNumberField('size', LABEL_KEYS.LOC_SIZE, { required: false, min: 0, max: 90000000, step: 0.01 }),
  locHp: createNumberField('hp', LABEL_KEYS.LOC_HP, { required: false, min: 0, max: 90000000, step: 0.01 }),
  locVp: createNumberField('vp', LABEL_KEYS.LOC_VP, { required: false, min: 0, max: 90000000, step: 0.01 }),
} as const;

const RECORD_TYPE_CONFIG: Partial<Record<string, RecordTypeConfig>> = {
  A: { fields: [FIELD.target], validation: { target: 'ipv4' } },
  AAAA: { fields: [FIELD.target], validation: { target: 'ipv6' } },
  NS: { fields: [FIELD.targetHost], validation: { target: 'host' } },
  CNAME: { fields: [FIELD.targetHost], validation: { target: 'host' } },
  DNAME: { fields: [FIELD.targetHost], validation: { target: 'host' } },
  DYNHOST: { fields: [FIELD.target], validation: { target: 'ipv4' } },
  MX: {
    fields: [FIELD.priority, FIELD.targetHost],
    validation: { target: 'host' },
  },
  TXT: { fields: [FIELD.targetValue] },
  DKIM: { fields: [FIELD.targetValueTextarea] },
  CAA: {
    fields: [
      createNumberField('flags', LABEL_KEYS.CAA_FLAGS, { required: true, min: 0, max: 255 }),
      createSelectField('tag', LABEL_KEYS.CAA_TAG, CAA_TAG_OPTIONS, { required: true }),
      FIELD.targetHostCaa,
    ],
    validation: { target: 'host' },
  },
  SRV: {
    fields: [FIELD.priority, FIELD.weight, FIELD.port, FIELD.targetHost],
    validation: { target: 'host' },
  },
  RP: {
    fields: [
      createTextField('mbox', LABEL_KEYS.RP_MBOX, {
        required: true,
        tooltipKey: TOOLTIP_KEYS.targetHostValid,
      }),
      createTextField('txt', LABEL_KEYS.RP_TXT, {
        required: true,
        tooltipKey: TOOLTIP_KEYS.targetHostValid,
      }),
    ],
    validation: { mbox: 'host', txt: 'host' },
  },
  SSHFP: {
    fields: [
      createSelectField('algorithm', LABEL_KEYS.ALGORITHM, SSHFP_ALGORITHM_OPTIONS, { required: true }),
      createSelectField('fptype', LABEL_KEYS.FPTYPE, SSHFP_FPTYPE_OPTIONS, { required: true }),
      createTextField('fp', LABEL_KEYS.FP, { required: true }),
    ],
  },
  TLSA: {
    fields: [
      createNumberField('usage', LABEL_KEYS.TLSA_USAGE, { required: true, min: 0, max: 3 }),
      createNumberField('selector', LABEL_KEYS.TLSA_SELECTOR, { required: true, min: 0, max: 1 }),
      createNumberField('matchingType', LABEL_KEYS.TLSA_MATCHING, { required: true, min: 1, max: 2 }),
      createTextField('certificateData', LABEL_KEYS.TLSA_CERT, { required: true }),
    ],
  },
  SVCB: {
    fields: [FIELD.prioritySvcb, FIELD.targetSvcb, FIELD.params],
    validation: { target: 'host' },
  },
  HTTPS: {
    fields: [FIELD.prioritySvcb, FIELD.targetSvcb, FIELD.params],
    validation: { target: 'host' },
  },
  DMARC: {
    fields: [
      createSelectField('p', LABEL_KEYS.DMARC_P, DMARC_POLICY_OPTIONS, { required: true }),
      createNumberField('pct', LABEL_KEYS.DMARC_PCT, { min: 0, max: 100 }),
      createTextField('rua', LABEL_KEYS.DMARC_RUA),
      createSelectField('sp', LABEL_KEYS.DMARC_SP, DMARC_POLICY_OPTIONS),
      createSelectField('aspf', LABEL_KEYS.DMARC_ASPF, DMARC_ASPF_OPTIONS),
    ],
  },
  NAPTR: {
    fields: [
      FIELD.naptrOrder,
      FIELD.naptrPref,
      FIELD.naptrFlag,
      FIELD.naptrService,
      FIELD.naptrRegex,
      FIELD.naptrReplace,
    ],
  },
  LOC: {
    fields: [
      FIELD.locLatDeg,
      FIELD.locLatMin,
      FIELD.locLatSec,
      FIELD.locLatitude,
      FIELD.locLongDeg,
      FIELD.locLongMin,
      FIELD.locLongSec,
      FIELD.locLongitude,
      FIELD.locAltitude,
      FIELD.locSize,
      FIELD.locHp,
      FIELD.locVp,
    ],
  },
};

export const FIELD_TYPES_MAIL_RECORDS = ['MX', 'SPF', 'DKIM', 'DMARC'] as const;

export const RECORD_TYPES_WITHOUT_TTL: string[] = ['SPF', 'DKIM', 'DMARC'];

export const RECORD_TYPES_AS_TXT = ['SPF', 'DKIM', 'DMARC'] as const;

export const RECORD_TYPES_TARGET_WITH_TRAILING_DOT = ['NS', 'CNAME', 'DNAME'] as const;

export function getRecordFields(recordType: string): RecordFieldDef[] {
  return RECORD_TYPE_CONFIG[recordType]?.fields ?? [];
}

export function getRecordValidation(recordType: string): Record<string, FieldValidationKind> | undefined {
  return RECORD_TYPE_CONFIG[recordType]?.validation;
}

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
    ttlMinMsg: zone('zone_page_add_entry_modal_step_2_ttl_min_value'),
    ipv4: (required: boolean) => {
      const s = z.ipv4({ message: zone('zone_page_add_entry_modal_step_2_target_ipv4_valid') });
      return required ? s : s.optional();
    },
    ipv6: (required: boolean) => {
      const s = z.ipv6({ message: zone('zone_page_add_entry_modal_step_2_target_ipv6_valid') });
      return required ? s : s.optional();
    },
    host: (required: boolean) => {
      const s = z
        .string()
        .min(1, minMsg(1))
        .max(250, maxMsg(250))
        .regex(HOST_REGEX, zone('zone_page_add_entry_modal_step_2_target_host_valid'));
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
  const fields = getRecordFields(recordType);
  const validation = getRecordValidation(recordType);
  const fieldSet = new Set(fields.map((f) => f.name));
  const fieldByKey = Object.fromEntries(fields.map((f) => [f.name, f]));

  const fieldSchema = (key: string): z.ZodTypeAny => {
    const f = fieldByKey[key];
    const kind = validation?.[key];
    const required = f?.required ?? false;
    const targetOptionalForTxt = recordType === 'TXT' && key === 'target';

    if (recordType === 'NAPTR') {
      if (key === 'flag') {
        return z
          .string()
          .max(1, s.zone('zone_page_add_entry_modal_step_2_naptr_flag_valid'))
          .regex(NAPTR_FLAG_REGEX, s.zone('zone_page_add_entry_modal_step_2_naptr_flag_valid'))
          .optional()
          .or(z.literal(''));
      }
      if (key === 'service') {
        return z
          .string()
          .min(1, s.requiredMsg)
          .regex(NAPTR_SERVICE_REGEX, s.zone('zone_page_add_entry_modal_step_2_naptr_service_valid'));
      }
      if (key === 'regex') {
        return z
          .string()
          .regex(NAPTR_REGEX_REGEX, s.zone('zone_page_add_entry_modal_step_2_naptr_regex_valid'))
          .optional()
          .or(z.literal(''));
      }
      if (key === 'replace') {
        return z.string().optional().or(z.literal(''));
      }
    }

    if (recordType === 'LOC') {
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
    if (f?.inputType === 'number') {
      const min = f.min ?? 0;
      const max = f.max ?? 65535;
      return required ? s.numReq(min, max) : s.numOpt().pipe(z.number().min(min).max(max).optional());
    }
    if (required && f && !targetOptionalForTxt) return s.stringRequired;
    return s.stringOptional;
  };

  const shape: Record<string, z.ZodTypeAny> = {
    recordType: z.string(),
    subDomain: recordType === 'NS' ? s.subDomainRequired : s.subDomainOptional,
    ttlSelect: s.ttlSelect,
    ttl: s.ttl,
  };

  for (const key of ALL_KEYS) {
    if (key === 'recordType' || key === 'subDomain' || key === 'ttlSelect' || key === 'ttl') continue;
    shape[key] = fieldSet.has(key)
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
        if (recordType !== 'SVCB' && recordType !== 'HTTPS') return true;
        const priority = data.priority;
        const params = data.params;
        const priorityZero = priority === 0 || priority === '0' || Number(priority) === 0;
        return !priorityZero || !params || String(params ?? '').trim() === '';
      },
      {
        message: s.zone('zone_page_add_entry_modal_step_2_svcb_params_priority_zero'),
        path: ['params'],
      },
    )
    .refine(
      (data) => {
        if (recordType !== 'NAPTR') return true;
        const replace = data.replace;
        if (replace == null || String(replace).trim() === '') return true;
        const val = String(replace).trim();
        return val === '.' || NAPTR_REPLACE_REGEX.test(val) || HOST_REGEX.test(val);
      },
      {
        message: s.zone('zone_page_add_entry_modal_step_2_naptr_replace_valid'),
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
  if (recordType === 'SPF' && formValues?.target) {
    const targetValue = String(formValues.target);
    return targetValue || '';
  }

  if (recordType === 'NAPTR') {
    return formatNaptrTarget(formValues);
  }

  if (recordType === 'LOC') {
    return formatLocTarget(formValues);
  }

  const fields = getRecordFields(recordType);
  const isTxtRecordType = (RECORD_TYPES_AS_TXT as readonly string[]).includes(recordType);
  const rdataNeedsTrailingDot = (RECORD_TYPES_TARGET_WITH_TRAILING_DOT as readonly string[]).includes(
    recordType,
  );
  const fieldValues = fields
    .map((f) => formValues?.[f.name as keyof AddEntrySchemaType])
    .filter((v) => v !== undefined && v !== '' && v != null)
    .map(String);
  const valuePart = fieldValues.join(' ');
  if (isTxtRecordType) return valuePart ? `"${valuePart}"` : '';
  if (rdataNeedsTrailingDot && valuePart) return `${valuePart}.`;
  return valuePart;
}
