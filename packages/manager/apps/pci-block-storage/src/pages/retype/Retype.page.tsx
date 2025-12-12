import { useNavigate, useParams } from 'react-router-dom';
import {
  BUTTON_VARIANT,
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
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useCatalogWithPreselection } from '@/api/hooks/useCatalogWithPreselection';
import { useAttachedInstances } from '@/api/hooks/useInstance';
import { useVolumeSnapshots } from '@/api/hooks/useSnapshot';
import { Retype } from './Retype.component';
import { RetypeDetachInstance } from './RetypeDetachInstance.component';
import { RetypeDeleteSnapshots } from './RetypeDeleteSnapshots.component';
import { Button } from '@/components/button/Button';
import { useBodyScrollLock } from '@/api/hooks/useBodyScrollLock';

const RetypePage = () => {
  const { t } = useTranslation(['retype', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();

  useBodyScrollLock(true);

  const { projectId, volumeId } = useParams();
  const {
    data: volumeModelData,
    isPending: isCatalogPending,
  } = useCatalogWithPreselection(projectId, volumeId);

  const {
    data: instances,
    isPending: isInstancesPending,
    isFetching: isInstancesFetching,
  } = useAttachedInstances(projectId, volumeId, { forceReload: true });

  const {
    data: snapshots,
    isPending: isSnapshotsPending,
    isFetching: isSnapshotsFetching,
  } = useVolumeSnapshots(projectId, volumeId, { forceReload: true });

  const isPending =
    isCatalogPending ||
    isInstancesPending ||
    isInstancesFetching ||
    isSnapshotsPending ||
    isSnapshotsFetching;

  const handleOnClose = () => {
    navigate('..');
  };

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
        <div className="h-full flex flex-col">
          <Message
            color={MESSAGE_COLOR.warning}
            dismissible={false}
            className="max-w-80"
          >
            {t(
              'retype:pci_projects_project_storages_blocks_retype_cant_retype',
            )}
          </Message>

          <div className="flex gap-8 mt-auto">
            <Button
              variant={BUTTON_VARIANT.ghost}
              onClick={handleOnClose}
              type="button"
            >
              {t(`${NAMESPACES.ACTIONS}:cancel`)}
            </Button>
          </div>
        </div>
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

    if (snapshots?.length > 0) {
      return (
        <RetypeDeleteSnapshots projectId={projectId} volumeId={volumeId} />
      );
    }

    return (
      <Retype
        projectId={projectId}
        volumeId={volumeId}
        volumeModelData={volumeModelData}
      />
    );
  }, [volumeModelData, isPending, instances]);

  return (
    <div className="bg-[var(--ods-color-primary-500)] opacity-75 w-full h-full fixed top-0 left-0">
      <Drawer open>
        <DrawerContent
          position={DRAWER_POSITION.right}
          className="w-[420px] flex flex-col h-[unset] gap-4"
        >
          <legend>
            <Text preset={TEXT_PRESET.heading3}>
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
