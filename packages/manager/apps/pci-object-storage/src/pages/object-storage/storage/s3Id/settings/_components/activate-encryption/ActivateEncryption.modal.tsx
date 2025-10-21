import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EncryptionAlgorithmEnum } from '@datatr-ux/ovhcloud-types/cloud/storage/EncryptionAlgorithmEnum';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@datatr-ux/uxlib';
import { AlertCircle, ExternalLink } from 'lucide-react';
import RouteModal from '@/components/route-modal/RouteModal';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useGetS3 } from '@/data/hooks/s3-storage/useGetS3.hook';
import { useUpdateS3 } from '@/data/hooks/s3-storage/useUpdateS3.hook';
import A from '@/components/links/A.component';
import { GUIDES, getGuideUrl } from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';

const ActivateEncryption = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/settings');
  const navigate = useNavigate();
  const toast = useToast();
  const { projectId, region, s3Name } = useParams();
  const s3Query = useGetS3({ projectId, region, name: s3Name });
  const locale = useLocale();

  const { udpateS3Storage, isPending } = useUpdateS3({
    onError: (err) => {
      toast.toast({
        title: t('toastErrorTitle'),
        variant: 'destructive',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('toastSuccessTitle'),
        description: t('activateEncryptionToastSuccessDescription'),
      });
      navigate('../');
    },
  });

  const onSubmit = () => {
    udpateS3Storage({
      projectId,
      region,
      name: s3Name,
      data: {
        encryption: {
          sseAlgorithm: EncryptionAlgorithmEnum.AES256,
        },
      },
    });
  };

  return (
    <RouteModal isLoading={!s3Query.data?.name}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="s3-policy-modal">
            {t('activateEncryptionTitle')}
          </DialogTitle>
        </DialogHeader>
        <p>{t('activateEncryptionDescription')}</p>
        <p>
          <AlertCircle className="size-4 inline shrink-0 mr-2" />
          <span>{t('activateEncryptionWarning')}</span>
          <A
            href={getGuideUrl(GUIDES.OBJ_STO_ENCRYPTION, locale)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="inline-flex items-center gap-2">
              <span className="text-primary-500">
                {t('activateEncryptionDocLink')}
              </span>
              <ExternalLink className="size-4 text-primary-500" />
            </div>
          </A>
        </p>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" mode="outline">
              {t('cancelButton')}
            </Button>
          </DialogClose>
          <Button type="button" onClick={onSubmit} disabled={isPending}>
            {t('confirmButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default ActivateEncryption;
