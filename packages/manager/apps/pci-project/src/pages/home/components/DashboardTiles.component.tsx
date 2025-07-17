import { useTranslation } from 'react-i18next';
import { DashboardTile, ErrorBanner } from '@ovh-ux/manager-react-components';
import { useDashboardSections } from './useDashboardSections.hook';
import TileItemContent from './TileItemContent.component';

export default function DashboardTiles({ projectId }: { projectId: string }) {
  const { t } = useTranslation('home');
  const { sections, isLoading, isError, error } = useDashboardSections(
    projectId,
  );

  if (isError) {
    return (
      <ErrorBanner
        error={{
          data: error,
          status: undefined,
          headers: undefined,
        }}
      />
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      role="region"
      aria-label={t('dashboard_tiles_aria')}
    >
      {sections.map((section, sectionIdx) => {
        // Add credit link for billing section
        const items = [...section.items];
        if (section.type === 'billing') {
          items.push({
            label: '',
            description: '',
            link: '',
            price: '',
            validUntil: '',
            isVoucherLink: true,
          });
        }

        return (
          <div
            key={sectionIdx}
            className="space-y-4 flex flex-col h-full"
            role="region"
            aria-label={t('section_aria', { title: section.title })}
          >
            <div className="flex flex-col min-h-[400px] h-full">
              <DashboardTile
                title={section.title}
                items={items.map((item, itemIdx) => ({
                  id: `${sectionIdx}-${itemIdx}`,
                  value: (
                    <TileItemContent
                      item={item}
                      section={section}
                      isLoading={isLoading}
                      projectId={projectId}
                    />
                  ),
                }))}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
