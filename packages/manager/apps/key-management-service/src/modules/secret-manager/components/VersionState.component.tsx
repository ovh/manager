import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_BADGE_COLOR,
  ODS_BADGE_SIZE,
  OdsBadge as OdsBadgeType,
} from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import {
  SecretVersion,
  SecretVersionState,
} from '@secret-manager/types/secret.type';
import { VERSION_BADGE_TEST_ID } from '@secret-manager/utils/tests/version.constant';

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
  ...otherProps
}: VersionStatusParams) => {
  const { t } = useTranslation('secret-manager/common');

  const OdsBadgePropsByState: {
    [key in SecretVersion['state']]: {
      translationKey: string;
      color: ODS_BADGE_COLOR;
    };
  } = {
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

  const props = OdsBadgePropsByState[state];

  return (
    <OdsBadge
      data-testid={VERSION_BADGE_TEST_ID}
      label={props ? t(props.translationKey) : state}
      size={size}
      color={props?.color || ODS_BADGE_COLOR.neutral}
      {...otherProps}
    />
  );
};
