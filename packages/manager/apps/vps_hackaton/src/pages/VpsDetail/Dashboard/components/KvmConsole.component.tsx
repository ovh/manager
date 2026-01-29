import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Text, Button } from '@ovhcloud/ods-react';
import { useKvmConsoleUrl } from '@/api/hooks/useVpsActions';
import { LoadingSkeleton } from '@/components/LoadingSkeleton/LoadingSkeleton.component';

type TKvmConsoleProps = {
  serviceName: string;
  onClose: () => void;
};

export const KvmConsole = ({ serviceName, onClose }: TKvmConsoleProps) => {
  const { t } = useTranslation('vps');
  const [copied, setCopied] = useState(false);

  const { data: consoleUrl, isLoading, isError } = useKvmConsoleUrl(
    serviceName,
    true,
  );

  const handleCopyUrl = async () => {
    if (consoleUrl) {
      await navigator.clipboard.writeText(consoleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenInNewTab = () => {
    if (consoleUrl) {
      window.open(consoleUrl, '_blank');
    }
  };

  return (
    <Modal isOpen onClose={onClose} className="max-w-4xl">
      <Text slot="heading" preset="heading-4">
        {t('vps_action_kvm_title')}
      </Text>

      <div className="p-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8">
            <LoadingSkeleton lines={2} />
            <Text preset="paragraph" className="mt-4">
              {t('vps_action_kvm_loading')}
            </Text>
          </div>
        )}

        {isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <Text preset="paragraph" className="text-red-700">
              {t('common_error')}
            </Text>
          </div>
        )}

        {consoleUrl && !isLoading && (
          <div className="space-y-4">
            <Text preset="paragraph">
              {t('vps_action_kvm_description')}
            </Text>

            <div className="flex gap-2">
              <Button
                variant="default"
                label={t('vps_action_kvm_open')}
                onClick={handleOpenInNewTab}
              />
              <Button
                variant="outline"
                label={
                  copied
                    ? t('vps_dashboard_network_copied')
                    : t('vps_action_kvm_copy_url')
                }
                onClick={handleCopyUrl}
              />
            </div>

            <div className="aspect-video w-full overflow-hidden rounded-lg border">
              <iframe
                src={consoleUrl}
                title="KVM Console"
                className="h-full w-full"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        )}
      </div>

      <div slot="actions">
        <Button variant="ghost" label={t('common_close')} onClick={onClose} />
      </div>
    </Modal>
  );
};
