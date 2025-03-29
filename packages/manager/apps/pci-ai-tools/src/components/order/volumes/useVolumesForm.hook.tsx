import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { OrderVolumes } from '@/types/orderFunnel';
import { VOLUMES_CONFIG } from './volume.const';
import ai from '@/types/AI';

export interface UseVolumesFormProps {
  selectedVolumesList: OrderVolumes[];
}
export const useVolumesForm = ({
  selectedVolumesList,
}: UseVolumesFormProps) => {
  const { t } = useTranslation('ai-tools/components/volumes');

  const datastoreRules = z.string().min(VOLUMES_CONFIG.datastore.min);

  const containerRules = datastoreRules.regex(
    VOLUMES_CONFIG.container.pattern,
    {
      message: t('containerErrorFormat'),
    },
  );
  const mountDirectoryRules = z
    .string()
    .min(VOLUMES_CONFIG.mountDirectory.min)
    .max(VOLUMES_CONFIG.mountDirectory.max)
    .regex(VOLUMES_CONFIG.mountDirectory.pattern, {
      message: t('mountPathErrorFormat'),
    })
    .refine(
      (newMountDirectory) =>
        !selectedVolumesList.some((vol) => vol.mountPath === newMountDirectory),
      {
        message: t('duplicateMountPathError'),
      },
    )
    .refine(
      (data) => {
        if (data === VOLUMES_CONFIG.mountDirectory.savedPath) {
          return false;
        }
        return true;
      },
      { message: t('mountPathError') },
    );

  const permissionRules = z.nativeEnum(ai.VolumePermissionEnum);

  const cacheRules = z.boolean();

  const gitUrlRules = z
    .string()
    .min(VOLUMES_CONFIG.gitUrl.min)
    .max(VOLUMES_CONFIG.gitUrl.max)
    .regex(RegExp(VOLUMES_CONFIG.gitUrl.pattern), {
      message: t('gitUrlErrorFormat'),
    });

  const containerSchema = z.object({
    datastore: datastoreRules,
    container: containerRules,
    mountDirectory: mountDirectoryRules,
    permission: permissionRules,
    cache: cacheRules,
  });

  const publicGitSchema = z.object({
    gitUrl: gitUrlRules,
    mountDirectory: mountDirectoryRules,
    permission: permissionRules,
  });

  const containerForm = useForm({
    resolver: zodResolver(containerSchema),
  });

  const publicGitForm = useForm({
    resolver: zodResolver(publicGitSchema),
  });

  return { containerForm, publicGitForm };
};
