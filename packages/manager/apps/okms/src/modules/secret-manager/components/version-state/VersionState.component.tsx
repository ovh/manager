import { SecretVersionState } from '@secret-manager/types/secret.type';
import { VERSION_BADGE_TEST_ID } from '@secret-manager/utils/tests/version.constants';
import { useTranslation } from 'react-i18next';

import { Badge, BadgeProp } from '@ovhcloud/ods-react';

type StateVariant = {
  translationKey: string;
  color: BadgeProp['color'];
};

const variants: Record<SecretVersionState, StateVariant> = {
  ACTIVE: {
    translationKey: 'version_state_active',
    color: 'success',
  },
  DEACTIVATED: {
    translationKey: 'version_state_deactivated',
    color: 'warning',
  },
  DELETED: {
    translationKey: 'version_state_deleted',
    color: 'critical',
  },
};

export type VersionStatusParams = Omit<BadgeProp, 'color' | 'size' | 'children'> & {
  state: SecretVersionState;
  size?: BadgeProp['size'];
  'data-testid'?: string;
};

export const VersionState = ({
  state,
  size = 'md',
  'data-testid': dataTestId,
  ...rest
}: VersionStatusParams) => {
  const { t } = useTranslation('secret-manager');

  return (
    <Badge
      data-testid={dataTestId || VERSION_BADGE_TEST_ID}
      size={size}
      color={variants[state].color}
      {...rest}
    >
      {t(variants[state].translationKey)}
    </Badge>
  );
};
