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
  Label,
  RadioGroup,
  RadioGroupItem,
  useToast,
  FieldLabel,
} from '@datatr-ux/uxlib';
import { ExternalLink } from 'lucide-react';
import RouteModal from '@/components/route-modal/RouteModal';
import { useObjectStorageData } from '../../ObjectStorage.context';
import { useRcloneForm } from './formRclone/useRcloneForm.hook';
import { ObjectStorageTypeEnum } from '@/types/Storages';
import user from '@/types/User';
import A from '@/components/links/A.component';
import { GUIDES, getGuideUrl } from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';
import { getUserRclone } from '@/data/api/user/user.api';
import { FormField } from '@/components/form-field/FormField.component';
import RegionWithFlag from '@/components/region-with-flag/RegionWithFlag.component';
import useDownload from '@/hooks/useDownload.hook';

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
      const service =
        formValues.rcloneType === ObjectStorageTypeEnum.s3
          ? user.RCloneServiceEnum['storage-s3']
          : user.RCloneServiceEnum.storage;
      const rcloneData = await getUserRclone({
        projectId,
        userId: Number(userId),
        region: formValues.region,
        service,
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
          <DialogTitle data-testid="rclone-modal">
            {t('rcloneTitle')}
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
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
            <FormField name="rcloneType" form={form}>
              {(field) => (
                <>
                  <FieldLabel>{t('typeLabel')}</FieldLabel>
                  <RadioGroup
                    className="flex flex-row gap-4 mb-2"
                    name="access-type"
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue('region', undefined);
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
                </>
              )}
            </FormField>

            <FormField name="region" form={form}>
              {(field) => (
                <>
                  <FieldLabel>{t('regionLabel')}</FieldLabel>

                  <Combobox
                    value={`${field.value}`}
                    onValueChange={field.onChange}
                    modal
                  >
                    <ComboboxTrigger
                      ref={field.ref}
                      disabled={field.disabled}
                      data-testid="select-region-trigger"
                    >
                      <ComboboxValue
                        placeholder={t('regionPlaceholder')}
                        value={
                          field.value && (
                            <RegionWithFlag
                              region={regions.find(
                                (r) => r.name === field.value,
                              )}
                            />
                          )
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
                                keywords={[tRegions(`region_${region.name}`)]}
                                className="flex gap-2"
                              >
                                <RegionWithFlag region={region} />
                              </ComboboxItem>
                            ))}
                        </ComboboxGroup>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </>
              )}
            </FormField>

            <p className="text-xs">{t('rcloneInfo')}</p>
          </form>
        </DialogBody>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" mode="ghost">
              {t('rcloneButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            type="submit"
            data-testid="rclone-submit-button"
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
