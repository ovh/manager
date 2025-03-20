import React from 'react';
import { SubmitHandler } from 'react-hook-form';
import { GitBranchIcon, HelpCircle, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Button,
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
} from '@datatr-ux/uxlib';
import { useVolumesForm } from './useVolumesForm.hook';
import { FormVolumes, OrderVolumes } from '@/types/orderFunnel';
import ai from '@/types/AI';
import { VOLUMES_CONFIG } from './volume.const';

interface PublicGitFormProps {
  selectedVolumesList: OrderVolumes[];
  onChange: (newVolumesList: OrderVolumes[]) => void;
  disabled?: boolean;
}

const PublicGitForm = React.forwardRef<HTMLInputElement, PublicGitFormProps>(
  ({ selectedVolumesList, onChange, disabled }, ref) => {
    const { t } = useTranslation('ai-tools/components/volumes');
    const { publicGitForm } = useVolumesForm({
      selectedVolumesList,
    });

    const onSubmit: SubmitHandler<FormVolumes> = (data: FormVolumes) => {
      const newPublicGit: OrderVolumes = {
        cache: data.cache,
        mountPath: data.mountDirectory,
        permission: data.permission,
        publicGit: {
          url: data.gitUrl,
        },
      };

      const newVolumesList = [...selectedVolumesList, newPublicGit];
      publicGitForm.reset();
      onChange(newVolumesList);
    };

    const removeVolume = (mountPath: string) => {
      const newVolumesList = selectedVolumesList.filter(
        (vol) => vol.mountPath !== mountPath,
      );
      onChange(newVolumesList);
    };

    return (
      <>
        <Form {...publicGitForm}>
          <div
            className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-[1fr_1fr_1fr_auto]"
            data-testid="public-git-form-container"
          >
            <FormField
              control={publicGitForm.control}
              name="gitUrl"
              defaultValue={''}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('publicGitUrlFieldLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="public-git-url-input-field"
                      {...field}
                      ref={ref}
                      placeholder="https://git-public-repo.git"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={publicGitForm.control}
              name="mountDirectory"
              defaultValue={''}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('mountDirectoryFieldLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="public-git-mount-path-input-field"
                      {...field}
                      ref={ref}
                      placeholder="/workspace/demo"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={publicGitForm.control}
              name="permission"
              defaultValue={ai.VolumePermissionEnum.RO}
              render={({ field }) => (
                <FormItem>
                  <div className="inline space-x-2">
                    <FormLabel>{t('permissionsFieldLabel')}</FormLabel>
                    <Popover>
                      <PopoverTrigger>
                        <HelpCircle className="size-4" />
                      </PopoverTrigger>
                      <PopoverContent className="text-sm">
                        <p>{t('permissionDescription')}</p>
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
                              {t(`permission_${option}`)}
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
            <Button
              data-testid="public-git-add-button"
              size="menu"
              variant="menu"
              mode="menu"
              className="shrink-0 mt-8 ml-2"
              onClick={publicGitForm.handleSubmit(onSubmit)}
              disabled={
                disabled ||
                selectedVolumesList.length >= VOLUMES_CONFIG.maxVolumes
              }
            >
              <Plus className="size-6" />
            </Button>
          </div>
        </Form>
        <ul data-testid="public-git-list">
          {selectedVolumesList
            .filter((vol) => vol.publicGit)
            .map((volume) => (
              <li
                key={volume.mountPath}
                className="flex items-center ml-5 text-sm"
              >
                <div className="flex flex-row items-center gap-2">
                  <GitBranchIcon className="mt-1 size-4 text-orange-600" />
                  <div>
                    <span>{volume.publicGit.url}</span>
                    <span> - {volume.permission}</span>
                    <span> - {volume.mountPath}</span>
                  </div>
                  <Button
                    data-testid={`public-git-remove-button-${volume.mountPath}`}
                    className="text-red-500 rounded-full px-2 hover:text-red-500 h-8 w-8"
                    mode="ghost"
                    type="button"
                    onClick={() => removeVolume(volume.mountPath)}
                    disabled={disabled}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </li>
            ))}
        </ul>
        <p data-testid="volumes-configured-labels">
          {t('numberOfConfiguredVolumes', {
            count: selectedVolumesList.length,
            max: VOLUMES_CONFIG.maxVolumes,
            context: `${selectedVolumesList.length}`,
          })}
        </p>
      </>
    );
  },
);

PublicGitForm.displayName = 'PublicGitForm';

export default PublicGitForm;
