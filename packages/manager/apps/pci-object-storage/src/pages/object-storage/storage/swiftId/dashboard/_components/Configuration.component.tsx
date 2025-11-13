import {
  Button,
  Clipboard,
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  useToast,
} from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const Configuration = () => {
  const { t } = useTranslation('pci-object-storage/storages/swift');
  const toast = useToast();
  const { swiftId } = useParams();
  const navigate = useNavigate();
  const onCopy = () => toast.toast({ title: t('copyLabel') });

  return (
    <div data-testid="configuration-container">
      <div className="space-y-2">
        <h5>{t('swiftIdLabel')}</h5>
        <Clipboard value={swiftId} onCopy={onCopy} />
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block w-full" tabIndex={0}>
              <Button
                data-testid="swift-config-delete-button"
                variant="critical"
                mode="outline"
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
