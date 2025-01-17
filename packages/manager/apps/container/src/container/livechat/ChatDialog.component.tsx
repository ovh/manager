import React, { useEffect, useRef } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import dialogPolyfill from 'dialog-polyfill';

type ChatDialogProps = {
  url: string;
  visible: boolean;
  title: string;
  showHeader?: boolean;
};

/**
 * rounded-t-lg rounded-b-lg separated due to osds
 */
export default function ChatDialog({
  url,
  visible,
  title,
  showHeader = true,
}: ChatDialogProps): JSX.Element {
  const chatDialog = useRef(null);
  const chatIFrame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (chatDialog.current) {
      dialogPolyfill.registerDialog(chatDialog.current);
      chatDialog.current.show();
      chatIFrame.current.contentWindow.focus();
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
          className="sr-only xl:not-sr-only xl:h-16 xl:rounded-t-lg xl:flex justify-center items-center"
          style={{
            background:
              'radial-gradient(circle at bottom left, #000e9c, #00185e)',
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
      <iframe
        ref={chatIFrame}
        id="livechat-iframe"
        title={title}
        src={url}
        className={`flex-grow w-full h-full rounded-lg border-none`} // done to tw
        sandbox="allow-scripts allow-top-navigation allow-forms allow-popups allow-same-origin allow-downloads"
      />
    </dialog>
  );
}
