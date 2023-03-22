export const PRICING_MODES = {
  DEFAULT: 'default',
  DEGRESSIVITY: 'degressivity',
  MONTHLY: 'monthly',
  UPFRONT: 'upfront',
};
const LE_16 = 'le-16';
const LE_4 = 'le-4';
const LE_2 = 'le-2';
export const LE_RANGES = [LE_2, LE_4, LE_16];

export const AGREEMENTS = {
  EU: {
    termsOfService:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/2f391d2-contrat_genServices-FR-14.1.pdf',
    privacyPolicy: 'https://www.ovhcloud.com/fr/personal-data-protection/',
  },
  CA: {
    termsOfService:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/2f391d2-contrat_genServices-FR-14.1.pdf',
    privacyPolicy: 'https://www.ovhcloud.com/fr/personal-data-protection/',
  },
  US: {
    termsOfService: 'https://us.ovhcloud.com/legal/terms-of-service',
    privacyPolicy: 'https://us.ovhcloud.com/legal/privacy-policy',
  },
};

export const RANGES = {
  BESTVALUE: 'bv',
  COMFORT: 'Comfort',
  ESSENTIAL: 'Essential',
  ELITE: 'Elite',
  STARTER: 'Starter',
  VALUE: 'Value',
  LE_2,
  LE_4,
  LE_16,
};

export default { PRICING_MODES, RANGES, AGREEMENTS, LE_RANGES };
