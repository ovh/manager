export type SelectItemConfig = {
  readonly value: string;
  readonly labelKey: string;
  /** Optional i18n key for a short description shown in smaller text. */
  readonly descriptionKey?: string;
};

/** Properties shared by all field types. */
type BaseFieldConfig = {
  readonly name: string;
  readonly labelKey: string;
  readonly required?: boolean;
  readonly tooltipKey?: string;
  /** Hardcoded placeholder text for the input. */
  readonly placeholder?: string;
  /** Disable this field when the given sibling field is non-empty. */
  readonly disabledWhenFilled?: string;
  /** When true, the field is displayed but not editable. */
  readonly readOnly?: boolean;
};

export type TextFieldConfig = BaseFieldConfig & {
  readonly type: 'text';
  readonly maxLength?: number;
};

export type NumberFieldConfig = BaseFieldConfig & {
  readonly type: 'number';
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly suffixKey?: string;
};

export type SelectFieldConfig = BaseFieldConfig & {
  readonly type: 'select';
  readonly items: readonly SelectItemConfig[];
};

export type TextareaFieldConfig = BaseFieldConfig & {
  readonly type: 'textarea';
};

export type GroupFieldConfig = {
  readonly type: 'group';
  readonly gridClassName: string;
  readonly children: readonly FieldConfig[];
};

export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | SelectFieldConfig
  | TextareaFieldConfig;

export type FieldOrGroup = FieldConfig | GroupFieldConfig;

export type FormRowConfig = {
  readonly gridClassName: string;
  readonly fields: readonly (FieldConfig | GroupFieldConfig | 'subdomain' | 'ttl')[];
  /** Optional i18n key for a section heading rendered before this row. */
  readonly headingKey?: string;
  /** When true, a <Divider> is rendered before the optional heading / row. */
  readonly dividerBefore?: boolean;
};

export type MessageConfig = {
  readonly explanationKey: string;
  readonly descriptionKey: string;
  /**
   * Name of the interpolation variable that receives the current `target` value.
   * e.g. `'ip'` for A/AAAA, `'target'` for most others.
   * If omitted, no target variable is injected (description only uses `domain`).
   */
  readonly targetVarName?: string;
  /** i18n key for the placeholder shown when `target` is empty. */
  readonly targetFallbackKey?: string;
  /** When true, the `domain` variable uses `serviceName` instead of `fullDomain`. */
  readonly usesServiceName?: boolean;
};

export type RecordFormConfig = {
  readonly rows: readonly FormRowConfig[];
  readonly message: MessageConfig;
  readonly subDomainTooltipKey: string;
  readonly subDomainRequired?: boolean;
  /** Per-field validation kind (ipv4, ipv6, host). Used by schema builder. */
  readonly validation?: Readonly<Partial<Record<string, FieldValidationKind>>>;
};

export type FieldValidationKind = 'ipv4' | 'ipv6' | 'host';
