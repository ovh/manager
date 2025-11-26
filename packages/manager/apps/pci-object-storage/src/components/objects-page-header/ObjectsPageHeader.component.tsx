import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@datatr-ux/uxlib';
import { Plus } from 'lucide-react';
import Guides from '@/components/guides/Guides.component';
import SearchBar from '@/components/search-bar/SearchBar.component';

interface NormalizedObject {
  key: string;
  versionId?: string;
}

interface ObjectsPageHeaderProps {
  objects: NormalizedObject[];
  children?: ReactNode;
}

const ObjectsPageHeader = ({ objects, children }: ObjectsPageHeaderProps) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const navigate = useNavigate();

  return (
    <>
      <div
        data-testid="containers-guides-container"
        className="flex justify-between w-full items-center"
      >
        <h2>{t('objectTitle')}</h2>
        <div className="flex flex-wrap justify-end gap-1">
          <Guides selectors={['allGuides', 'gettingStarted']} />
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={() => navigate('./add-object')}>
          <Plus className="size-6" />
          {t('addNewObject')}
        </Button>
        <div className="flex items-center space-x-2">
          {children}
          <SearchBar objects={objects} />
        </div>
      </div>
    </>
  );
};

export default ObjectsPageHeader;
