import React, { useEffect, useState } from 'react';
import useContainer from '@/core/container';
import { OsdsButton, OsdsText, OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_TEXT_LEVEL, ODS_TEXT_SIZE, ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_HUE, ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import { v6 } from '@ovh-ux/manager-core-api';

import { ADRIELLY_CHAT_URL, ADRIELLY_CHAT_ORIGIN, SNOW_INSTANCE_URL } from './liveChat.constants';

type LiveChatProps = {
  closeLiveChat: () => void;
};
type LiveChatType = 'Adrielly' | 'SNOW';
// re-render on key-change or setState change

type Token = {
  token: string;
};

const fetchAuthToken = async (): Promise<string | null> => {
  try {
    const request = await v6.post<Token>('/auth/token');
    return request.data.token;
  } catch (error) {
    return null;
  }
};

type ChatDialogProps = {
  url: string;
  visible: boolean;
  title: string;
  showHeader?: boolean;
}

type SnowChatContext = {
  skip_load_history?: string;
  live_agent_only?: string;
  language?: string;
  queue?: string;
  branding_key?: string;
  session_id?: string;
  interface_type?: string;
  interface_name?: string;
}

/**
 * Utility function to construct query parameters
 * @param {Record<string, string>} params - An object containing query parameters as key-value pairs
 * @returns {string} - A query string
 */
const constructQueryParams = (params: Record<string, string>): string => {
  return Object.entries(params)
    .map(([key, value]) => `sysparm_${key}=${encodeURIComponent(value)}`)
    .join('&');
};

const generateSnowChatUrl = (instance: string, context: SnowChatContext) => {
  return `${instance}/sn_va_web_client_app_embed.do?${constructQueryParams(context)}`;
}


// const ServiceNowChatComponent = ({context}: {context: SnowChatContext}) => {
//   useEffect(() => {
//     const loadChatModule = async () => {
//       const Module = await import(`${SNOW_INSTANCE_URL}/uxasset/externals/now-requestor-chat-popover-app/index.jsdbx?sysparm_substitute=false`);

//       const chat = new Module.default({
//         instance: SNOW_INSTANCE_URL,
//         context,
//         offsetX: 0,
//         offsetY: 0,
//         translations: 'fr_FR',
//       });
//       chat.open();
//     };

//     loadChatModule();
//   }, []);

//   return <div>Loading chat...</div>;
// };

/**
 * rounded-t-lg rounded-b-lg separated due to osds
 */
function ChatDialog({ url, visible, title, showHeader = true }: ChatDialogProps): JSX.Element {
  return (
    <div className={`w-96 h-[600px] bg-white rounded-t-lg rounded-b-lg shadow-md flex flex-col ${visible ? '' : 'hidden'}`}>
      {showHeader && <div className='h-16 rounded-t-lg flex justify-center items-center' style={{ background: 'radial-gradient(circle at bottom left, #000e9c, #00185e)' }}>
        <OsdsText color={ODS_THEME_COLOR_INTENT.default} hue={ODS_THEME_COLOR_HUE._000} level={ODS_TEXT_LEVEL.heading} size={ODS_TEXT_SIZE._600}>{title}</OsdsText>
      </div>}
      <iframe
        // ref={mainFrame}
        title={title}
        src={url}
        className={`flex-grow w-full h-full rounded-lg border-none`} // done to tw
        sandbox="allow-scripts allow-top-navigation allow-forms allow-popups allow-same-origin allow-downloads"
      ></iframe>
    </div>
  )
}

export default function LiveChat({ closeLiveChat }: LiveChatProps): JSX.Element {

  const { chatbotOpen, chatbotReduced, setChatbotOpen, setChatbotReduced } = useContainer();

  const [chatType, setChatType] = useState<LiveChatType>('Adrielly');

  const handleCloseChat = () => {
    setChatType('Adrielly');
    closeLiveChat();
  }

  const snowContext: SnowChatContext = {
    skip_load_history: 'false',
    live_agent_only: 'true',
    language: 'fr_FR',
    queue: 'keepbiz',
    branding_key: 'adrielly',
    session_id: ''
  };

  useEffect(() => {

      fetchAuthToken().then((token) => {
        snowContext.session_id = token;
      });

      const livechatMessageEventHandler = (ev: MessageEvent<{ event: string, queue: string }>) => {

        if (ev.origin !== ADRIELLY_CHAT_ORIGIN) return;
        ev.stopPropagation();

        if (typeof ev.data !== 'object' || ev.data.event !== 'open_agent_chat') return
        console.log(snowContext);
        setChatType('SNOW');
      }

      window.addEventListener('message', livechatMessageEventHandler)
      return () => window.removeEventListener('message', livechatMessageEventHandler);
    }, []);

  return (
    <div className='absolute bottom-5 right-5 z-[960]'>
      {chatbotOpen && <>
          {chatType === 'Adrielly' && <ChatDialog title="OVHcloud Chat" visible={!chatbotReduced} url={ADRIELLY_CHAT_URL} key={chatType} />}
          {chatType === 'SNOW' && <ChatDialog title={chatType} showHeader={false} visible={!chatbotReduced} url={generateSnowChatUrl(SNOW_INSTANCE_URL, snowContext)} key={chatType} /> }
          <div className='relative p-3 flex flex-row justify-end'>

            {!chatbotReduced && (
              <OsdsButton circle color={ODS_THEME_COLOR_INTENT.primary} onClick={() => setChatbotReduced(true)}>
                <OsdsIcon name={ODS_ICON_NAME.SPEECH_BUBBLE_CONCEPT} size={ODS_ICON_SIZE.md} className='m-2 bg-white' />
              </OsdsButton>
            )}
            {chatbotReduced && (
              <>
                <OsdsButton circle color={ODS_THEME_COLOR_INTENT.primary} onClick={() => setChatbotReduced(false)}>
                  <OsdsIcon name={ODS_ICON_NAME.SPEECH_BUBBLE_CONCEPT} size={ODS_ICON_SIZE.md} className='m-2 bg-white' />
                </OsdsButton>
                <OsdsButton circle contrasted className='absolute top-0 right-0 p-2 z-10' onClick={handleCloseChat}>
                  <OsdsIcon name={ODS_ICON_NAME.CLOSE} size={ODS_ICON_SIZE.xxs} color={ODS_THEME_COLOR_INTENT.primary} />
                 </OsdsButton>
              </>
            )}
          </div>
      </>}

      {/* {chatType === 'SNOW' && <ServiceNowChatComponent context={snowContext} key={chatType} />} */}
    </div>
  );
}
