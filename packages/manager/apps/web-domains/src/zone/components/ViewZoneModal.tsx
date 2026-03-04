import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormatDate } from '@ovh-ux/manager-react-components';
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
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';
import { useViewZoneFile } from '@/zone/hooks/data/history.hooks';
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
  const formatDate = useFormatDate();
  const {
    mutate: viewZone,
    data: content,
    isPending: isLoading,
    error,
  } = useViewZoneFile();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  useEffect(() => {
    if (item && isOpen) {
      viewZone(item.zoneFileUrl);
    }
  }, [item, isOpen]);

  if (!item || !isOpen) return null;

  return (
    <Modal open={isOpen} onOpenChange={(detail) => !detail.open && onClose()}>
      <ModalContent dismissible className="max-w-4xl">
        <ModalHeader>
          <Text preset={TEXT_PRESET.heading3}>
            {t('zone_history_view_title', {
              date: formatDate({ date: item.creationDate, format: 'PPpp' }),
            })}
          </Text>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col min-h-0">
            {isLoading && (
              <div className="flex justify-center p-8">
                <Spinner size={SPINNER_SIZE.lg} />
              </div>
            )}

            {error && (
              <Message color={MESSAGE_COLOR.critical}>
                <MessageIcon name={ICON_NAME.hexagonExclamation} />
                <MessageBody>
                  {t('zone_history_error', { message: error.message })}
                </MessageBody>
              </Message>
            )}

            {!isLoading && !error && content && (
              <div className="rounded border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-end bg-gray-100 px-4 border-b border-gray-200">
                  <Button variant={BUTTON_VARIANT.ghost} onClick={handleCopy}>
                    <Icon
                      name={copied ? ICON_NAME.check : ICON_NAME.fileCopy}
                      style={{ fontSize: '24px' }}
                    />
                  </Button>
                </div>
                <pre className="font-mono text-sm text-gray-700 bg-gray-50 whitespace-pre max-h-[60vh] overflow-auto m-0">
                  <table className="border-collapse w-full">
                    <tbody>
                      {content.split('\n').map((line, idx) => {
                        const key = `${idx}-${line.slice(0, 20)}`;
                        return (
                          <tr key={key}>
                            <td className="select-none text-right pr-4 pl-4 text-gray-400 align-top w-1 whitespace-nowrap border-r border-gray-200 bg-gray-100">
                              {idx + 1}
                            </td>
                            <td className="pl-4 pr-4">{line || '\u00A0'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </pre>
              </div>
            )}
          </div>
        </ModalBody>
        <div className="flex gap-4 justify-end p-4 border-t border-gray-200 bg-white">
          <Button variant={BUTTON_VARIANT.ghost} onClick={onClose}>
            {t('zone_history_view_close')}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}
