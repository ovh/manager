import { useTranslation } from 'react-i18next';
import { ManagerTile, ErrorBanner } from '@ovh-ux/manager-react-components';
import { useProjectIdFromParams } from '@/hooks/useProjectIdFromParams';
import { useDashboardSections } from './useDashboardSections.hook';
import TileItem from './TileItem.component';

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
      {sections.map((section, sectionIdx) => (
        <div
          key={sectionIdx}
          className="flex flex-col h-full"
          role="region"
          aria-label={t('pci_project_project_section_aria', {
            title: section.title,
          })}
        >
          <div className="h-full [&>*]:h-full">
            <ManagerTile>
              {section.title && (
                <>
                  <ManagerTile.Title>{section.title}</ManagerTile.Title>
                  <ManagerTile.Divider />
                </>
              )}
              {section.items.map((item, itemIdx) => (
                <TileItem
                  key={`${sectionIdx}-${itemIdx}`}
                  item={item}
                  section={section}
                  itemIdx={itemIdx}
                  totalItems={section.items.length}
                  isLoading={isLoading}
                  projectId={projectId}
                />
              ))}
            </ManagerTile>
          </div>
        </div>
      ))}
    </div>
  );
}
