import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HelpCircle } from 'lucide-react';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from '@datatr-ux/uxlib';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import { useNotebookData } from '../../Notebook.context';
import RouteModal from '@/components/route-modal/RouteModal';
import { VOLUMES_CONFIG } from '@/components/order/volumes/volume.const';
import ai from '@/types/AI';
import { useUpdateNotebook } from '@/data/hooks/ai/notebook/useUpdateNotebook.hook';

const AddVolume = () => {
  const { notebook, projectId } = useNotebookData();
  const { t } = useTranslation('ai-tools/components/public-git');
  const { t: tForm } = useTranslation('components/volumes');
  const navigate = useNavigate();
  const toast = useToast();

  const mountDirectoryRules = z
    .string()
    .min(VOLUMES_CONFIG.mountDirectory.min)
    .max(VOLUMES_CONFIG.mountDirectory.max)
    .regex(VOLUMES_CONFIG.mountDirectory.pattern, {
      message: tForm('mountPathErrorFormat'),
    })
    .refine(
      (newMountDirectory) =>
        !notebook.spec.volumes.some(
          (vol) => vol.mountPath === newMountDirectory,
        ),
      {
        message: tForm('duplicateMountPathError'),
      },
    )
    .refine(
      (data) => {
        if (data === VOLUMES_CONFIG.mountDirectory.savedPath) {
          return false;
        }
        return true;
      },
      { message: tForm('mountPathError') },
    );

  const permissionRules = z.nativeEnum(ai.VolumePermissionEnum);

  const gitUrlRules = z
    .string()
    .min(VOLUMES_CONFIG.gitUrl.min)
    .max(VOLUMES_CONFIG.gitUrl.max)
    .regex(RegExp(VOLUMES_CONFIG.gitUrl.pattern), {
      message: tForm('gitUrlErrorFormat'),
    });

  const publicGitSchema = z.object({
    gitUrl: gitUrlRules,
    mountDirectory: mountDirectoryRules,
    permission: permissionRules,
  });

  type ValidationSchema = z.infer<typeof publicGitSchema>;

  const { updateNotebook, isPending } = useUpdateNotebook({
    onError: (err) => {
      toast.toast({
        title: t('publicGitToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onUpdateSuccess: () => {
      toast.toast({
        title: t('publicGitToastSuccessTitle'),
        description: t('addPublicGitToastSuccessDescription'),
      });
      navigate('../');
    },
  });

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(publicGitSchema),
  });

  const onSubmit = form.handleSubmit((data) => {
    const volumeSpec: ai.volume.Volume[] = notebook.spec.volumes.filter(
      (vol) => vol.mountPath !== '/workspace',
    );

    volumeSpec.push({
      cache: false,
      mountPath: data.mountDirectory,
      permission: data.permission,
      volumeSource: {
        publicGit: {
          url: data.gitUrl,
        },
      },
    });

    const updateNotebookInfo: ai.notebook.NotebookUpdate = {
      volumes: volumeSpec,
    };
    updateNotebook({
      projectId,
      notebookId: notebook.id,
      notebookInfo: updateNotebookInfo,
    });
  });

  return (
    <RouteModal backUrl="../">
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="add-public-git-modal">
            {t('addPublicGitTitle')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="gitUrl"
              defaultValue={''}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tForm('publicGitUrlFieldLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="public-git-url-input-field"
                      {...field}
                      placeholder="https://git-public-repo.git"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mountDirectory"
              defaultValue={''}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tForm('mountDirectoryFieldLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="public-git-mount-path-input-field"
                      {...field}
                      placeholder="/workspace/demo"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permission"
              defaultValue={ai.VolumePermissionEnum.RO}
              render={({ field }) => (
                <FormItem>
                  <div className="inline space-x-2">
                    <FormLabel>{tForm('permissionsFieldLabel')}</FormLabel>
                    <Popover>
                      <PopoverTrigger>
                        <HelpCircle className="size-4" />
                      </PopoverTrigger>
                      <PopoverContent className="text-sm">
                        <p>{tForm('permissionDescription')}</p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ai.VolumePermissionEnum).map(
                          (option) => (
                            <SelectItem key={option} value={option}>
                              {tForm(`permission_${option}`)}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="add-public-git-cancel-button"
              type="button"
              mode="outline"
            >
              {t('publicGitButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="add-public-git-submit-button"
            type="button"
            disabled={isPending}
            onClick={onSubmit}
          >
            {t('addPublicGitButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default AddVolume;
