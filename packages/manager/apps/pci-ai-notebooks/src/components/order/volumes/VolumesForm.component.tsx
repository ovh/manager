import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
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

import { DataStoresWithContainers } from '@/hooks/api/ai/datastore/useGetDatastoresWithContainers.hook';
import { FormVolumes, OrderVolumes } from '@/types/orderFunnel';
import { VOLUMES_CONFIG } from './volume.const';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import OvhLink from '@/components/links/OvhLink.component';
import { useNotebookData } from '@/pages/notebooks/[notebookId]/Notebook.context';

interface VolumesFormProps {
  configuredVolumesList: DataStoresWithContainers[];
  selectedVolumesList: OrderVolumes[];
  onChange: (newVolumesList: OrderVolumes[]) => void;
  disabled?: boolean;
}

const VolumeForm = React.forwardRef<HTMLInputElement, VolumesFormProps>(
  ({ configuredVolumesList, selectedVolumesList, onChange, disabled }, ref) => {
    const { t } = useTranslation('pci-ai-notebooks/components/volumes');
    const { projectId } = useNotebookData();
    const [selectedVolume, setSelectedVolume] = useState<
      DataStoresWithContainers
    >();

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
          !selectedVolumesList.some(
            (vol) => vol.mountPath === newMountDirectory,
          ),
        {
          message: t('duplicateMountPathError'),
        },
      )
      .refine(
        (data) => {
          if (data === '/workspace') {
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

    const onSubmit: SubmitHandler<FormVolumes> = (data: FormVolumes) => {
      const newVolumes: OrderVolumes = {
        cache: data.cache,
        mountPath: data.mountDirectory,
        permission: data.permission,
      };

      if (data.gitUrl) {
        newVolumes.publicGit = {
          url: data.gitUrl,
        };
      } else {
        newVolumes.dataStore = {
          alias: selectedVolume.alias,
          container:
            selectedVolume.type === ai.DataStoreTypeEnum.git
              ? data.gitBranch
              : selectedVolume.container,
          type: selectedVolume.type,
        };
      }

      const newVolumesList = [...selectedVolumesList, newVolumes];
      containerForm.reset();
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
        <h5>{t('containerTitle')}</h5>
        {configuredVolumesList.length > 0 ? (
          <>
            <Form {...containerForm}>
              <div className="flex flex-col w-full md:flex-row md:items-start gap-2">
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
                            configuredVolumesList.find(
                              (vol) => vol.id === value,
                            ),
                          );
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t('containerFieldPlaceholder')}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(configuredVolumesList).map(
                            (dataStore) => (
                              <SelectItem
                                key={dataStore.id}
                                value={dataStore.id}
                              >
                                {dataStore.id}
                              </SelectItem>
                            ),
                          )}
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
                          <FormLabel data-testid="ssh-key-name-field-label">
                            {t('gitBranchFieldLabel')}
                          </FormLabel>
                          <FormControl>
                            <Input
                              data-testid="ssh-key-input-field"
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
                        <FormLabel data-testid="ssh-key-name-field-label">
                          {t('mountDirectoryFieldLabel')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            data-testid="ssh-key-input-field"
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
                    data-testid="ssh-key-label-add-button"
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
            <ul>
              {selectedVolumesList
                .filter((vol) => !vol.publicGit)
                .map((volume, index) => (
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
                        <span> - </span>
                        <span>{volume.permission}</span>
                        <span> - </span>
                        <span>{volume.mountPath}</span>
                        <span> - </span>
                        <span>{volume.cache ? 'cache' : 'no cache'}</span>
                      </div>
                      <Button
                        data-testid={`volume-label-remove-button-${index}`}
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
        ) : (
          <div>
            <p>{t('noContainerDescription')}</p>
            <div className="flex flex-col gap-2 mt-2">
              <OvhLink
                application="public-cloud"
                path={`#/pci/projects/${projectId}/ai-dashboard`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('datastoreLinkLabel')}
              </OvhLink>
              <OvhLink
                application="public-cloud"
                path={`#/pci/projects/${projectId}/storages/objects`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('objectStorageLinkLabel')}
              </OvhLink>
            </div>
          </div>
        )}
        <h5>{t('publicGitRepoTitle')}</h5>
        <Form {...publicGitForm}>
          <div className="flex flex-col w-full md:flex-row md:items-start gap-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full">
              <FormField
                control={publicGitForm.control}
                name="gitUrl"
                defaultValue={''}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="ssh-key-name-field-label">
                      {t('publicGitUrlFieldLabel')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        data-testid="ssh-key-input-field"
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
                    <FormLabel data-testid="ssh-key-name-field-label">
                      {t('mountDirectoryFieldLabel')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        data-testid="ssh-key-input-field"
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
              <Button
                data-testid="ssh-key-label-add-button"
                variant={'ghost'}
                onClick={publicGitForm.handleSubmit(onSubmit)}
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
        <ul>
          {selectedVolumesList
            .filter((vol) => vol.publicGit)
            .map((volume, index) => (
              <li
                key={volume.mountPath}
                className="flex items-center ml-5 text-sm"
              >
                <div className="flex flex-row items-center gap-2">
                  <GitBranchIcon className="mt-1 size-4 text-orange-600" />
                  <div>
                    <span>{volume.publicGit.url}</span>
                    <span> - </span>
                    <span>{volume.permission}</span>
                    <span> - </span>
                    <span>{volume.mountPath}</span>
                  </div>
                  <Button
                    data-testid={`public-git-remove-button-${index}`}
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

VolumeForm.displayName = 'VolumeForm';

export default VolumeForm;
