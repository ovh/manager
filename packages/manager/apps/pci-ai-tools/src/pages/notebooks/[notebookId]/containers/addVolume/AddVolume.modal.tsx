import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, HelpCircle } from 'lucide-react';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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
  Switch,
  useToast,
} from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import { getAIApiErrorMessage } from '@/lib/apiHelper';
import { useNotebookData } from '../../Notebook.context';
import RouteModal from '@/components/route-modal/RouteModal';
import { VOLUMES_CONFIG } from '@/components/order/volumes/volume.const';
import { cn } from '@/lib/utils';
import { useGetDatastores } from '@/data/hooks/ai/data/useGetDatastores.hook';
import {
  DataStoresWithContainers,
  useGetDatastoresWithContainers,
} from '@/data/hooks/ai/data/useGetDatastoresWithContainers.hook';
import { useUpdateNotebook } from '@/data/hooks/ai/notebook/useUpdateNotebook.hook';

const AddVolume = () => {
  const { notebook, projectId } = useNotebookData();
  const datastoreQuery = useGetDatastores(projectId, notebook.spec.region);
  const containersQuery = useGetDatastoresWithContainers(
    projectId,
    notebook.spec.region,
    datastoreQuery.data,
  );
  const [selectedVolume, setSelectedVolume] = useState<
    DataStoresWithContainers
  >();
  const [inputValue, setInputValue] = useState('');
  const { t } = useTranslation('components/volumes');
  const navigate = useNavigate();
  const toast = useToast();

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
        !notebook.spec.volumes.some(
          (vol) => vol.mountPath === newMountDirectory,
        ),
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

  const containerSchema = z.object({
    datastore: datastoreRules,
    container: containerRules,
    mountDirectory: mountDirectoryRules,
    permission: permissionRules,
    cache: cacheRules,
  });

  type ValidationSchema = z.infer<typeof containerSchema>;

  const { updateNotebook, isPending } = useUpdateNotebook({
    onError: (err) => {
      toast.toast({
        title: t('addContainerToastErrorTitle'),
        variant: 'destructive',
        description: getAIApiErrorMessage(err),
      });
    },
    onUpdateSuccess: () => {
      toast.toast({
        title: t('addContainerToastSuccessTitle'),
        description: t('addContainerToastSuccessDescription'),
      });
      navigate('../');
    },
  });

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(containerSchema),
  });

  const onSubmit = form.handleSubmit((data) => {
    const volumeSpec: ai.volume.Volume[] = notebook.spec.volumes.filter(
      (vol) => vol.mountPath !== '/workspace',
    );

    volumeSpec.push({
      cache: data.cache,
      mountPath: data.mountDirectory,
      permission: data.permission,
      dataStore: {
        alias: selectedVolume.alias,
        container: data.container,
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      form.setValue('container', inputValue);
    }
  };

  return (
    <RouteModal backUrl="../" isLoading={!(containersQuery.data?.length > 0)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="add-volume-modal">
            {t('addContainerTitle')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <FormField
              control={form.control}
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
                            ? containersQuery.data.find(
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
                            {containersQuery.data.map((datastore) => (
                              <CommandItem
                                value={datastore.id}
                                key={datastore.id}
                                onSelect={() => {
                                  form.setValue('datastore', datastore.id);
                                  form.setValue('container', '');
                                  setSelectedVolume(
                                    containersQuery.data.find(
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
                            ))}
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
              control={form.control}
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
                                        form.setValue('container', container);
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
                        data-testid="git-container-input-field"
                        {...field}
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
              control={form.control}
              name="mountDirectory"
              defaultValue={''}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('mountDirectoryFieldLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="mount-directory-input-field"
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
            <FormField
              control={form.control}
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
          </form>
        </Form>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              data-testid="add-container-cancel-button"
              type="button"
              mode="outline"
            >
              {t('addContainerButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            data-testid="add-container-submit-button"
            type="button"
            disabled={isPending}
            onClick={onSubmit}
          >
            {t('addContainerButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default AddVolume;
