import { useTranslation } from 'react-i18next';
import { DashboardTile, ErrorBanner } from '@ovh-ux/manager-react-components';
import { useProjectIdFromParams } from '@/hooks/useProjectIdFromParams';
import { useDashboardSections } from './useDashboardSections.hook';
import TileItemContent from './TileItemContent.component';

export default function DashboardTiles() {
  const projectId = useProjectIdFromParams();
  const { t } = useTranslation('project');
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
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch"
      role="region"
      aria-label={t('pci_project_project_dashboard_tiles_aria')}
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
            className="flex flex-col h-full"
            role="region"
            aria-label={t('pci_project_project_section_aria', {
              title: section.title,
            })}
          >
            <div className="h-full [&>*]:h-full">
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
