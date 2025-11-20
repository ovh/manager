import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  RadioGroupItem,
  Label,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  useToast,
  RadioGroup,
} from '@datatr-ux/uxlib';
import { StorageLockConfigurationRule } from '@datatr-ux/ovhcloud-types/cloud/index';
import RouteSheet from './RouteSheet';
import storages from '@/types/Storages';
import { useGetS3 } from '@/data/hooks/s3-storage/useGetS3.hook';
import { useUpdateS3 } from '@/data/hooks/s3-storage/useUpdateS3.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';

export interface Label {
  key?: string;
  value?: string;
}

const ObjectLockOptions = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/dashboard');
  const navigate = useNavigate();
  const toast = useToast();
  const { projectId, region, s3Name } = useParams();

  // Retrieve container data
  const s3Query = useGetS3({ projectId, region, name: s3Name });

  // Update S3 storage hook
  const { updateS3Storage, isPending } = useUpdateS3({
    onError: (err) => {
      toast.toast({
        title: t('toastErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('toastSuccessTitle'),
        description: t('editObjectLockToastSuccessDescription'),
      });
      navigate('../');
    },
  });

  // Local state for object lock data
  const [objectLockData, setObjectLockData] = useState<{
    status: storages.ObjectLockStatusEnum;
    rule?: StorageLockConfigurationRule;
  }>({
    status: s3Query.data?.objectLock?.status,
    rule: s3Query.data?.objectLock?.rule,
  });

  // Handle retention option change
  const handleRetentionChange = (value: string) => {
    if (value === 'true') {
      setObjectLockData({
        status:
          s3Query.data?.objectLock.status ||
          storages.ObjectLockStatusEnum.enabled,
        rule: {
          mode: storages.ObjectLockModeEnum.governance,
          period: 'P1Y',
        },
      });
    } else {
      setObjectLockData({
        status:
          s3Query.data?.objectLock.status ||
          storages.ObjectLockStatusEnum.enabled,
      });
    }
  };

  // TODO: implement retention status selection logic

  // Submit updated container configuration
  const onSubmit = () => {
    const data = {
      projectId,
      region,
      name: s3Name,
      data: {
        objectLock: objectLockData,
      },
    };

    updateS3Storage(data);
  };

  return (
    <RouteSheet>
      <SheetContent className="flex flex-col gap-2">
        <SheetHeader>
          <SheetTitle data-testid="edit-object-lock-sheet">
            {t('editObjectLockTitle')}
          </SheetTitle>
          <SheetDescription>{t('editObjectLockDescription')}</SheetDescription>
        </SheetHeader>

        {/* Retention */}
        <RadioGroup
          value={objectLockData.rule ? 'true' : 'false'}
          onValueChange={handleRetentionChange}
        >
          <span className="text-sm font-medium" id="offsite-replication-radio">
            {t('objectLockRetentionGroupLabel')}
          </span>

          <div className="flex-1 overflow-y-auto">
            {/* Disabled retention option */}
            <div className="flex items-center gap-3">
              <RadioGroupItem
                value="false"
                id="object-lock-retention-disabled-option"
              />
              <Label htmlFor="object-lock-retention-disabled-option">
                {t(`objectLockRetentionLabelDisabled`)}
              </Label>
            </div>
          </div>

          {/* Enabled retention option */}
          <div className="flex items-center gap-3">
            <RadioGroupItem
              value="true"
              id="object-lock-retention-enabled-option"
            />
            <Label htmlFor="object-lock-retention-enabled-option">
              {t(`objectLockRetentionLabelEnabled`)}
            </Label>
          </div>
        </RadioGroup>

        <SheetFooter className="border-t p-4 ">
          <SheetClose asChild>
            <Button
              data-testid="edit-object-lock-cancel-button"
              type="button"
              mode="ghost"
            >
              {t('objectLockOptionsButtonCancel')}
            </Button>
          </SheetClose>
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={isPending}
            form="object-lock-form"
          >
            {t('objectLockOptionsButtonConfirm')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </RouteSheet>
  );
};

ObjectLockOptions.displayName = 'ObjectLockOptions';

export default ObjectLockOptions;
