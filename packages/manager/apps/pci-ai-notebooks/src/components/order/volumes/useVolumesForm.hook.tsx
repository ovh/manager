import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { OrderVolumes } from '@/types/orderFunnel';
import { VOLUMES_CONFIG } from './volume.const';
import * as ai from '@/types/cloud/project/ai';

export interface UseVolumesFormProps {
  selectedVolumesList: OrderVolumes[];
}
export const useVolumesForm = ({
  selectedVolumesList,
}: UseVolumesFormProps) => {
  const { t } = useTranslation('components/volumes');

  const gitBranchRules = z.string().optional();

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
    gitBranch: gitBranchRules,
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
