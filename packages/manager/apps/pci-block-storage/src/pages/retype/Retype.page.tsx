import { useParams } from 'react-router-dom';
import {
  Drawer,
  DRAWER_POSITION,
  DrawerContent,
  Skeleton,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useCatalogWithPreselection } from '@/api/hooks/useCatalogWithPreselection';
import { RetypeForm } from './RetypeForm.component';

export const RetypePage = () => {
  const { t } = useTranslation(['retype']);

  const { projectId, volumeId } = useParams();
  const {
    data: volumeModelData,
    preselectedEncryptionType,
    isPending,
  } = useCatalogWithPreselection(projectId, volumeId);

  return (
    <div className="bg-[var(--ods-color-primary-500)] opacity-75 w-full h-full absolute top-0 left-0">
      <Drawer open>
        <DrawerContent
          position={DRAWER_POSITION.right}
          className="w-fit flex flex-col h-[unset]"
        >
          <legend>
            <Text preset={TEXT_PRESET.heading2}>
              {t('retype:pci_projects_project_storages_blocks_retype_title')}
            </Text>
          </legend>
          {isPending ? (
            <div
              className="flex flex-col gap-8"
              data-testid="retypePage-loader"
            >
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          ) : (
            <RetypeForm
              volumeModelData={volumeModelData}
              preselectedEncryptionType={preselectedEncryptionType}
            />
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default RetypePage;
