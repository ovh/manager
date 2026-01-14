import { BaseLayout, Breadcrumb, ChangelogMenu, Notifications } from '@ovh-ux/muk';

import { AppConfig, CHANGELOG_LINKS, appName } from '@/App.constants';

export type ObsBaseLayoutProps = {
  title: React.ReactNode;
  guideMenu?: React.ReactElement;
} & React.PropsWithChildren;

export default function ObsBaseLayout({ children, title, guideMenu }: ObsBaseLayoutProps) {
  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb appName={appName} rootLabel={AppConfig.rootLabel} hideRootLabel={true} />
      }
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
