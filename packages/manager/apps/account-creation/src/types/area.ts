import { OdsSelectChangeEventDetail, OdsSelectCustomEvent } from "@ovhcloud/ods-components";
import { Rule } from "./rule";

export type AREA_COUNTRY = "AU" | "CA" | "ES" | "IE" | "IN" | "IT" | "QC"

export type AreaSelectProps = {
  name: string;
  value?: string;
  onChange: ((event: OdsSelectCustomEvent<OdsSelectChangeEventDetail>) => void);
  onBlur: ((event: OdsSelectCustomEvent<void>) => void);
  country: AREA_COUNTRY;
  area: Pick<Rule, 'in' | 'mandatory'>;
  error?: string;
  defaultValue?: string;
  disabled?: boolean;
  isLoading?: boolean;
};
