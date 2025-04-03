import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import {
  Check,
  ChevronsUpDown,
  GitBranchIcon,
  HelpCircle,
  Package,
  Plus,
  Trash2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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
  Switch,
} from '@datatr-ux/uxlib';
import { FormVolumes, OrderVolumes } from '@/types/orderFunnel';
import { VOLUMES_CONFIG } from './volume.const';
import { useVolumesForm } from './useVolumesForm.hook';
import { cn } from '@/lib/utils';
import ai from '@/types/AI';
import { DataStoresWithContainers } from '@/data/hooks/ai/data/useGetDatastoresWithContainers.hook';

interface ContainerFormProps {
  configuredVolumesList: DataStoresWithContainers[];
  selectedVolumesList: OrderVolumes[];
  onChange: (newVolumesList: OrderVolumes[]) => void;
  disabled?: boolean;
}

const ContainerForm = React.forwardRef<HTMLInputElement, ContainerFormProps>(
  ({ configuredVolumesList, selectedVolumesList, onChange, disabled }, ref) => {
    const { t } = useTranslation('ai-tools/components/volumes');
    const [inputValue, setInputValue] = useState('');
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
          container: data.container,
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        containerForm.setValue('container', inputValue);
      }
    };

    return (
      <>
        <Form {...containerForm}>
          <div
            className="flex flex-col w-full md:flex-row md:items-start gap-2"
            data-testid="datastore-form-container"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
              <FormField
                control={containerForm.control}
                name="datastore"
                defaultValue={''}
                render={({ field }) => (
                  <FormItem>
                    <div className="inline space-x-2">
                      <FormLabel>{t('datastoreFieldLabel')}</FormLabel>

                      <Popover>
                        <PopoverTrigger>
                          <HelpCircle className="size-4" />
                        </PopoverTrigger>
                        <PopoverContent className="text-sm">
                          <p>{t('datastoreDescription')}</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            data-testid="select-datastore-container-button"
                            role="combobox"
                            mode="ghost"
                            className="w-full flex flex-row items-center justify-between text-sm border"
                          >
                            {field.value
                              ? configuredVolumesList.find(
                                  (ds) => ds.id === field.value,
                                )?.id
                              : t('datastorePlaceholder')}
                            <ChevronsUpDown className="opacity-50 size-4" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Command>
                          <CommandInput
                            placeholder={t('inputDatastorePlaceholder')}
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>{t('noDatastoreLabel')}</CommandEmpty>
                            <CommandGroup>
                              {Object.values(configuredVolumesList).map(
                                (datastore) => (
                                  <CommandItem
                                    value={datastore.id}
                                    key={datastore.id}
                                    onSelect={() => {
                                      containerForm.setValue(
                                        'datastore',
                                        datastore.id,
                                      );
                                      containerForm.setValue('container', '');
                                      setSelectedVolume(
                                        configuredVolumesList.find(
                                          (vol) => vol.id === datastore.id,
                                        ),
                                      );
                                    }}
                                  >
                                    {datastore.id}
                                    <Check
                                      className={cn(
                                        'ml-auto',
                                        datastore.id === field.value
                                          ? 'opacity-100'
                                          : 'opacity-0',
                                      )}
                                    />
                                  </CommandItem>
                                ),
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={containerForm.control}
                name="container"
                defaultValue={''}
                render={({ field }) => (
                  <FormItem>
                    <div className="inline space-x-2">
                      <FormLabel>
                        {selectedVolume?.type === ai.DataStoreTypeEnum.git
                          ? t('gitBranchFieldLabel')
                          : t('containerFieldLabel')}
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger>
                          <HelpCircle className="size-4" />
                        </PopoverTrigger>
                        <PopoverContent className="text-sm">
                          <p>
                            {selectedVolume?.type === ai.DataStoreTypeEnum.git
                              ? t('gitBranchFieldHelper')
                              : t('containerFieldHelper')}
                          </p>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <FormControl>
                      {selectedVolume?.container?.length > 0 ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                data-testid="select-container-combobox"
                                role="combobox"
                                mode="ghost"
                                className="w-full flex flex-row items-center justify-between text-sm border"
                              >
                                {field.value
                                  ? field.value
                                  : t('containerPlaceholder')}
                                <ChevronsUpDown className="opacity-50 size-4" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent>
                            <Command>
                              <CommandInput
                                placeholder={t('inputContainerPlaceholder')}
                                className="h-9"
                              />
                              <CommandList>
                                <CommandGroup>
                                  {Object.values(selectedVolume.container).map(
                                    (container) => (
                                      <CommandItem
                                        value={container}
                                        key={container}
                                        onSelect={() => {
                                          containerForm.setValue(
                                            'container',
                                            container,
                                          );
                                        }}
                                      >
                                        {container}
                                        <Check
                                          className={cn(
                                            'ml-auto',
                                            container === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0',
                                          )}
                                        />
                                      </CommandItem>
                                    ),
                                  )}
                                  <CommandItem>
                                    <Input
                                      className="text-sm"
                                      placeholder={t(
                                        'newContainerPlaceholderInput',
                                      )}
                                      value={inputValue}
                                      onChange={(e) =>
                                        setInputValue(e.target.value)
                                      }
                                      onKeyDown={handleKeyDown}
                                    ></Input>
                                  </CommandItem>
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <Input
                          className="text-sm"
                          data-testid="git-container-input-field"
                          {...field}
                          ref={ref}
                          placeholder={
                            selectedVolume?.type === ai.DataStoreTypeEnum.git
                              ? 'develop'
                              : 'dastore-container'
                          }
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={containerForm.control}
                name="mountDirectory"
                defaultValue={''}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('mountDirectoryFieldLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        className="text-sm"
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
            <div className="flex flex-row justify-around md:flex-col gap-2">
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
                size="menu"
                variant="menu"
                mode="menu"
                className="shrink-0 mt-8 ml-2"
                onClick={containerForm.handleSubmit(onSubmit)}
                disabled={
                  disabled ||
                  selectedVolumesList.length >= VOLUMES_CONFIG.maxVolumes
                }
              >
                <Plus className="size-6" />
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
                    <span>{volume.dataStore.type}</span>
                    <span> - {volume.dataStore.alias}</span>
                    <span
                      className="truncate max-w-96"
                      title={volume.dataStore.container}
                    >
                      {' '}
                      - {volume.dataStore.container}
                    </span>
                    <span> - {volume.permission}</span>
                    <span> - {volume.mountPath}</span>
                    <span> - {volume.cache ? 'cache' : 'no cache'}</span>
                  </div>
                  <Button
                    data-testid={`datatore-remove-button-${volume.mountPath}`}
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
      </>
    );
  },
);

ContainerForm.displayName = 'ContainerForm';

export default ContainerForm;
