import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useProject } from '@ovh-ux/manager-pci-common';
import { useGetRegion } from '@/api/hooks/useRegion';
import { useStorage, useStorageEndpoint } from '@/api/hooks/useStorages';
import { useServerContainer } from '@/api/hooks/useContainer';
import { useMergedContainer } from '@/hooks/useContainerMemo';
import { useGetEncriptionAvailability } from '@/api/hooks/useGetEncriptionAvailability';
import {
  NO_ENCRYPTION_VALUE,
  ObjectContainerMode,
  MUMBAI_REGION_NAME,
} from '@/constants';

export const useContainerData = () => {
  const [searchParams] = useSearchParams();
  const { data: project } = useProject();
  const { storageId } = useParams();

  const regionName = searchParams.get('region');
  const { data: region } = useGetRegion(project?.project_id, regionName);

  const { storage: targetContainer } = useStorage(
    project?.project_id,
    storageId,
    regionName,
  );

  const { url } = useStorageEndpoint(project?.project_id, targetContainer);

  const { data: serverContainer, isPending } = useServerContainer(
    project?.project_id,
    regionName,
    targetContainer?.name,
    targetContainer?.id,
  );

  const container = useMergedContainer(
    serverContainer,
    targetContainer,
    url,
    region,
  );

  const isLocalZone = region?.type === ObjectContainerMode.LOCAL_ZONE;
  const isRightOffer = !!container?.s3StorageType;

  const { available: isEncryptionAvailable } = useGetEncriptionAvailability();
  const displayEncryptionData = isEncryptionAvailable && isRightOffer;

  const isEncrypted = useMemo(() => {
    const { sseAlgorithm } = serverContainer?.encryption || {};
    return sseAlgorithm && sseAlgorithm !== NO_ENCRYPTION_VALUE;
  }, [serverContainer?.encryption]);

  const showEnableEncryptionLink = useMemo(() => {
    return (
      isRightOffer &&
      !isLocalZone &&
      !isEncrypted &&
      region?.name !== MUMBAI_REGION_NAME
    );
  }, [isRightOffer, isLocalZone, isEncrypted, region?.name]);

  const showReplicationBanner = useMemo(() => {
    const hasEnabledRule = container?.replication?.rules?.some(
      (rule) => rule.status === 'enabled',
    );
    return (
      !hasEnabledRule &&
      [ObjectContainerMode.MONO_ZONE, ObjectContainerMode.MULTI_ZONES].includes(
        container?.regionDetails?.type,
      )
    );
  }, [container?.replication?.rules, container?.regionDetails?.type]);

  return {
    container,
    url,
    region,
    isEncrypted,
    showReplicationBanner,
    showEnableEncryptionLink,
    displayEncryptionData,
    isPending,
    isLocalZone,
    isRightOffer,
  };
};
