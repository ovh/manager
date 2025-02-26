import { useNavigate } from 'react-router-dom';
import { Files, Pen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAppData } from '../../App.context';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const AppGeneralInfo = () => {
  const { app } = useAppData();
  const { t } = useTranslation('pci-ai-deploy/apps/app/dashboard');
  const toast = useToast();
  const navigate = useNavigate();
  return (
    <>
      <div
        data-testid="image-container"
        className="flex flex-row items-center justify-between gap-2"
      >
        <div>
          <h5 className="mb-2">{t('imageTitle')}</h5>
          <p className="break-all w-full">
            {app.spec.partnerId
              ? `${app.spec.partnerId}/${app.spec.image}`
              : app.spec.image}
          </p>
        </div>
        {!app.spec.partnerId && (
          <Button
            data-testid="update-image-button"
            size="sm"
            variant="outline"
            onClick={() => navigate('./update-image')}
          >
            <span>{t('modifyLabel')}</span>
            <Pen className="ml-2 size-4" />
          </Button>
        )}
      </div>
      <div
        data-testid="port-container"
        className="flex flex-row items-center justify-between gap-2 mt-4"
      >
        <div>
          <h5 className="mb-2">{t('portTitle')}</h5>
          <Badge variant="error">{app.spec.defaultHttpPort}</Badge>
        </div>
        {!app.spec.partnerId && (
          <Button
            data-testid="update-port-button"
            size="sm"
            variant="outline"
            onClick={() => navigate('./update-port')}
          >
            <span>{t('modifyLabel')}</span>
            <Pen className="ml-2 size-4" />
          </Button>
        )}
      </div>
      <h5 className="mt-4 mb-2">{t('urlAccessTitle')}</h5>
      <div
        data-testid="url-container"
        className="w-full border border-1 border-primary-100"
      >
        <Button
          data-testid="url-copy-button"
          type="button"
          className="w-full flex justify-between items-center p-4 border-0"
          size="sm"
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(app.status.url);
            toast.toast({
              title: t('urlCopyToast'),
            });
          }}
        >
          <span className="truncate overflow-hidden text-ellipsis">
            {app.status.url}
          </span>
          <Files className="w-4 h-4 shrink-0" />
        </Button>
      </div>
    </>
  );
};

export default AppGeneralInfo;
