import { useTranslation } from 'react-i18next';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

export const ServiceAccountsBreadcrumb = () => {
  const { t } = useTranslation(['permanent-tokens', 'service-accounts']);
  const { data: iamHref } = useNavigationGetUrl(['iam', '', {}]);
  const identitiesHref = `${iamHref}/identities`;

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
        label={t('iam_identities_service_accounts', {
          ns: 'service-accounts',
        })}
        href=""
      />
    </OdsBreadcrumb>
  );
};
