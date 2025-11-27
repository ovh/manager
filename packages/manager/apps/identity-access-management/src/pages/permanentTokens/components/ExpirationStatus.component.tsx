import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { IamUserToken } from '@/data/api/iam-users';

const color = {
  active: ODS_BADGE_COLOR.success,
  expired: ODS_BADGE_COLOR.critical,
  invalid: ODS_BADGE_COLOR.warning,
};

export function ExpirationStatus({ token }: { token: IamUserToken }) {
  const { t } = useTranslation('permanent-tokens');
  const status = useMemo(() => {
    // If there is no expiration date, it's considered active
    if (!token.expiresAt) {
      return 'active';
    }

    // The simplest way to check an invalid date is by testing for NaN
    const expireAt = new Date(token.expiresAt);
    const timestamp = expireAt.getTime();
    if (Number.isNaN(timestamp)) {
      return 'invalid';
    }

    return timestamp <= Date.now() ? 'expired' : 'active';
  }, [token]);

  return (
    <OdsBadge
      label={t(`iam_user_token_expiration_badge_${status}`)}
      color={color[status] || ODS_BADGE_COLOR.warning}
    />
  );
}
