import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
  Code,
  githubDark,
  ScrollArea,
} from '@datatr-ux/uxlib';
import { Download } from 'lucide-react';
import { useServiceData } from '../../Service.context';
import RouteModal from '@/components/route-modal/RouteModal';
import { useGetUserAccess } from '@/hooks/api/database/user/useGetUserAccess.hook';
import useDownload from '@/hooks/useDownload';

const ShowAccessKey = () => {
  const { userId } = useParams();
  const { projectId, service } = useServiceData();
  const { download } = useDownload();
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

  const toast = useToast();

  return (
    <RouteModal isLoading={!useGetUserAccessQuery.isSuccess}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="show-access-modal">
            {t('showAccessKeyTitle')}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-auto max-h-64">
          <div className="p-2 max-w-lg">
            {useGetUserAccessQuery.data && (
              <Code
                code={useGetUserAccessQuery.data.key}
                label={
                  <div className="flex flex-row items-center justify-between w-full mr-2">
                    <div>
                      <span>{t('showAccessKeyTitle')}</span>
                    </div>
                    <Button
                      size="xs"
                      variant="neutral"
                      className="bg-neutral-700 hover:bg-neutral-800"
                      data-testid="show-access-key-dowload-button"
                      onClick={() => {
                        download(useGetUserAccessQuery.data.key, 'service.key');
                      }}
                    >
                      <Download className="size-4 mr-1" />
                      {t('downloadButton')}
                    </Button>
                  </div>
                }
                theme={githubDark}
                onCopied={() =>
                  toast.toast({
                    title: t('showAccessKeyCopy'),
                  })
                }
              />
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              mode="outline"
              data-testid="show-access-key-close-button"
            >
              {t('userButtonClose')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default ShowAccessKey;
