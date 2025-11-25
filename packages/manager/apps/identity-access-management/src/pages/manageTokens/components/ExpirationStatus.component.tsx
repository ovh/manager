import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { IamUserToken } from '@/data/api/iam-users';

export function ExpirationStatus({ token }: { token: IamUserToken }) {
  const { t } = useTranslation('manage-tokens');
  const isExpired = useMemo(() => {
    // NOTE: if expireAt is an invalid Date, we consider isExpired to be false.
    const expireAt = new Date(token.expiresAt);
    return expireAt.getTime() <= Date.now();
  }, [token]);
  const status = isExpired ? 'expired' : 'active';
  return (
    <OdsBadge
      label={t(`iam_user_token_expiration_badge_${status}`)}
      color={isExpired ? 'critical' : 'success'}
    />
  );
}
