import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Clipboard,
  DialogBody,
} from '@datatr-ux/uxlib';
import { useServiceData } from '../../Service.context';
import RouteModal from '@/components/route-modal/RouteModal.component';
import { useGetUserAccess } from '@/data/hooks/database/user/useGetUserAccess.hook';

const ViewUserCertificates = () => {
  const { userId } = useParams();
  const { projectId, service } = useServiceData();
  const useGetUserAccessQuery = useGetUserAccess(
    projectId,
    service.engine,
    service.id,
    userId,
    {
      enabled: !!userId,
    },
  );

  const { t } = useTranslation(
    'pci-databases-analytics/services/service/users',
  );

  return (
    <RouteModal isLoading={!useGetUserAccessQuery.isSuccess}>
      <DialogContent variant="information">
        <DialogHeader>
          <DialogTitle data-testid="view-certificate-modal">
            {t('viewCertificatesTitle')}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          {useGetUserAccessQuery.data && (
            <Clipboard
              value={`${useGetUserAccessQuery.data.cert}`}
              showDownloadButton
            />
          )}
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              mode="ghost"
              data-testid="view-certificate-close-button"
            >
              {t('userButtonClose')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default ViewUserCertificates;
