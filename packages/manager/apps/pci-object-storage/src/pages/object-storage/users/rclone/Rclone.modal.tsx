import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  useToast,
} from '@datatr-ux/uxlib';
import { Check, ChevronsUpDown, ExternalLink } from 'lucide-react';
import RouteModal from '@/components/route-modal/RouteModal';
import { useObjectStorageData } from '../../ObjectStorage.context';
import { useRcloneForm } from './formRclone/useRcloneForm.hook';
import { ObjectStorageTypeEnum } from '@/types/Storages';
import { cn } from '@/lib/utils';
import A from '@/components/links/A.component';
import { GUIDES, getGuideUrl } from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';
import { getUserRclone } from '@/data/api/user/user.api';
import useDownload from '@/hooks/useDownload';

const Rclone = () => {
  const { t } = useTranslation('pci-object-storage/users/rclone');
  const { t: tRegions } = useTranslation('regions');
  const [open, setOpen] = useState(false);
  const { regions } = useObjectStorageData();
  const toast = useToast();
  const { projectId, userId } = useParams();
  const navigate = useNavigate();
  const locale = useLocale();
  const { download } = useDownload();
  const { form } = useRcloneForm();

  const onSubmit = form.handleSubmit(async (formValues) => {
    try {
      const rcloneData = await getUserRclone({
        projectId,
        userId: Number(userId),
        region: formValues.region,
      });
      download({ type: 'raw', data: rcloneData.content }, 'rclone.conf');
      navigate('../');
    } catch (err) {
      toast.toast({
        title: t('userRcloneDownloadFailed'),
        variant: 'error',
      });
    }
  });

  return (
    <RouteModal isLoading={!userId}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="get-user-secret-modal">
            {t('rcloneTitle')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-2">
            <div className="in-line space-x-2">
              <span>{t('rcloneDescription')}</span>
              <A
                href={getGuideUrl(GUIDES.OBJ_STO_RCLONE, locale)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="inline-flex items-center gap-2">
                  <span className="text-primary-500">{t('rcloneDoc')}</span>
                  <ExternalLink className="size-4 text-primary-500" />
                </div>
              </A>
            </div>
            <FormField
              control={form.control}
              name="rcloneType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('typeLabel')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="flex flex-row gap-4 mb-2"
                      name="access-type"
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue('region', '');
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={ObjectStorageTypeEnum.swift}
                          id="swift-radio"
                        />
                        <Label>{t('swiftTypeLabel')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={ObjectStorageTypeEnum.s3}
                          id="s3-radio"
                        />
                        <Label>{t('s3TypeLabel')}</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('regionLabel')}</FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            data-testid="select-region-button"
                            role="combobox"
                            mode="ghost"
                            className="w-full flex flex-row items-center justify-between text-sm border"
                          >
                            {field.value
                              ? tRegions(`region_${field.value}`)
                              : t('regionPlaceholder')}
                            <ChevronsUpDown className="opacity-50 size-4" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        <Command>
                          <CommandInput
                            placeholder={t('regionPlaceholder')}
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>{t('noRegionFound')}</CommandEmpty>
                            <CommandGroup>
                              {regions
                                .filter((reg) =>
                                  form.getValues('rcloneType') ===
                                  ObjectStorageTypeEnum.s3
                                    ? reg.services.find((ser) =>
                                        ser.name.startsWith('storage-s3'),
                                      )
                                    : reg.services.find(
                                        (ser) => ser.name === 'storage',
                                      ),
                                )
                                .map((region) => (
                                  <CommandItem
                                    value={region.name}
                                    key={region.name}
                                    onSelect={() => {
                                      form.setValue('region', region.name);
                                      setOpen(false);
                                    }}
                                  >
                                    {`${tRegions(`region_${region.name}`)} - (${
                                      region.name
                                    })`}
                                    <Check
                                      className={cn(
                                        'ml-auto',
                                        region.name === field.value
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-xs">{t('rcloneInfo')}</p>
            <DialogFooter className="flex justify-end">
              <DialogClose asChild>
                <Button type="button" mode="outline">
                  {t('rcloneButtonCancel')}
                </Button>
              </DialogClose>
              <Button type="submit" data-testid="s3-policy-submit-button">
                {t('rcloneButtonConfirm')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </RouteModal>
  );
};

export default Rclone;
