import { SecretVersionState } from '@secret-manager/types/secret.type';
import { VERSION_BADGE_TEST_ID } from '@secret-manager/utils/tests/version.constants';
import { useTranslation } from 'react-i18next';

import { Badge, BadgeColor, BadgeProp } from '@ovhcloud/ods-react';

const colors: Record<SecretVersionState, BadgeColor> = {
  ACTIVE: 'success',
  DEACTIVATED: 'warning',
  DELETED: 'critical',
};

export type VersionStatusParams = {
  state: SecretVersionState;
  'data-testid'?: string;
} & Omit<BadgeProp, 'color' | 'children'>;

export const VersionState = ({
  state,
  size = 'md',
  'data-testid': dataTestId,
  ...rest
}: VersionStatusParams) => {
  const { t } = useTranslation('secret-manager');

  const labels: Record<SecretVersionState, string> = {
    ACTIVE: t('version_state_active'),
    DEACTIVATED: t('version_state_deactivated'),
    DELETED: t('version_state_deleted'),
  };

  return (
    <Badge
      data-testid={dataTestId || VERSION_BADGE_TEST_ID}
      size={size}
      color={colors[state] || 'neutral'}
      {...rest}
    >
      {labels[state] || state}
    </Badge>
  );
};
