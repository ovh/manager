import { ManagerTile } from '@ovh-ux/manager-react-components';

import { DashboardItem } from '@/data/types/dashboard.type';
import StandardItem from './StandardItem.component';
import useTranslation from '@/hooks/usePermissiveTranslation.hook';

type DashboardTileProps = {
  items: DashboardItem[];
  titleTranslationKey: string;
  isUSRegion?: boolean;
};

export default function DashboardTile({
  items,
  titleTranslationKey,
  isUSRegion = false,
}: DashboardTileProps) {
  const { t } = useTranslation('home');

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
