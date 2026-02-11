import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  Button,
  useToast,
  Input,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  DialogBody,
} from '@datatr-ux/uxlib';
import { PERMANENT_DELETE_CONFIRMATION } from '@/configuration/polling.constants';
import RouteModal from '@/components/route-modal/RouteModal';
import { useS3Data } from '../../../../S3.context';
import { useGetS3ObjectVersion } from '@/data/hooks/s3-storage/useGetS3ObjectVersion.hook';
import { useDeleteS3ObjectVersion } from '@/data/hooks/s3-storage/useDeleteS3ObjectVersion.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';

const DeleteObjectVersion = () => {
  const { projectId, versionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const objectKey = searchParams.get('objectKey');
  const { s3 } = useS3Data();
  const { t } = useTranslation(
    'pci-object-storage/storages/s3/objects/versions',
  );
  const toast = useToast();
  const [confirmationInput, setConfirmationInput] = useState('');

  const versionObjectQuery = useGetS3ObjectVersion({
    projectId,
    region: s3.region,
    name: s3.name,
    key: objectKey,
    versionId,
    options: { enabled: !!objectKey },
  });

  const { deleteS3ObjectVersion, isPending } = useDeleteS3ObjectVersion({
    onError: (err) => {
      toast.toast({
        title: t('objectVersionToastErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onDeleteSuccess: () => {
      toast.toast({
        title: t('objectVersionToastSuccessTitle'),
        description: t('deleteObjectVersionToastSuccessDescription', {
          name: objectKey,
        }),
      });
      navigate(`../?objectKey=${encodeURIComponent(objectKey)}`);
    },
  });

  if (!objectKey) navigate('../');

  const handleDelete = () => {
    deleteS3ObjectVersion({
      projectId,
      region: s3.region,
      name: s3.name,
      key: versionObjectQuery.data.key,
      versionId: versionObjectQuery.data.versionId,
    });
  };

  return (
    <RouteModal
      backUrl={`../?objectKey=${encodeURIComponent(objectKey)}`}
      isLoading={!projectId && !objectKey && !versionObjectQuery.data.key}
    >
      <DialogContent
        variant="warning"
        data-testid="delete-object-version-modal"
      >
        <DialogHeader>
          <DialogTitle>{t('deleteObjectVersionTitle')}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="mt-2">
            {t('deleteObjectVersionDescription', {
              name: objectKey,
            })}
          </p>

          <div className="flex flex-col gap-2 mt-2">
            <Label htmlFor="terminateInput" className="font-semibold">
              {t('deleteObjectVersionConfirmation', {
                confirmation: PERMANENT_DELETE_CONFIRMATION,
              })}
            </Label>
            <Input
              id="terminateInput"
              data-testid="delete-object-version-confirmation-input"
              type="text"
              placeholder="PERMANENTLY DELETE"
              onChange={(event) => {
                setConfirmationInput(event.target.value);
              }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" mode="ghost">
              {t('deleteObjectVersionButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={
              isPending || confirmationInput !== PERMANENT_DELETE_CONFIRMATION
            }
            onClick={handleDelete}
            data-testid="delete-object-version-submit-button"
          >
            {t('deleteObjectVersionButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default DeleteObjectVersion;
