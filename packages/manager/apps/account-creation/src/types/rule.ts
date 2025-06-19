export type Rule = {
  defaultValue: string | null;
  examples: string[] | null;
  fieldName: string | null;
  in: string[] | null;
  mandatory: boolean;
  maxLength: number | null;
  minLength: number | null;
  prefix: string | null;
  regularExpression: string | null;
};
