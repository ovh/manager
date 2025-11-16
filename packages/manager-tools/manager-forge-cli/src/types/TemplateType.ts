type TemplatePrimitive = string | number | boolean | null;

export type TemplateValue = TemplatePrimitive | TemplateObject | TemplateValue[];

export interface TemplateObject {
  [key: string]: TemplateValue;
}
