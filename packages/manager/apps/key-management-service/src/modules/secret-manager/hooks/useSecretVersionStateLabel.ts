import { useTranslation } from 'react-i18next';
import { SecretVersionState } from '@secret-manager/types/secret.type';

type StateVariant = {
  translationKey: string;
};

const variants: Record<SecretVersionState, StateVariant> = {
  ACTIVE: {
    translationKey: 'version_state_active',
  },
  DEACTIVATED: {
    translationKey: 'version_state_deactivated',
  },
  DELETED: {
    translationKey: 'version_state_deleted',
  },
};

export const useSecretVersionStateLabel = (state: SecretVersionState) => {
  const { t } = useTranslation('secret-manager/common');

  return t(variants[state].translationKey);
};
