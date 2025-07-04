import React, { useEffect, useRef } from 'react';
import { OsdsButton, OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT, ODS_ICON_NAME, ODS_ICON_SIZE, ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';

type ChatDialogProps = {
  url: string;
  visible: boolean;
  title: string;
  chatIFrame: React.MutableRefObject<HTMLIFrameElement>;
  showHeader?: boolean;
  onClose?: () => void;
  onReduce?: () => void;
};

/**
 * rounded-t-lg rounded-b-lg separated due to osds
 */
export default function ChatDialog({
  url,
  visible,
  title,
  chatIFrame,
  showHeader = true,
  onClose,
  onReduce
}: Readonly<ChatDialogProps>): JSX.Element {
  const chatDialog = useRef(null);
  const { t } = useTranslation('livechat');

  useEffect(() => {
    if (chatDialog.current) {
      if (typeof HTMLDialogElement === 'undefined') {
        // Import or use the dialog polyfill if HTMLDialogElement is not natively supported
        import('dialog-polyfill').then(({ default: dialogPolyfill }) => {
          dialogPolyfill.registerDialog(chatDialog.current);
        });
      }
      chatDialog.current.show();
      chatIFrame.current.contentWindow?.focus();
    }
  }, []);

  useEffect(() => {
    if (visible) {
      chatDialog.current.show();
      chatIFrame.current.contentWindow.focus();
    } else {
      chatDialog.current.close();
    }
  }, [visible]);

  return (
    <dialog
      ref={chatDialog}
      aria-label={title}
      aria-labelledby="livechat-label"
      aria-describedby="livechat-iframe"
      className="relative w-full h-full xl:w-96 xl:h-[600px] bg-white xl:rounded-t-lg xl:rounded-b-lg xl:shadow-md open:flex flex-col border-none pointer-events-auto p-0 mr-3"
      open
      aria-hidden={!visible}
    >
      {!showHeader && (
        <span id="livechat-label" className="sr-only">
          {title}
        </span>
      )}
      {showHeader && (
        <div
          className="p-1 xl:rounded-t-lg flex justify-center items-center"
          style={{
            background:
              'radial-gradient(circle at bottom left, #000e9c, #00185e)',
              height: '62px',
          }}
        >
          <OsdsText
            id="livechat-label"
            color={ODS_THEME_COLOR_INTENT.default}
            hue={ODS_THEME_COLOR_HUE._000}
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._600}
          >
            {title}
          </OsdsText>
        </div>
      )}
      {/* Header overlay for chat interactions (reduce chat, close chat) */}
      <div className='absolute top-0 right-0 p-2 h-[62px] flex items-center justify-end'>
        {onReduce && <OsdsButton circle size={ODS_BUTTON_SIZE.sm} color={ODS_THEME_COLOR_INTENT.primary} onClick={onReduce} variant={ODS_BUTTON_VARIANT.ghost} contrasted>
          <OsdsIcon
            name={ODS_ICON_NAME.CHEVRON_DOWN}
            size={ODS_ICON_SIZE.sm}
            data-testid="live-chat-dialog-reduce-button"
            aria-label={t('livechat_reduce')}
            contrasted
          />
        </OsdsButton>}
        {onClose &&  <OsdsButton circle size={ODS_BUTTON_SIZE.sm} color={ODS_THEME_COLOR_INTENT.primary} onClick={onClose} variant={ODS_BUTTON_VARIANT.ghost} contrasted>
          <OsdsIcon
            name={ODS_ICON_NAME.CLOSE}
            size={ODS_ICON_SIZE.sm}
            data-testid="live-chat-dialog-close-button"
            aria-label={t('livechat_close')}
            contrasted
          />
        </OsdsButton>}
      </div>
      <iframe
        ref={chatIFrame}
        id="livechat-iframe"
        data-testid="live-chat-iframe"
        title={title}
        src={url}
        className={`flex-grow w-full h-full rounded-lg border-none`}
        sandbox="allow-scripts allow-top-navigation allow-forms allow-popups allow-same-origin allow-downloads"
      />
    </dialog>
  );
}
