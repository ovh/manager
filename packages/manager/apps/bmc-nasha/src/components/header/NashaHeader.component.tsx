import { useMemo } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseLayout, Breadcrumb, ChangelogMenu, GuideMenu } from '@ovh-ux/muk';
import { useUser } from '@/hooks/useUser';
import {
  CHANGELOG_LINKS,
  CHANGELOG_CHAPTERS,
} from '@/constants/Changelog.constants';
import { GUIDES_URL } from '@/constants/Guides.constants';
import { appName } from '@/App.constants';

interface NashaHeaderProps {
  title: string;
  subtitle?: string;
  tabs?: ReactElement;
  children?: ReactNode;
}

/**
 * Header component for Nasha pages with breadcrumb, changelog and guides
 * Wraps BaseLayout with common Nasha configuration
 */
export function NashaHeader({
  title,
  subtitle,
  tabs,
  children,
}: NashaHeaderProps) {
  const { t } = useTranslation('dashboard');
  const user = useUser();

  const guideUrl = useMemo(() => {
    if (!user?.ovhSubsidiary) {
      return GUIDES_URL.DEFAULT;
    }
    return (
      GUIDES_URL[user.ovhSubsidiary as keyof typeof GUIDES_URL] ||
      GUIDES_URL.DEFAULT
    );
  }, [user?.ovhSubsidiary]);

  const guideItems = useMemo(
    () => [
      {
        id: 1,
        href: guideUrl,
        target: '_blank',
        label: t('nasha_dashboard_guides_title', {
          defaultValue: 'Guides NAS-HA',
        }),
      },
    ],
    [guideUrl, t],
  );

  const breadcrumb = useMemo(
    () => <Breadcrumb appName={appName} rootLabel="NAS-HA" />,
    [],
  );

  return (
    <BaseLayout
      breadcrumb={breadcrumb}
      header={{
        title,
        changelogButton: (
          <ChangelogMenu
            links={CHANGELOG_LINKS}
            chapters={[...CHANGELOG_CHAPTERS]}
          />
        ),
        guideMenu: <GuideMenu items={guideItems} />,
      }}
      subtitle={subtitle}
      tabs={tabs}
    >
      {children}
    </BaseLayout>
  );
}
