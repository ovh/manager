import { useTranslation } from 'react-i18next';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

export function ManageTokensBreadcrumb() {
  const { t } = useTranslation('manage-tokens');
  const { data: iamHref } = useNavigationGetUrl(['', '/iam', {}]);
  const { data: identitiesHref } = useNavigationGetUrl([
    '',
    '/iam/identities',
    {},
  ]);
  const { data: localUserHref } = useNavigationGetUrl([
    '',
    '/iam/identities/users',
    {},
  ]);

  return (
    <OdsBreadcrumb>
      <OdsBreadcrumbItem
        label={t('iam_user_breadcrumb_iam')}
        href={iamHref as string}
      />
      <OdsBreadcrumbItem
        label={t('iam_user_breadcrumb_identities')}
        href={identitiesHref as string}
      />
      <OdsBreadcrumbItem
        label={t('iam_user_breadcrumb_local_users')}
        href={localUserHref as string}
      />
      <OdsBreadcrumbItem
        label={t('iam_user_breadcrumb_manage_tokens')}
        href={''}
      />
    </OdsBreadcrumb>
  );
}
