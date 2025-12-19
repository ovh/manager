type TemplatePrimitive = string | number | boolean | null;

export type TemplateValue = TemplatePrimitive | TemplateObject | TemplateValue[];

export interface TemplateObject {
  [key: string]: TemplateValue;
}

export interface TemplateSelectorConfig<
  Variant extends string = string,
  Extension extends string = string,
> {
  /** Folder containing templates */
  targetDir: string;

  /** All variant names that exist in template folder */
  variants: Variant[];

  /** The variant the user selected */
  selected: Variant;

  /** Final output file name (ex: "package.json", ".eslintrc.json") */
  finalName: `${string}.${Extension}`;

  /**
   * Pattern to match template files.
   * Use "{variant}" as placeholder.
   * Examples:
   * - "package-{variant}.json"
   * - "eslint-{variant}.config.mjs"
   */
  templatePattern: string;
}
