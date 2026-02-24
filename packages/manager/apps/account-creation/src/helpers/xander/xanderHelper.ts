import { Country, Subsidiary } from '@ovh-ux/manager-config';
import { XANDER_CNIN_MANDATORY_COUNTRIES } from './xanderHelper.contants';

type CNINMandatoryProps = {
  defaultMandatory?: boolean | null;
  ovhSubsidiary?: Subsidiary;
  country?: Country;
};
export const isCNINMandatory = ({
  defaultMandatory,
  ovhSubsidiary,
  country,
}: CNINMandatoryProps) => {
  if (defaultMandatory === true) {
    return true;
  }
  if (!ovhSubsidiary || !country) {
    return false;
  }
  return XANDER_CNIN_MANDATORY_COUNTRIES[ovhSubsidiary]?.[country] ?? false;
};

/**
 * TODO: Remove after CNIN is visible in Xander for FR + FR territories
 */
export const isCNINVisible = ({
  ovhSubsidiary,
  country,
}: CNINMandatoryProps) => {
  if (!ovhSubsidiary || !country) {
    return false;
  }
  return XANDER_CNIN_MANDATORY_COUNTRIES[ovhSubsidiary]?.[country] ?? false;
};
