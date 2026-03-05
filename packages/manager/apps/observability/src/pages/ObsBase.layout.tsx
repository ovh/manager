import { BaseLayout, ChangelogMenu, Notifications } from '@ovh-ux/muk';

import { CHANGELOG_LINKS } from '@/App.constants';
import { ObsBreadcrumb } from '@/components/breadcrumb/ObsBreadcrumb.component';

export type ObsBaseLayoutProps = {
  title: React.ReactNode;
  guideMenu?: React.ReactElement;
} & React.PropsWithChildren;

export default function ObsBaseLayout({ children, title, guideMenu }: ObsBaseLayoutProps) {
  return (
    <BaseLayout
      breadcrumb={<ObsBreadcrumb />}
      header={{
        title,
        guideMenu,
        changelogButton: <ChangelogMenu links={CHANGELOG_LINKS} />,
      }}
      message={<Notifications />}
    >
      {children}
    </BaseLayout>
  );
}
