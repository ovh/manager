import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Combobox,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  DialogBody,
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
  RadioGroup,
  RadioGroupItem,
  useToast,
} from '@datatr-ux/uxlib';
import { Check, ExternalLink } from 'lucide-react';
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
        variant: 'critical',
      });
    }
  });

  return (
    <RouteModal isLoading={!userId}>
      <DialogContent variant="information">
        <DialogHeader>
          <DialogTitle data-testid="get-user-secret-modal">
            {t('rcloneTitle')}
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <Form {...form}>
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-2"
              id="download-rclone"
            >
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
                      <Combobox
                        value={`${field.value}`}
                        onValueChange={field.onChange}
                        modal
                      >
                        <ComboboxTrigger
                          ref={field.ref}
                          disabled={field.disabled}
                        >
                          <ComboboxValue
                            data-testid="select-region-button"
                            placeholder={t('regionPlaceholder')}
                            value={
                              field.value && tRegions(`region_${field.value}`)
                            }
                          />
                        </ComboboxTrigger>
                        <ComboboxContent>
                          <ComboboxInput placeholder={t('regionPlaceholder')} />
                          <ComboboxList>
                            <ComboboxEmpty>{t('noRegionFound')}</ComboboxEmpty>
                            <ComboboxGroup>
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
                                  <ComboboxItem
                                    value={region.name}
                                    key={region.name}
                                    keywords={[
                                      tRegions(`region_${region.name}`),
                                    ]}
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
                                  </ComboboxItem>
                                ))}
                            </ComboboxGroup>
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-xs">{t('rcloneInfo')}</p>
            </form>
          </Form>
        </DialogBody>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" mode="ghost">
              {t('rcloneButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            type="submit"
            data-testid="s3-policy-submit-button"
            form="download-rclone"
          >
            {t('rcloneButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default Rclone;
