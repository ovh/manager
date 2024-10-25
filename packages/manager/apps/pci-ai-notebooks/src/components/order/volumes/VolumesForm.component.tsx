import React, { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { GitBranchIcon, MinusCircle, Package, PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { n } from 'vitest/dist/reporters-P7C2ytIv';
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
import { useToast } from '@/components/ui/use-toast';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import * as sshkey from '@/types/cloud/sshkey';
import { DataStoresWithContainers } from '@/hooks/api/ai/datastore/useGetDatastoresWithContainers.hook';
import { FormVolumes, OrderVolumes } from '@/types/orderFunnel';
import { VOLUMES_CONFIG } from './volume.const';
import { Switch } from '@/components/ui/switch';

interface VolumesFormProps {
  configuredVolumesList: DataStoresWithContainers[];
  selectedVolumesList: OrderVolumes[];
  onChange: (newVolumesList: OrderVolumes[]) => void;
  disabled?: boolean;
}

const VolumeForm = React.forwardRef<HTMLInputElement, VolumesFormProps>(
  ({ configuredVolumesList, selectedVolumesList, onChange, disabled }, ref) => {
    const { t } = useTranslation('pci-ai-notebooks/components/volumes');
    const [selectedVolume, setSelectedVolume] = useState<
      DataStoresWithContainers
    >(configuredVolumesList[0]);
    const volumesSchema = z.object({
      gitBranch: z.string().optional(),
      mountDirectory: z
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
            console.log(data);
            if (data === '/workspace') {
              return false;
            }
            return true;
          },
          { message: t('mountPathError') },
        ),
      permission: z.nativeEnum(ai.VolumePermissionEnum),
      cache: z.boolean(),
    });

    const form = useForm({
      resolver: zodResolver(volumesSchema),
    });

    const onSubmit: SubmitHandler<FormVolumes> = (data: FormVolumes) => {
      const newVolumes: OrderVolumes = {
        dataStore: {
          alias: selectedVolume.alias,
          container:
            selectedVolume.type === ai.DataStoreTypeEnum.git
              ? data.gitBranch
              : selectedVolume.container,
          type: selectedVolume.type,
        },
        cache: data.cache,
        mountPath: data.mountDirectory,
        permission: data.permission,
      };

      const newVolumesList = [...selectedVolumesList, newVolumes];
      form.reset();
      onChange(newVolumesList);
    };

    const removeVolume = (indexToRemove: number) => {
      const newVolumesList = selectedVolumesList.filter(
        (_, index) => index !== indexToRemove,
      );
      onChange(newVolumesList);
    };

    return (
      <Form {...form}>
        <div className="flex w-full items-start gap-2">
          <div
            className={`grid ${
              selectedVolume.type === ai.DataStoreTypeEnum.git
                ? `grid-cols-4`
                : `grid-cols-3`
            }  gap-2 w-full`}
          >
            <FormItem>
              <FormLabel>{t('containerFieldLabel')}</FormLabel>
              <FormControl>
                <Select
                  value={selectedVolume.id}
                  onValueChange={(value) => {
                    form.setValue('container', value);
                    setSelectedVolume(
                      configuredVolumesList.find((vol) => vol.id === value),
                    );
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
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

            {selectedVolume.type === ai.DataStoreTypeEnum.git && (
              <FormField
                control={form.control}
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
              control={form.control}
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
              control={form.control}
              name="permission"
              defaultValue={ai.VolumePermissionEnum.RO}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('permissionsFieldLabel')}</FormLabel>
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
          </div>
          <FormField
            control={form.control}
            name="cache"
            defaultValue={false}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('cachingFieldLabel')}</FormLabel>
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
            onClick={form.handleSubmit(onSubmit)}
            disabled={
              disabled ||
              selectedVolumesList.length >= VOLUMES_CONFIG.maxVolumes
            }
            className="mt-[1.875rem] text-primary rounded-full p-2 ml-2 hover:text-primary"
          >
            <PlusCircle />
          </Button>
        </div>
        <ul>
          {selectedVolumesList.map((volume, index) => (
            <li key={volume.mountPath} className="flex items-center">
              <Button
                data-testid={`ssh-key-label-remove-button-${index}`}
                className="text-red-500 rounded-full p-2 ml-2 hover:text-red-500 h-8 w-8"
                variant={'ghost'}
                type="button"
                onClick={() => removeVolume(index)}
                disabled={disabled}
              >
                <MinusCircle />
              </Button>
              <div className="flex flex-row gap-2">
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
                {volume.dataStore.type === ai.DataStoreTypeEnum.git ? (
                  <GitBranchIcon className="mt-1 size-4 text-orange-600" />
                ) : (
                  <Package className="mt-1 size-4 text-emerald-600" />
                )}
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
      </Form>
    );
  },
);

VolumeForm.displayName = 'VolumeForm';

export default VolumeForm;
