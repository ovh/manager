import { ManagerTile, ErrorBanner } from '@ovh-ux/manager-react-components';
import useTranslation from '@/hooks/usePermissiveTranslation.hook';
import { useProjectIdFromParams } from '@/hooks/useProjectIdFromParams';
import { useDashboardSections } from './useDashboardSections.hook';
import TileItem from './TileItem.component';
import { DashboardTile } from '@/data/types/dashboard.type';

export default function DashboardTiles() {
  const projectId = useProjectIdFromParams();
  const { t } = useTranslation('home');
  const { tiles, isLoading, isError, error } = useDashboardSections(projectId);

  if (isError) {
    return <ErrorBanner error={{ data: error }} />;
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch"
      role="region"
      aria-label={t('pci_projects_home_dashboard_tiles_aria')}
    >
      {tiles
        .filter(
          (tile: DashboardTile) =>
            tile.items.some((item) => !item.hideTileIfNoOtherItems) &&
            tile.items.length > 0,
        )
        .map((tile, tileIdx) => (
          <div
            key={tileIdx}
            className="flex flex-col h-full"
            role="region"
            aria-label={t('pci_projects_home_tile_aria', {
              title: tile.titleTranslationKey,
            })}
          >
            <div className="h-full [&>*]:h-full">
              <ManagerTile>
                {tile.titleTranslationKey && (
                  <>
                    <ManagerTile.Title>
                      {t(tile.titleTranslationKey)}
                    </ManagerTile.Title>
                    <ManagerTile.Divider />
                  </>
                )}
                {tile.items.map((item, itemIdx: number) => (
                  <TileItem
                    key={`${tileIdx}-${itemIdx}`}
                    item={item}
                    tile={tile}
                    itemIdx={itemIdx}
                    totalItems={tile.items.length}
                    isLoading={isLoading}
                  />
                ))}
              </ManagerTile>
            </div>
          </div>
        ))}
    </div>
  );
}
