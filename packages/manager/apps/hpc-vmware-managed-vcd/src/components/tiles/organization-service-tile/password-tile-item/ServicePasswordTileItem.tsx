import { useHref, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Links } from '@ovh-ux/manager-react-components';
import { subRoutes, urls } from '@/routes/routes.constant';

export default function ServicePasswordTileItem({
  isDisabled,
}: {
  isDisabled: boolean;
}) {
  const { id } = useParams();
  const { t } = useTranslation('dashboard');
  const passwordHref = useHref(
    urls.resetPassword.replace(subRoutes.dashboard, id),
  );

  return (
    <div className="flex items-center gap-x-3">
      <Links
        href={passwordHref}
        isDisabled={isDisabled}
        label={t('managed_vcd_dashboard_password_renew')}
        className="[&::part(label)]:whitespace-break-spaces"
      />
    </div>
  );
}
