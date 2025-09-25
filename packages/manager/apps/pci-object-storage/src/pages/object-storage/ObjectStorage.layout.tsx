import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardTabs from './_components/ObjectStorageTabs.component';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';

export default function DashboardLayout() {
  const { t } = useTranslation('pci-object-storage');
  return (
    <>
      <div
        data-testid="containers-guides-container"
        className="flex justify-between w-full items-center"
      >
        <h2>{t('title')}</h2>
        <div className="flex flex-wrap justify-end gap-1">
          <RoadmapChangelog />
          {/* <Guides
            section={GuideSections.landing}
            noEngineFilter
            onGuideClick={(guide) =>
              track(TRACKING.servicesList.guideClick(guide.title))
            }
          /> */}
        </div>
      </div>
      <p>{t('description')}</p>
      <DashboardTabs />
      <div className="space-y-2">
        <Outlet />
      </div>
    </>
  );
}
