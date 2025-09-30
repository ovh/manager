import {
  Button,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  useToast,
} from '@datatr-ux/uxlib';
import { Files } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const Configuration = () => {
  const { t } = useTranslation('pci-object-storage/storages/swift');
  const toast = useToast();
  const { swiftId } = useParams();
  const navigate = useNavigate();
  return (
    <div data-testid="configuration-container">
      <div className="flex justify-between items-center text-base mr-2">
        <div className="flex flex-row gap-2">
          <p className="font-semibold">{t('swiftIdLabel')}</p>
          <p>{swiftId}</p>
        </div>
        <Button
          data-testid="dashboard-copy-id-button"
          type="button"
          size="menu"
          variant="menu"
          mode="menu"
          className="shrink-0"
          onClick={() => {
            navigator.clipboard.writeText(swiftId);
            toast.toast({
              title: t('successCopy'),
            });
          }}
        >
          <Files className="w-4 h-4" />
          <span className="sr-only">copy</span>
        </Button>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block w-full" tabIndex={0}>
              <Button
                data-testid="swift-config-delete-button"
                variant="destructive"
                className="w-full mt-4"
                onClick={() => navigate('./delete')}
              >
                {t('deleteSwiftButton')}
              </Button>
            </span>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default Configuration;
