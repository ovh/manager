import React from 'react';
import {
  ODS_BADGE_COLOR,
  ODS_BADGE_SIZE,
  OdsBadge as OdsBadgeType,
} from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { SecretVersionState } from '@secret-manager/types/secret.type';
import { VERSION_BADGE_TEST_ID } from '@secret-manager/utils/tests/version.constants';
import { useSecretVersionStateLabel } from '@secret-manager/hooks/useSecretVersionStateLabel';

type StateVariant = {
  color: ODS_BADGE_COLOR;
};

const variants: Record<SecretVersionState, StateVariant> = {
  ACTIVE: {
    color: ODS_BADGE_COLOR.success,
  },
  DEACTIVATED: {
    color: ODS_BADGE_COLOR.warning,
  },
  DELETED: {
    color: ODS_BADGE_COLOR.critical,
  },
};

export type VersionStatusParams = Omit<
  OdsBadgeType,
  'render' | 'color' | 'label' | 'size'
> & {
  state: SecretVersionState;
  size?: ODS_BADGE_SIZE;
};

export const VersionState = ({
  state,
  size = ODS_BADGE_SIZE.md,
  ...rest
}: VersionStatusParams) => {
  const stateLabel = useSecretVersionStateLabel(state);

  return (
    <OdsBadge
      data-testid={VERSION_BADGE_TEST_ID}
      label={stateLabel}
      size={size}
      color={variants[state].color}
      {...rest}
    />
  );
};
