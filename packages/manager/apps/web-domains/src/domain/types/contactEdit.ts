export interface TConfigurationRuleConstraint {
  operator: string;
  value?: string;
  values?: string[];
  conditions?: {
    and?: { fields: TConfigurationRuleConstraint }[];
    fields: {
      label?: string;
      and?: { label: string; type?: string; constraints: TConfigurationRuleConstraint[] }[];
      constraints: TConfigurationRuleConstraint[];
    };
  };
}

export interface TConfigurationRuleField {
  label: string;
  constraints: TConfigurationRuleConstraint[];
  placeholder?: string;
  maxLength?: number;
  hasBottomMargin?: boolean;
  isReadOnly?: boolean;
}

export interface TConfigurationRule {
  label: string;
  and?: TConfigurationRule[];
  fields: {
    and: TConfigurationRuleField[];
  };
}

export interface TTranslatedEnum {
  key: string;
  translated: string;
}

export type ContactEditFormValues = Record<
  string,
  string | { key: string; translated: string } | Date | null
>;
