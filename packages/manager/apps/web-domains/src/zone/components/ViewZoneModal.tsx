import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  BUTTON_VARIANT,
  Icon,
  ICON_NAME,
  MESSAGE_COLOR,
  Message,
  Modal,
  ModalBody,
  ModalContent,
  SPINNER_SIZE,
  Spinner,
  TEXT_PRESET,
  Text,
  ModalHeader,
} from '@ovhcloud/ods-react';
import { downloadZoneFile } from '@/zone/data/api/history.api';
import { TZoneHistoryWithDate } from '@/zone/types/history.types';

interface ViewZoneModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly item: TZoneHistoryWithDate | null;
}

export default function ViewZoneModal({
  isOpen,
  onClose,
  item,
}: ViewZoneModalProps) {
  const { t } = useTranslation('zone');
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    if (!item || !isOpen) return;

    setIsLoading(true);
    setError(null);

    downloadZoneFile(item.zoneFileUrl)
      .then((data) => {
        setContent(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [item, isOpen]);

  if (!item || !isOpen) return null;

  return (
    <Modal open={isOpen} onOpenChange={(detail) => !detail.open && onClose()}>
      <ModalContent dismissible className="max-w-4xl">
        <ModalHeader>
          <Text preset={TEXT_PRESET.heading3} className="mb-4">
            {t('zone_history_view')}
          </Text>
        </ModalHeader>
        <ModalBody>
          <div className="flex-1 overflow-auto mb-4">
            {isLoading && (
              <div className="flex justify-center p-8">
                <Spinner size={SPINNER_SIZE.lg} />
              </div>
            )}

            {error && (
              <Message color={MESSAGE_COLOR.critical}>
                {t('zone_history_error', { message: error })}
              </Message>
            )}

            {!isLoading && !error && content && (
              <div className="relative">
                <Button
                  variant={BUTTON_VARIANT.ghost}
                  onClick={handleCopy}
                  className="absolute top-2 right-2 z-10"
                >
                  <Icon name={copied ? ICON_NAME.check : ICON_NAME.fileCopy} />
                </Button>
                <pre className="font-mono text-sm text-gray-700 rounded border border-gray-200 bg-gray-50 p-4 pt-10 max-h-[50vh] overflow-auto whitespace-pre">
                  {content}
                </pre>
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-end mt-4">
            <Button variant={BUTTON_VARIANT.ghost} onClick={onClose}>
              {t('zone_history_view_close')}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
