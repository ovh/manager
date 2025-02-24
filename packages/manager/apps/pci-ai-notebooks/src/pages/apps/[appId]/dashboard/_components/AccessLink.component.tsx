import { useNavigate } from 'react-router-dom';
import { Files, Pen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAppData } from '../../App.context';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const AccessLink = () => {
  const { app } = useAppData();
  const { t } = useTranslation('pci-ai-deploy/apps/app/dashboard');
  const toast = useToast();
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-row items-center justify-between gap-2">
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
            size="sm"
            variant="outline"
            onClick={() => navigate('./update-image')}
          >
            <span>{t('modifyLabel')}</span>
            <Pen className="ml-2 size-4" />
          </Button>
        )}
      </div>
      <div className="flex flex-row items-center justify-between gap-2 mt-4">
        <div>
          <h5 className="mb-2">{t('portTitle')}</h5>
          <Badge variant="error">{app.spec.defaultHttpPort}</Badge>
        </div>
        {!app.spec.partnerId && (
          <Button
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
      <div className="w-full border border-1 border-primary-100">
        <Button
          data-testid="containers-copy-mountpath-button"
          type="button"
          className="w-full flex justify-between items-center p-4 border-0"
          size="sm"
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(app.status.url);
            toast.toast({
              title: t('mountPathCopyToast'),
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

export default AccessLink;
