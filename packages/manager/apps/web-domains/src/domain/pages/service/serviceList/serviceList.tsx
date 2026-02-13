import DomainsList from '@/common/components/DomainsList/domainsList';
import DomainGuideButton from '@/common/components/DomainsList/guideButton';
import { domainsListApiURl } from '@/common/constants';
import { ChangelogButton } from '@ovh-ux/manager-react-components';
import { BaseLayout, Notifications, useNotifications } from '@ovh-ux/muk';
import { useTranslation } from 'react-i18next';
import { changelogLinks } from '@/domain/constants/serviceDetail';

export default function ServiceList() {
  const { t } = useTranslation(['domain', 'web-domains/error']);
  const { notifications } = useNotifications();

  return (
    <BaseLayout
      header={{
        title: t('title'),
        changelogButton: <ChangelogButton links={changelogLinks} />,
        guideMenu: <DomainGuideButton />,
      }}
      message={notifications.length ? <Notifications /> : null}
    >
      <DomainsList baseRoute={domainsListApiURl} />
    </BaseLayout>
  );
}
