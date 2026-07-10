import { APP_NAME } from '@/tracking.constants';

export const FEATURES = {
  APP: APP_NAME,
  COMPUTE_SPECIAL_OFFER_BANNER: `${APP_NAME}:compute-special-offer-banner`,
  HPC_VCFAAS_VCDA: `${APP_NAME}:vcda`,
  HPC_VCFAAS_VCDA_TERMINATION: `${APP_NAME}:vcda:termination`,
  HPC_VCFAAS_VCDA_AUTHORIZED_IPS: `${APP_NAME}:vcda:authorized-ips`,
};
