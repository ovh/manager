import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

export function ServiceAccountsTabs() {
  const { t } = useTranslation('service-accounts');
  const { data: iamHref } = useNavigationGetUrl(['iam', '', {}]);
  const usersHref = `${iamHref}/identities/users`;
  const groupsHref = `${iamHref}/identities/user-groups`;
  const ssoHref = `${iamHref}/identities/sso`;

  return (
    <OdsTabs className="mb-4">
      <OdsTab className="py-4">
        <NavLink className="no-underline" to={usersHref}>
          {t('iam_identities_users')}
        </NavLink>
      </OdsTab>
      <OdsTab className="py-4">
        <NavLink className="no-underline" to={groupsHref}>
          {t('iam_identities_user_groups')}
        </NavLink>
      </OdsTab>
      <OdsTab className="py-4" isSelected={true}>
        <NavLink className="no-underline" to="">
          {t('iam_identities_service_accounts')}
        </NavLink>
      </OdsTab>
      <OdsTab className="py-4">
        <NavLink className="no-underline" to={ssoHref}>
          {t('iam_identities_sso')}
        </NavLink>
      </OdsTab>
    </OdsTabs>
  );
}
