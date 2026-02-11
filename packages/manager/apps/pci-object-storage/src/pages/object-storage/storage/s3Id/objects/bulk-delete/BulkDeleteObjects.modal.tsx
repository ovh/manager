import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  useToast,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogBody,
  Input,
  Label,
} from '@datatr-ux/uxlib';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { PERMANENT_DELETE_CONFIRMATION } from '@/configuration/polling.constants';
import RouteModal from '@/components/route-modal/RouteModal';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useBulkDeleteS3Objects } from '@/data/hooks/s3-storage/useBulkDeleteS3Objects.hook';
import { useS3Data } from '../../S3.context';
import { useObjectSelection } from '../_contexts/ObjectSelection.context';

const BulkDeleteObjects = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { s3 } = useS3Data();
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const toast = useToast();
  const [confirmationInput, setConfirmationInput] = useState('');
  const {
    getSelectedObjects,
    selectedCount,
    clearSelection,
  } = useObjectSelection();

  const selectedObjects = getSelectedObjects();
  const isDeletingVersions = selectedObjects.some((obj) => !!obj.versionId);

  const handleConfirmationInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmationInput(event.target.value);
  };

  const { bulkDeleteS3Objects, isPending } = useBulkDeleteS3Objects({
    onError: (err) => {
      toast.toast({
        title: t('objectToastErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onDeleteSuccess: () => {
      toast.toast({
        title: t('objectToastSuccessTitle'),
        description: t('bulkDeleteToastSuccessDescription', {
          count: selectedCount,
        }),
      });
      clearSelection();
      navigate(`../${location.search}`);
    },
  });

  const handleDelete = () => {
    bulkDeleteS3Objects({
      projectId,
      region: s3.region,
      name: s3.name,
      objects: selectedObjects.map((obj) => ({
        key: obj.key,
        versionId: obj.versionId || undefined,
      })),
    });
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <RouteModal backUrl={`../${location.search}`}>
      <DialogContent variant="warning" data-testid="bulk-delete-objects-modal">
        <DialogHeader>
          <DialogTitle>
            {isDeletingVersions
              ? t('bulkDeleteVersionsTitle')
              : t('bulkDeleteTitle')}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>
            {isDeletingVersions
              ? t('bulkDeleteVersionsDescription', { count: selectedCount })
              : t('bulkDeleteDescription', { count: selectedCount })}
          </p>
          {isDeletingVersions && (
            <div className="flex flex-col gap-2 mt-2">
              <Label htmlFor="terminateInput" className="font-semibold">
                {t('bulkDeleteVersionsConfirmation', {
                  confirmation: PERMANENT_DELETE_CONFIRMATION,
                })}
              </Label>
              <Input
                id="terminateInput"
                data-testid="bulk-delete-confirmation-input"
                type="text"
                placeholder={PERMANENT_DELETE_CONFIRMATION}
                onChange={handleConfirmationInputChange}
              />
            </div>
          )}
        </DialogBody>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" mode="ghost">
              {t('deleteObjectButtonCancel')}
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="critical"
            disabled={
              isPending ||
              (isDeletingVersions &&
                confirmationInput !== PERMANENT_DELETE_CONFIRMATION)
            }
            onClick={handleDelete}
            data-testid="bulk-delete-submit-button"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {t('deleteObjectButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default BulkDeleteObjects;
