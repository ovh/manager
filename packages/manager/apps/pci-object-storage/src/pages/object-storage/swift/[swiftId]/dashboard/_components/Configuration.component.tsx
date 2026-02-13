import { Clipboard, useToast } from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const Configuration = () => {
  const { t } = useTranslation('pci-object-storage/storages/swift');
  const toast = useToast();
  const { swiftId } = useParams();
  const onCopy = () => toast.toast({ title: t('copyLabel') });

  return (
    <div data-testid="configuration-container">
      <div className="space-y-2">
        <h5>{t('swiftIdLabel')}</h5>
        <Clipboard value={swiftId} onCopy={onCopy} />
      </div>
    </div>
  );
};

export default Configuration;
