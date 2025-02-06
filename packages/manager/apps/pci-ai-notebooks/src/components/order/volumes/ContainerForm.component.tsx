import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import {
  GitBranchIcon,
  HelpCircle,
  Package,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import * as ai from '@/types/cloud/project/ai';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormVolumes, OrderVolumes } from '@/types/orderFunnel';
import { VOLUMES_CONFIG } from './volume.const';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useVolumesForm } from './useVolumesForm.hook';
import { DataStoresWithContainers } from '@/hooks/api/ai/datastore/useGetDatastoresWithContainers.hook';
import { Switch } from '@/components/ui/switch';

interface ContainerFormProps {
  configuredVolumesList: DataStoresWithContainers[];
  selectedVolumesList: OrderVolumes[];
  onChange: (newVolumesList: OrderVolumes[]) => void;
  disabled?: boolean;
}

const ContainerForm = React.forwardRef<HTMLInputElement, ContainerFormProps>(
  ({ configuredVolumesList, selectedVolumesList, onChange, disabled }, ref) => {
    const { t } = useTranslation('components/volumes');
    const [selectedVolume, setSelectedVolume] = useState<
      DataStoresWithContainers
    >();

    const { containerForm } = useVolumesForm({
      selectedVolumesList,
    });

    const onSubmit: SubmitHandler<FormVolumes> = (data: FormVolumes) => {
      const newContainer: OrderVolumes = {
        cache: data.cache,
        mountPath: data.mountDirectory,
        permission: data.permission,
        dataStore: {
          alias: selectedVolume.alias,
          container:
            selectedVolume.type === ai.DataStoreTypeEnum.git
              ? data.gitBranch
              : selectedVolume.container,
          type: selectedVolume.type,
        },
      };

      const newVolumesList = [...selectedVolumesList, newContainer];
      containerForm.reset();
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
        <Form {...containerForm}>
          <div
            className="flex flex-col w-full md:flex-row md:items-start gap-2"
            data-testid="datastore-form-container"
          >
            <div
              className={`grid ${
                selectedVolume?.type === ai.DataStoreTypeEnum.git
                  ? `grid-cols-2 md:grid-cols-4`
                  : `grid-cols-2 md:grid-cols-3`
              } gap-2 w-full`}
            >
              <FormItem>
                <div className="inline space-x-2">
                  <FormLabel>{t('containerFieldLabel')}</FormLabel>
                  <Popover>
                    <PopoverTrigger>
                      <HelpCircle className="size-4" />
                    </PopoverTrigger>
                    <PopoverContent className="text-sm">
                      <p>{t('containerDescription')}</p>
                    </PopoverContent>
                  </Popover>
                </div>
                <FormControl>
                  <Select
                    value={selectedVolume?.id}
                    onValueChange={(value) => {
                      containerForm.setValue('container', value);
                      setSelectedVolume(
                        configuredVolumesList.find((vol) => vol.id === value),
                      );
                    }}
                  >
                    <SelectTrigger data-testid="select-container-trigger">
                      <SelectValue
                        placeholder={t('containerFieldPlaceholder')}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(configuredVolumesList).map((dataStore) => (
                        <SelectItem key={dataStore.id} value={dataStore.id}>
                          {dataStore.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>

              {selectedVolume?.type === ai.DataStoreTypeEnum.git && (
                <FormField
                  control={containerForm.control}
                  name="gitBranch"
                  defaultValue={''}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('gitBranchFieldLabel')}</FormLabel>
                      <FormControl>
                        <Input
                          data-testid="git-branch-input-field"
                          {...field}
                          ref={ref}
                          placeholder="develop"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={containerForm.control}
                name="mountDirectory"
                defaultValue={''}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('mountDirectoryFieldLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="mount-directory-input-field"
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
                control={containerForm.control}
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
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
            </div>
            <div className="flex flex-row justify-around">
              <FormField
                control={containerForm.control}
                name="cache"
                defaultValue={false}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row gap-2">
                      <FormLabel className="mt-2">
                        {t('cachingFieldLabel')}
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger>
                          <HelpCircle className="size-4 mt-1" />
                        </PopoverTrigger>
                        <PopoverContent className="text-sm">
                          <p>{t('cachingDescription')}</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <FormControl>
                      <div className="pt-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                data-testid="datastore-add-button"
                variant={'ghost'}
                onClick={containerForm.handleSubmit(onSubmit)}
                disabled={
                  disabled ||
                  selectedVolumesList.length >= VOLUMES_CONFIG.maxVolumes
                }
                className="mt-[1.875rem] text-primary rounded-full p-2 ml-2 hover:text-primary"
              >
                <PlusCircle />
              </Button>
            </div>
          </div>
        </Form>
        <ul data-testid="datastore-list">
          {selectedVolumesList
            .filter((vol) => !vol.publicGit)
            .map((volume) => (
              <li
                key={volume.mountPath}
                className="flex items-center ml-5 text-sm"
              >
                <div className="flex flex-row items-center gap-2">
                  {volume.dataStore.type === ai.DataStoreTypeEnum.git ? (
                    <GitBranchIcon className="mt-1 size-4" />
                  ) : (
                    <Package className="mt-1 size-4 text-primary-700" />
                  )}
                  <div>
                    <span>{volume.dataStore.alias}</span>
                    {volume.dataStore.container && (
                      <>
                        <span> - </span>
                        <span
                          className="truncate max-w-96"
                          title={volume.dataStore.container}
                        >
                          {volume.dataStore.container}
                        </span>
                      </>
                    )}
                    <span> - {volume.permission}</span>
                    <span> - {volume.mountPath}</span>
                    <span> - {volume.cache ? 'cache' : 'no cache'}</span>
                  </div>
                  <Button
                    data-testid={`datatore-remove-button-${volume.mountPath}`}
                    className="text-red-500 rounded-full px-2 hover:text-red-500 h-8 w-8"
                    variant={'ghost'}
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
      </>
    );
  },
);

ContainerForm.displayName = 'ContainerForm';

export default ContainerForm;
