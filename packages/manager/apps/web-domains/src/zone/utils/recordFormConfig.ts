/**
 * Declarative configuration for all DNS record type forms.
 *
 * Each record type defines:
 * - `rows`: The layout rows with grid classes and field definitions.
 *   Rows can reference the special tokens `'subdomain'` and `'ttl'` for
 *   the shared SubDomainField and TtlField components.
 * - `message`: Configuration for the information banner (explanation + description).
 * - `subDomainTooltipKey`: i18n key for the subdomain tooltip.
 * - `subDomainRequired` (optional): whether the subdomain field is required (default true).
 *
 * SPF is intentionally excluded: it has a fully custom layout handled separately.
 */

import type {
  RecordFormConfig,
  SelectItemConfig,
} from '@/zone/types/recordFormConfig.types';

export type {
  FieldConfig,
  FieldValidationKind,
  FormRowConfig,
  MessageConfig,
  NumberFieldConfig,
  RecordFormConfig,
  SelectFieldConfig,
  SelectItemConfig,
  TextareaFieldConfig,
  TextFieldConfig,
} from '@/zone/types/recordFormConfig.types';

// ---------------------------------------------------------------------------
// Shared grid class constants
// ---------------------------------------------------------------------------

/** Two fields side by side (equal width) */
const GRID_2COL = 'grid grid-cols-2 items-start gap-4';
/** Wide field + narrow field (e.g. SubDomain + small input, or SubDomain + TTL) */
const GRID_WIDE_NARROW = 'grid grid-cols-[2fr_200px] items-start gap-4';
/** Target/value field + TTL side by side (equal halves) */
const GRID_TARGET_TTL = 'grid grid-cols-2 items-start gap-4';

// ---------------------------------------------------------------------------
// Reusable select item lists
// ---------------------------------------------------------------------------

const CAA_TAG_ITEMS: readonly SelectItemConfig[] = [
  { value: 'issue', labelKey: 'zone_page_caa_tag_option_issue' },
  { value: 'issuewild', labelKey: 'zone_page_caa_tag_option_issuewild' },
  { value: 'iodef', labelKey: 'zone_page_caa_tag_option_iodef' },
];

const SSHFP_ALGORITHM_ITEMS: readonly SelectItemConfig[] = [
  { value: '1', labelKey: 'zone_page_form_label_sshfp_algorithm_1' },
  { value: '2', labelKey: 'zone_page_form_label_sshfp_algorithm_2' },
  { value: '3', labelKey: 'zone_page_form_label_sshfp_algorithm_3' },
  { value: '4', labelKey: 'zone_page_form_label_sshfp_algorithm_4' },
];

const SSHFP_FPTYPE_ITEMS: readonly SelectItemConfig[] = [
  { value: '1', labelKey: 'zone_page_form_label_sshfp_fptype_1' },
  { value: '2', labelKey: 'zone_page_form_label_sshfp_fptype_2' },
];

const DMARC_POLICY_ITEMS: readonly SelectItemConfig[] = [
  { value: 'none', labelKey: 'zone_page_form_label_dmarc_policy_none', descriptionKey: 'zone_page_form_label_dmarc_policy_none_desc' },
  { value: 'quarantine', labelKey: 'zone_page_form_label_dmarc_policy_quarantine', descriptionKey: 'zone_page_form_label_dmarc_policy_quarantine_desc' },
  { value: 'reject', labelKey: 'zone_page_form_label_dmarc_policy_reject', descriptionKey: 'zone_page_form_label_dmarc_policy_reject_desc' },
];

const DMARC_ASPF_ITEMS: readonly SelectItemConfig[] = [
  { value: 'r', labelKey: 'zone_page_form_label_dmarc_aspf_r' },
  { value: 's', labelKey: 'zone_page_form_label_dmarc_aspf_s' },
];

const LOC_LATITUDE_ITEMS: readonly SelectItemConfig[] = [
  { value: 'N', labelKey: 'zone_page_form_label_loc_lat_N' },
  { value: 'S', labelKey: 'zone_page_form_label_loc_lat_S' },
];

const LOC_LONGITUDE_ITEMS: readonly SelectItemConfig[] = [
  { value: 'E', labelKey: 'zone_page_form_label_loc_long_E' },
  { value: 'W', labelKey: 'zone_page_form_label_loc_long_W' },
];

// ---------------------------------------------------------------------------
// Record form configurations
// ---------------------------------------------------------------------------

export const RECORD_FORM_CONFIGS: Readonly<Record<string, RecordFormConfig>> = {
  // ---- Pointing records ----

  A: {
    subDomainTooltipKey: 'zone_page_tooltip_subdomain',
    validation: { target: 'ipv4' },
    rows: [
      { gridClassName: 'w-full', fields: ['subdomain'] },
      {
        gridClassName: GRID_TARGET_TTL,
        fields: [
          { type: 'text', name: 'target', labelKey: 'zone_page_form_label_ipv4', required: true, tooltipKey: 'zone_page_tooltip_ip', placeholder: '203.0.113.1' },
          'ttl',
        ],
      },
    ],
    message: {
      explanationKey: 'zone_page_record_explanation_A',
      descriptionKey: 'zone_page_record_description_A',
      targetVarName: 'ip',
      targetFallbackKey: 'zone_page_record_target_fallback_ipv4',
    },
  },

  AAAA: {
    subDomainTooltipKey: 'zone_page_tooltip_subdomain',
    validation: { target: 'ipv6' },
    rows: [
      { gridClassName: 'w-full', fields: ['subdomain'] },
      {
        gridClassName: GRID_TARGET_TTL,
        fields: [
          { type: 'text', name: 'target', labelKey: 'zone_page_form_label_ipv6', required: true, tooltipKey: 'zone_page_tooltip_ip', placeholder: '2001:db8::1' },
          'ttl',
        ],
      },
    ],
    message: {
      explanationKey: 'zone_page_record_explanation_AAAA',
      descriptionKey: 'zone_page_record_description_AAAA',
      targetVarName: 'ip',
      targetFallbackKey: 'zone_page_record_target_fallback_ipv6',
    },
  },

  NS: {
    subDomainTooltipKey: 'zone_page_tooltip_subdomain_ns',
    subDomainRequired: true,
    validation: { target: 'host' },
    rows: [
      { gridClassName: 'w-full', fields: ['subdomain'] },
      {
        gridClassName: GRID_TARGET_TTL,
        fields: [
          { type: 'text', name: 'target', labelKey: 'zone_page_form_label_ns_target', required: true, tooltipKey: 'zone_page_tooltip_ns_target', placeholder: 'ns1.example.com.' },
          'ttl',
        ],
      },
    ],
    message: {
      explanationKey: 'zone_page_record_explanation_NS',
      descriptionKey: 'zone_page_record_description_NS',
      targetVarName: 'target',
      targetFallbackKey: 'zone_page_record_target_fallback_dns_server',
    },
  },

  CNAME: {
    subDomainTooltipKey: 'zone_page_tooltip_subdomain_cname',
    validation: { target: 'host' },
    rows: [
      { gridClassName: 'w-full', fields: ['subdomain'] },
      {
        gridClassName: GRID_TARGET_TTL,
        fields: [
          { type: 'text', name: 'target', labelKey: 'zone_page_form_label_cname_target', required: true, tooltipKey: 'zone_page_tooltip_cname_target', placeholder: 'alias.example.com.' },
          'ttl',
        ],
      },
    ],
    message: {
      explanationKey: 'zone_page_record_explanation_CNAME',
      descriptionKey: 'zone_page_record_description_CNAME',
      targetVarName: 'target',
      targetFallbackKey: 'zone_page_record_target_fallback_hostname',
    },
  },

  DNAME: {
    subDomainTooltipKey: 'zone_page_tooltip_subdomain_dname',
    validation: { target: 'host' },
    rows: [
      { gridClassName: 'w-full', fields: ['subdomain'] },
      {
        gridClassName: GRID_TARGET_TTL,
        fields: [
          { type: 'text', name: 'target', labelKey: 'zone_page_form_label_dname_target', required: true, tooltipKey: 'zone_page_tooltip_dname_target', placeholder: 'other-domain.com.' },
          'ttl',
        ],
      },
    ],
    message: {
      explanationKey: 'zone_page_record_explanation_DNAME',
      descriptionKey: 'zone_page_record_description_DNAME',
      targetVarName: 'target',
      targetFallbackKey: 'zone_page_record_target_fallback_domain',
    },
  },

  // ---- Extended records ----

  CAA: {
    subDomainTooltipKey: 'zone_page_tooltip_subdomain',
    validation: { target: 'host' },
    rows: [
      { gridClassName: 'w-full', fields: ['subdomain'] },
      {
        gridClassName: GRID_2COL,
        fields: [
          { type: 'number', name: 'flags', labelKey: 'zone_page_form_label_caa_flags', required: true, min: 0, max: 255, tooltipKey: 'zone_page_tooltip_caa_flags', placeholder: '0' },
          { type: 'select', name: 'tag', labelKey: 'zone_page_form_label_caa_tag', required: true, items: CAA_TAG_ITEMS, tooltipKey: 'zone_page_tooltip_caa_tag' },
        ],
      },
      {
        gridClassName: GRID_TARGET_TTL,
        fields: [
          { type: 'text', name: 'target', labelKey: 'zone_page_form_label_caa_target', required: true, tooltipKey: 'zone_page_tooltip_caa_target', placeholder: 'letsencrypt.org' },
          'ttl',
        ],
      },
    ],
    message: {
      explanationKey: 'zone_page_record_explanation_CAA',
      descriptionKey: 'zone_page_record_description_CAA',
      targetVarName: 'target',
      targetFallbackKey: 'zone_page_record_target_fallback_ca',
    },
  },

  TXT: {
    subDomainTooltipKey: 'zone_page_tooltip_subdomain',
    rows: [
      { gridClassName: 'w-full', fields: ['subdomain'] },
      {
        gridClassName: GRID_TARGET_TTL,
        fields: [
          { type: 'textarea', name: 'target', labelKey: 'zone_page_form_label_value', required: true, tooltipKey: 'zone_page_tooltip_txt_value', placeholder: 'v=spf1 include:mx.ovh.com ~all' },
          'ttl',
        ],
      },
    ],
    message: {
      explanationKey: 'zone_page_record_explanation_TXT',
      descriptionKey: 'zone_page_record_description_TXT',
      targetVarName: 'target',
      targetFallbackKey: 'zone_page_record_target_fallback_value',
    },
  },

  SRV: {
    subDomainTooltipKey: 'zone_page_tooltip_subdomain',
    validation: { target: 'host' },
    rows: [
      { gridClassName: GRID_WIDE_NARROW, fields: ['subdomain', { type: 'number', name: 'priority', labelKey: 'zone_page_form_label_priority', required: true, min: 0, max: 65535, tooltipKey: 'zone_page_tooltip_srv_priority', placeholder: '10' }] },
      {
        gridClassName: GRID_2COL,
        fields: [
          { type: 'number', name: 'weight', labelKey: 'zone_page_form_label_weight', required: true, min: 0, max: 65535, tooltipKey: 'zone_page_tooltip_srv_weight', placeholder: '100' },
          { type: 'number', name: 'port', labelKey: 'zone_page_form_label_port', required: true, min: 0, max: 65535, tooltipKey: 'zone_page_tooltip_srv_port', placeholder: '443' },
        ],
      },
      {
        gridClassName: GRID_TARGET_TTL,
        fields: [
          { type: 'text', name: 'target', labelKey: 'zone_page_form_label_srv_target', required: true, tooltipKey: 'zone_page_tooltip_srv_target', placeholder: 'server.example.com.' },
          'ttl',
        ],
      },
    ],
    message: {
      explanationKey: 'zone_page_record_explanation_SRV',
      descriptionKey: 'zone_page_record_description_SRV',
      targetVarName: 'target',
      targetFallbackKey: 'zone_page_record_target_fallback_server',
    },
  },

  NAPTR: {
    subDomainTooltipKey: 'zone_page_tooltip_subdomain',
    rows: [
      { gridClassName: GRID_WIDE_NARROW, fields: ['subdomain', 'ttl'] },
      {
        gridClassName: GRID_2COL,
        fields: [
          { type: 'number', name: 'order', labelKey: 'zone_page_form_label_naptr_order', required: true, min: 0, max: 65535, tooltipKey: 'zone_page_tooltip_naptr_order', placeholder: '100' },
          { type: 'number', name: 'pref', labelKey: 'zone_page_form_label_naptr_pref', required: true, min: 0, max: 65535, tooltipKey: 'zone_page_tooltip_naptr_pref', placeholder: '10' },
        ],
      },
      {
        gridClassName: GRID_2COL,
        fields: [
          { type: 'text', name: 'flag', labelKey: 'zone_page_form_label_naptr_flag', maxLength: 1, tooltipKey: 'zone_page_form_naptr_flag_help', placeholder: 's' },
          { type: 'text', name: 'service', labelKey: 'zone_page_form_label_naptr_service', required: true, tooltipKey: 'zone_page_form_naptr_service_help', placeholder: 'SIP+D2U' },
        ],
      },
      {
        gridClassName: 'grid grid-cols-2 items-start gap-4',
        fields: [
          { type: 'text', name: 'regex', labelKey: 'zone_page_form_label_naptr_regex', tooltipKey: 'zone_page_form_naptr_regex_help', disabledWhenFilled: 'replace', placeholder: '!^.*$!sip:info@example.com!' },
          { type: 'text', name: 'replace', labelKey: 'zone_page_form_label_naptr_replace', tooltipKey: 'zone_page_form_naptr_replace_help', disabledWhenFilled: 'regex', placeholder: '_sip._udp.example.com.' },
        ],
      },
    ],
    message: {
      explanationKey: 'zone_page_record_explanation_NAPTR',
      descriptionKey: 'zone_page_record_description_NAPTR',
    },
  },

  LOC: {
    subDomainTooltipKey: 'zone_page_tooltip_subdomain',
    rows: [
      { gridClassName: GRID_WIDE_NARROW, fields: ['subdomain', 'ttl'] },
      // Latitude
      {
        dividerBefore: true,
        headingKey: 'zone_page_form_label_loc_lat',
        gridClassName: GRID_2COL,
        fields: [
          { type: 'number', name: 'lat_deg', labelKey: 'zone_page_form_label_loc_lat_deg', required: true, min: 0, max: 90, step: 1, tooltipKey: 'zone_page_tooltip_loc_lat_deg', placeholder: '48' },
          { type: 'number', name: 'lat_min', labelKey: 'zone_page_form_label_loc_lat_min', required: true, min: 0, max: 59, step: 1, tooltipKey: 'zone_page_tooltip_loc_lat_min', placeholder: '51' },
        ],
      },
      {
        gridClassName: GRID_2COL,
        fields: [
          { type: 'number', name: 'lat_sec', labelKey: 'zone_page_form_label_loc_lat_sec', required: true, min: 0, max: 59.999, step: 0.001, tooltipKey: 'zone_page_tooltip_loc_lat_sec', placeholder: '24.000' },
          { type: 'select', name: 'latitude', labelKey: 'zone_page_form_label_loc_lat_direction', required: true, items: LOC_LATITUDE_ITEMS, tooltipKey: 'zone_page_tooltip_loc_lat_direction' },
        ],
      },
      // Longitude
      {
        dividerBefore: true,
        headingKey: 'zone_page_form_label_loc_long',
        gridClassName: GRID_2COL,
        fields: [
          { type: 'number', name: 'long_deg', labelKey: 'zone_page_form_label_loc_long_deg', required: true, min: 0, max: 180, step: 1, tooltipKey: 'zone_page_tooltip_loc_long_deg', placeholder: '48' },
          { type: 'number', name: 'long_min', labelKey: 'zone_page_form_label_loc_long_min', required: true, min: 0, max: 59, step: 1, tooltipKey: 'zone_page_tooltip_loc_long_min', placeholder: '51' },
        ],
      },
      {
        gridClassName: GRID_2COL,
        fields: [
          { type: 'number', name: 'long_sec', labelKey: 'zone_page_form_label_loc_long_sec', required: true, min: 0, max: 59.999, step: 0.001, tooltipKey: 'zone_page_tooltip_loc_long_sec', placeholder: '24.000' },
          { type: 'select', name: 'longitude', labelKey: 'zone_page_form_label_loc_long_direction', required: true, items: LOC_LONGITUDE_ITEMS, tooltipKey: 'zone_page_tooltip_loc_long_direction' },
        ],
      },
      // Altitude, Size, HP, VP
      {
        dividerBefore: true,
        headingKey: 'zone_page_form_label_loc_size_hp_vp',
        gridClassName: GRID_2COL,
        fields: [
          { type: 'number', name: 'altitude', labelKey: 'zone_page_form_label_loc_altitude', required: true, min: -100000, max: 42849672.95, step: 0.01, tooltipKey: 'zone_page_tooltip_loc_altitude', suffixKey: 'zone_page_form_label_loc_meters', placeholder: '42.00' },
          { type: 'number', name: 'size', labelKey: 'zone_page_form_label_loc_size', min: 0, max: 90000000, step: 0.01, tooltipKey: 'zone_page_tooltip_loc_size', suffixKey: 'zone_page_form_label_loc_meters', placeholder: '1.00' },
        ],
      },
      {
        gridClassName: GRID_2COL,
        fields: [
          { type: 'number', name: 'hp', labelKey: 'zone_page_form_label_loc_hp', min: 0, max: 90000000, step: 0.01, tooltipKey: 'zone_page_tooltip_loc_hp', suffixKey: 'zone_page_form_label_loc_meters', placeholder: '10000.00' },
          { type: 'number', name: 'vp', labelKey: 'zone_page_form_label_loc_vp', min: 0, max: 90000000, step: 0.01, tooltipKey: 'zone_page_tooltip_loc_vp', suffixKey: 'zone_page_form_label_loc_meters', placeholder: '10.00' },
        ],
      },
    ],
    message: {
      explanationKey: 'zone_page_record_explanation_LOC',
      descriptionKey: 'zone_page_record_description_LOC',
    },
  },

  SSHFP: {
    subDomainTooltipKey: 'zone_page_tooltip_subdomain',
    rows: [
      { gridClassName: GRID_WIDE_NARROW, fields: ['subdomain', 'ttl'] },
      {
        gridClassName: GRID_2COL,
        fields: [
          { type: 'select', name: 'algorithm', labelKey: 'zone_page_form_label_algorithm', required: true, items: SSHFP_ALGORITHM_ITEMS, tooltipKey: 'zone_page_tooltip_sshfp_algorithm' },
          { type: 'select', name: 'fptype', labelKey: 'zone_page_form_label_fptype', required: true, items: SSHFP_FPTYPE_ITEMS, tooltipKey: 'zone_page_tooltip_sshfp_fptype' },
        ],
      },
      {
        gridClassName: 'w-full',
        fields: [
          { type: 'text', name: 'fp', labelKey: 'zone_page_form_label_fp', required: true, tooltipKey: 'zone_page_tooltip_sshfp_fp', placeholder: '123456789abcdef...' },
        ],
      },
    ],
    message: {
      explanationKey: 'zone_page_record_explanation_SSHFP',
      descriptionKey: 'zone_page_record_description_SSHFP',
    },
  },

  TLSA: {
    subDomainTooltipKey: 'zone_page_tooltip_subdomain',
    rows: [
      { gridClassName: GRID_WIDE_NARROW, fields: ['subdomain', 'ttl'] },
      {
        gridClassName: GRID_2COL,
        fields: [
          {
            type: 'select', name: 'usage', labelKey: 'zone_page_form_label_tlsa_usage', required: true, tooltipKey: 'zone_page_tooltip_tlsa_usage', items: [
              { value: '0', labelKey: 'zone_page_form_label_tlsa_usage_0', descriptionKey: 'zone_page_form_label_tlsa_usage_0_desc' },
              { value: '1', labelKey: 'zone_page_form_label_tlsa_usage_1', descriptionKey: 'zone_page_form_label_tlsa_usage_1_desc' },
              { value: '2', labelKey: 'zone_page_form_label_tlsa_usage_2', descriptionKey: 'zone_page_form_label_tlsa_usage_2_desc' },
              { value: '3', labelKey: 'zone_page_form_label_tlsa_usage_3', descriptionKey: 'zone_page_form_label_tlsa_usage_3_desc' },
            ]
          },
          {
            type: 'select', name: 'selector', labelKey: 'zone_page_form_label_tlsa_selector', required: true, tooltipKey: 'zone_page_tooltip_tlsa_selector', items: [
              { value: '0', labelKey: 'zone_page_form_label_tlsa_selector_0', descriptionKey: 'zone_page_form_label_tlsa_selector_0_desc' },
              { value: '1', labelKey: 'zone_page_form_label_tlsa_selector_1', descriptionKey: 'zone_page_form_label_tlsa_selector_1_desc' },
            ]
          },
        ],
      },
      {
        gridClassName: GRID_2COL,
        fields: [
          {
            type: 'select', name: 'matchingType', labelKey: 'zone_page_form_label_tlsa_matching', required: true, tooltipKey: 'zone_page_tooltip_tlsa_matching', items: [
              { value: '1', labelKey: 'zone_page_form_label_tlsa_matching_1' },
              { value: '2', labelKey: 'zone_page_form_label_tlsa_matching_2' },
            ]
          },
          { type: 'text', name: 'certificateData', labelKey: 'zone_page_form_label_tlsa_cert', required: true, tooltipKey: 'zone_page_tooltip_tlsa_cert', placeholder: 'abc123def456...' },
        ],
      },
    ],
    message: {
      explanationKey: 'zone_page_record_explanation_TLSA',
      descriptionKey: 'zone_page_record_description_TLSA',
    },
  },

  RP: {
    subDomainTooltipKey: 'zone_page_tooltip_subdomain',
    validation: { mbox: 'host', txt: 'host' },
    rows: [
      { gridClassName: GRID_WIDE_NARROW, fields: ['subdomain', 'ttl'] },
      {
        gridClassName: 'grid grid-cols-2 items-start gap-4',
        fields: [
          { type: 'text', name: 'mbox', labelKey: 'zone_page_form_label_rp_mbox', required: true, tooltipKey: 'zone_page_tooltip_rp_mbox', placeholder: 'admin.example.com.' },
          { type: 'text', name: 'txt', labelKey: 'zone_page_form_label_rp_txt', required: true, tooltipKey: 'zone_page_tooltip_rp_txt', placeholder: 'info.example.com.' },
        ],
      },
    ],
    message: {
      explanationKey: 'zone_page_record_explanation_RP',
      descriptionKey: 'zone_page_record_description_RP',
    },
  },

  SVCB: {
    subDomainTooltipKey: 'zone_page_tooltip_subdomain',
    validation: { target: 'host' },
    rows: [
      { gridClassName: GRID_WIDE_NARROW, fields: ['subdomain', { type: 'number', name: 'priority', labelKey: 'zone_page_form_label_svcb_priority', required: true, min: 0, max: 65535, tooltipKey: 'zone_page_tooltip_svcb_priority', placeholder: '10' }] },
      {
        gridClassName: GRID_TARGET_TTL,
        fields: [
          { type: 'text', name: 'target', labelKey: 'zone_page_form_label_svcb_target', required: true, tooltipKey: 'zone_page_tooltip_svcb_target', placeholder: 'svc.example.com.' },
          'ttl',
        ],
      },
      {
        gridClassName: 'w-full',
        fields: [
          { type: 'text', name: 'params', labelKey: 'zone_page_form_label_svcb_params', tooltipKey: 'zone_page_tooltip_svcb_params', placeholder: 'alpn=h2,h3 port=443' },
        ],
      },
    ],
    message: {
      explanationKey: 'zone_page_record_explanation_SVCB',
      descriptionKey: 'zone_page_record_description_SVCB',
      targetVarName: 'target',
      targetFallbackKey: 'zone_page_record_target_fallback_target',
    },
  },

  HTTPS: {
    subDomainTooltipKey: 'zone_page_tooltip_subdomain',
    validation: { target: 'host' },
    rows: [
      { gridClassName: GRID_WIDE_NARROW, fields: ['subdomain', { type: 'number', name: 'priority', labelKey: 'zone_page_form_label_svcb_priority', required: true, min: 0, max: 65535, tooltipKey: 'zone_page_tooltip_svcb_priority', placeholder: '10' }] },
      {
        gridClassName: GRID_TARGET_TTL,
        fields: [
          { type: 'text', name: 'target', labelKey: 'zone_page_form_label_svcb_target', required: true, tooltipKey: 'zone_page_tooltip_svcb_target', placeholder: 'svc.example.com.' },
          'ttl',
        ],
      },
      {
        gridClassName: 'w-full',
        fields: [
          { type: 'text', name: 'params', labelKey: 'zone_page_form_label_svcb_params', tooltipKey: 'zone_page_tooltip_svcb_params', placeholder: 'alpn=h2,h3 port=443' },
        ],
      },
    ],
    message: {
      explanationKey: 'zone_page_record_explanation_HTTPS',
      descriptionKey: 'zone_page_record_description_HTTPS',
      targetVarName: 'target',
      targetFallbackKey: 'zone_page_record_target_fallback_target',
    },
  },

  // ---- Mail records ----

  MX: {
    subDomainTooltipKey: 'zone_page_tooltip_subdomain',
    validation: { target: 'host' },
    rows: [
      { gridClassName: GRID_WIDE_NARROW, fields: ['subdomain', { type: 'number', name: 'priority', labelKey: 'zone_page_form_label_priority', required: true, min: 0, max: 65535, tooltipKey: 'zone_page_tooltip_mx_priority', placeholder: '10' }] },
      {
        gridClassName: GRID_TARGET_TTL,
        fields: [
          { type: 'text', name: 'target', labelKey: 'zone_page_form_label_mx_target', required: true, tooltipKey: 'zone_page_tooltip_mx_target', placeholder: 'mail.example.com.' },
          'ttl',
        ],
      },
    ],
    message: {
      explanationKey: 'zone_page_record_explanation_MX',
      descriptionKey: 'zone_page_record_description_MX',
      targetVarName: 'target',
      targetFallbackKey: 'zone_page_record_target_fallback_server',
    },
  },

  DKIM: {
    subDomainTooltipKey: 'zone_page_tooltip_subdomain',
    rows: [
      { gridClassName: 'w-full', fields: ['subdomain'] },
      {
        gridClassName: GRID_TARGET_TTL,
        fields: [
          { type: 'textarea', name: 'target', labelKey: 'zone_page_form_label_value', required: true, tooltipKey: 'zone_page_tooltip_dkim_value', placeholder: 'v=DKIM1; k=rsa; p=MIG...' },
          'ttl',
        ],
      },
    ],
    message: {
      explanationKey: 'zone_page_record_explanation_DKIM',
      descriptionKey: 'zone_page_record_description_DKIM',
    },
  },

  DMARC: {
    subDomainTooltipKey: 'zone_page_tooltip_subdomain',
    rows: [
      { gridClassName: 'w-full', fields: ['subdomain'] },
      {
        gridClassName: GRID_2COL,
        fields: [
          { type: 'text', name: 'v', labelKey: 'zone_page_form_label_dmarc_v', required: true, readOnly: true, tooltipKey: 'zone_page_tooltip_dmarc_v' },
          'ttl',
        ],
      },
      {
        gridClassName: GRID_2COL,
        fields: [
          { type: 'select', name: 'p', labelKey: 'zone_page_form_label_dmarc_p', required: true, items: DMARC_POLICY_ITEMS, tooltipKey: 'zone_page_tooltip_dmarc_p' },
          { type: 'number', name: 'pct', labelKey: 'zone_page_form_label_dmarc_pct', min: 0, max: 100, tooltipKey: 'zone_page_tooltip_dmarc_pct' },
        ],
      },
      {
        gridClassName: 'w-full',
        fields: [
          { type: 'text', name: 'rua', labelKey: 'zone_page_form_label_dmarc_rua', tooltipKey: 'zone_page_tooltip_dmarc_rua', placeholder: 'mailto:dmarc@example.com' },
        ],
      },
      {
        gridClassName: GRID_2COL,
        fields: [
          { type: 'select', name: 'sp', labelKey: 'zone_page_form_label_dmarc_sp', items: DMARC_POLICY_ITEMS, tooltipKey: 'zone_page_tooltip_dmarc_sp' },
          { type: 'select', name: 'aspf', labelKey: 'zone_page_form_label_dmarc_aspf', items: DMARC_ASPF_ITEMS, tooltipKey: 'zone_page_tooltip_dmarc_aspf' },
        ],
      },
    ],
    message: {
      explanationKey: 'zone_page_record_explanation_DMARC',
      descriptionKey: 'zone_page_record_description_DMARC',
    },
  },
};
