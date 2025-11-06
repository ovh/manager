import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_BADGE_COLOR,
  ODS_BADGE_SIZE,
  OdsBadge as OdsBadgeType,
} from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { SecretVersionState } from '@secret-manager/types/secret.type';
import { VERSION_BADGE_TEST_ID } from '@secret-manager/utils/tests/version.constants';

type StateVariant = {
  translationKey: string;
  color: ODS_BADGE_COLOR;
};

const variants: Record<SecretVersionState, StateVariant> = {
  ACTIVE: {
    translationKey: 'version_state_active',
    color: ODS_BADGE_COLOR.success,
  },
  DEACTIVATED: {
    translationKey: 'version_state_deactivated',
    color: ODS_BADGE_COLOR.warning,
  },
  DELETED: {
    translationKey: 'version_state_deleted',
    color: ODS_BADGE_COLOR.critical,
  },
};

export type VersionStatusParams = Omit<
  OdsBadgeType,
  'render' | 'color' | 'label' | 'size'
> & {
  state: SecretVersionState;
  size?: ODS_BADGE_SIZE;
  'data-testid'?: string;
};

export const VersionState = ({
  state,
  size = ODS_BADGE_SIZE.md,
  'data-testid': dataTestId,
  ...rest
}: VersionStatusParams) => {
  const { t } = useTranslation('secret-manager');

  return (
    <OdsBadge
      data-testid={dataTestId || VERSION_BADGE_TEST_ID}
      label={t(variants[state].translationKey)}
      size={size}
      color={variants[state].color}
      {...rest}
    />
  );
};
