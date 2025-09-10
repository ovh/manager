import { ManagerTile } from '@ovh-ux/manager-react-components';

import { DashboardTileItem } from '../DashboardTile.types';
import StandardItem from './StandardItem.component';
import useTranslation from '@/hooks/usePermissiveTranslation.hook';

type DashboardTileProps = {
  items: DashboardTileItem[];
  titleTranslationKey: string;
  isUSRegion?: boolean;
};

export default function DashboardTile({
  items,
  titleTranslationKey,
  isUSRegion = false,
}: DashboardTileProps) {
  const { t } = useTranslation('project');

  // Hide section for US region if needed (like community section)
  if (isUSRegion && titleTranslationKey === 'community') {
    return null;
  }

  return (
    <div className="col-sm-4 mb-4">
      <div className="h-full [&>*]:h-full">
        <ManagerTile>
          <ManagerTile.Title>{t(titleTranslationKey)}</ManagerTile.Title>
          <ManagerTile.Divider />
          {items.map((item, index) => (
            <ManagerTile.Item key={index}>
              <StandardItem {...item} />
            </ManagerTile.Item>
          ))}
        </ManagerTile>
      </div>
    </div>
  );
}
