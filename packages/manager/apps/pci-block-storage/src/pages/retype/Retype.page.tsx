import { useParams } from 'react-router-dom';
import {
  Drawer,
  DRAWER_POSITION,
  DrawerContent,
  Message,
  MESSAGE_COLOR,
  Skeleton,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useCatalogWithPreselection } from '@/api/hooks/useCatalogWithPreselection';
import { useAttachedInstances } from '@/api/hooks/useInstance';
import { Retype } from './Retype.component';
import { RetypeDetachInstance } from './RetypeDetachInstance.component';

const RetypePage = () => {
  const { t } = useTranslation(['retype']);

  const { projectId, volumeId } = useParams();
  const {
    data: volumeModelData,
    preselectedEncryptionType,
    isPending: isCatalogPending,
  } = useCatalogWithPreselection(projectId, volumeId);

  const {
    data: instances,
    isPending: isInstancesPending,
  } = useAttachedInstances(projectId, volumeId);

  const isPending = isCatalogPending || isInstancesPending;

  const displayedForm = useMemo(() => {
    if (isPending) {
      return (
        <div className="flex flex-col gap-8" data-testid="retypePage-loader">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      );
    }

    if (!volumeModelData || volumeModelData?.length === 0) {
      return (
        <Message
          color={MESSAGE_COLOR.warning}
          dismissible={false}
          className="max-w-80"
        >
          {t('retype:pci_projects_project_storages_blocks_retype_cant_retype')}
        </Message>
      );
    }

    if (instances?.length > 0 && instances[0] !== undefined) {
      return (
        <RetypeDetachInstance
          instance={instances[0]}
          projectId={projectId}
          volumeId={volumeId}
        />
      );
    }

    return (
      <Retype
        volumeModelData={volumeModelData}
        preselectedEncryptionType={preselectedEncryptionType}
      />
    );
  }, [volumeModelData, preselectedEncryptionType, isPending, instances]);

  return (
    <div className="bg-[var(--ods-color-primary-500)] opacity-75 w-full h-full absolute top-0 left-0">
      <Drawer open>
        <DrawerContent
          position={DRAWER_POSITION.right}
          className="w-fit flex flex-col h-[unset] gap-4"
        >
          <legend>
            <Text preset={TEXT_PRESET.heading2}>
              {t('retype:pci_projects_project_storages_blocks_retype_title')}
            </Text>
          </legend>
          {displayedForm}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default RetypePage;
