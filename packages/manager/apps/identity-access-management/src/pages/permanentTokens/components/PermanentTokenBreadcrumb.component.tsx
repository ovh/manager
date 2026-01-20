import { useTranslation } from 'react-i18next';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

export function PermanentTokensBreadcrumb() {
  const { t } = useTranslation('permanent-tokens');
  const { data: iamHref } = useNavigationGetUrl(['iam', '', {}]);
  const identitiesHref = `${iamHref}/identities`;
  const localUserHref = `${identitiesHref}/users`;

  return (
    <OdsBreadcrumb>
      <OdsBreadcrumbItem
        label={t('iam_user_breadcrumb_iam')}
        href={iamHref as string}
      />
      <OdsBreadcrumbItem
        label={t('iam_user_breadcrumb_identities')}
        href={identitiesHref}
      />
      <OdsBreadcrumbItem
        label={t('iam_user_breadcrumb_local_users')}
        href={localUserHref}
      />
      <OdsBreadcrumbItem
        label={t('iam_user_breadcrumb_manage_tokens')}
        href={''}
      />
    </OdsBreadcrumb>
  );
}
