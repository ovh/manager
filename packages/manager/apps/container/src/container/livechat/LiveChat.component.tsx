import React, { useEffect, useState } from 'react';
import { v6 } from '@ovh-ux/manager-core-api';
import { Environment } from '@ovh-ux/manager-config';
import { OsdsButton, OsdsText, OsdsIcon } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import useContainer from '@/core/container';
import { useShell } from '@/context';
import { useSessionStorage } from '@/hooks/useSessionStorage';
import {
  LiveChatType,
  LiveChatState,
  ApiV6AuthToken,
} from '@/types/live-chat.type';
import {
  ADRIELLY_CHAT_URL_TEMPLATE,
  ADRIELLY_CHAT_ORIGIN,
  SNOW_INSTANCE_URL,
  SNOW_CHAT_QUEUE_STORAGE_KEY,
  CHAT_STATE_STORAGE_KEY,
  CHAT_TYPE_STORAGE_KEY,
} from './liveChat.constants';
import { generateSnowChatUrl } from './liveChat.helpers';
import ChatDialog from './ChatDialog.component';

type LiveChatProps = {
  closeLiveChat: () => void;
};

const fetchAuthToken = async (): Promise<string | null> => {
  try {
    const request = await v6.post<ApiV6AuthToken>('/auth/token');
    return request.data.token;
  } catch (error) {
    return null;
  }
};

export type SnowChatContext = {
  skip_load_history?: string;
  live_agent_only?: string;
  language?: string;
  region?: string;
  queue: string;
  branding_key?: string;
  session_id: string;
  interface_type?: string;
  interface_name?: string;
};

export default function LiveChat({
  closeLiveChat,
}: Readonly<LiveChatProps>): JSX.Element {
  const {
    chatbotOpen,
    chatbotReduced,
    setChatbotOpen,
    setChatbotReduced,
  } = useContainer();

  const environment: Environment = useShell()
    .getPlugin('environment')
    .getEnvironment();

  const region = environment.getRegion();
  const language = environment.getUserLanguage();
  const { ovhSubsidiary, supportLevel } = environment.getUser();

  const [
    snowChatQueue,
    setSnowChatQueue,
    clearSnowChatQueue,
  ] = useSessionStorage<string>(SNOW_CHAT_QUEUE_STORAGE_KEY);
  const [chatState, setChatState, clearChatState] = useSessionStorage<
    LiveChatState
  >(CHAT_STATE_STORAGE_KEY);
  const [chatType, setChatType, clearChatType] = useSessionStorage<
    LiveChatType
  >(CHAT_TYPE_STORAGE_KEY);

  const [snowContext, setSnowContext] = useState<SnowChatContext>({
    skip_load_history: 'false',
    live_agent_only: 'true',
    language,
    region,
    branding_key: 'adrielly',
    session_id: '',
    queue: snowChatQueue || '',
  });

  const handleCloseChat = () => {
    setChatbotReduced(false);

    clearSnowChatQueue();
    clearChatType();
    clearChatState();
    closeLiveChat();
  };

  const handleReduceChat = (reduceChat: boolean) => {
    setChatState(reduceChat ? 'reduced' : 'open');
    setChatbotReduced(reduceChat);
  };

  useEffect(() => {
    if (region === 'US') return;

    /**
     * If the livechat should be re-opened before a refresh/re-render, we need to set the chatType back to default
     */
    if (chatbotOpen && chatType === null) {
      setChatType('Adrielly');
    }

    const livechatMessageEventHandler = async (
      ev: MessageEvent<{ event: string; queue: string }>,
    ) => {
      // TODO: Add back after testing
      // if (ev.origin !== ADRIELLY_CHAT_ORIGIN) return;
      ev.stopPropagation();

      if (typeof ev.data !== 'object' || ev.data.event !== 'open_agent_chat')
        return;
      if (chatType === 'SNOW' && ev.data.queue === snowChatQueue) return;

      const token = await fetchAuthToken();
      setSnowContext((prev) => ({
        ...prev,
        session_id: token,
        queue: ev.data.queue,
      }));

      setSnowChatQueue(ev.data.queue);
      setChatType('SNOW');
    };

    window.addEventListener('message', livechatMessageEventHandler);
    return () => {
      window.removeEventListener('message', livechatMessageEventHandler);
    };
  }, [chatbotOpen]);

  useEffect(() => {
    if (chatType !== null) {
      setChatbotOpen(true);
      setChatbotReduced(chatState === 'reduced');
    }
  }, []);

  useEffect(() => {
    if (chatType === 'SNOW' && !snowContext.session_id) {
      fetchAuthToken().then((token) => {
        setSnowContext((prev) => ({ ...prev, session_id: token }));
      });
    }
  }, [chatType]);

  if (region === 'US') return null;

  // const url = `https://chat.ovh.com/system/templates/liveChat-manager/${customerLevel}/${subsidiary}_${language}/docs/index2.html`;

  if (!chatbotOpen) return null;
  return (
    <div
      data-testid="live-chat-wrapper"
      className="absolute w-full h-full xl:h-fit xl:w-auto bottom-0 xl:bottom-2 right-0 xl:right-2 z-[960] flex flex-col justify-end pointer-events-none"
    >
      {chatType === 'Adrielly' && (
        <ChatDialog
          title="OVHcloud Chat"
          visible={!chatbotReduced}
          url={`https://chat.${'ovh'.toLocaleLowerCase()}.com/system/templates/pre-prod/prepa_prod/STD/FR_fr/docs/index2.html`}
          key={chatType}
        />
      )}
      {chatType === 'SNOW' && snowContext.session_id && snowContext.queue && (
        <ChatDialog
          title={chatType}
          showHeader={false}
          visible={!chatbotReduced}
          url={generateSnowChatUrl(SNOW_INSTANCE_URL, snowContext)}
          key={chatType}
        />
      )}
      <div
        data-testid="live-chat-pta-wrapper"
        className="order-first xl:order-last relative p-3 bg-[#000e9c] xl:bg-transparent flex flex-row items-center justify-between xl:justify-end pointer-events-auto"
      >
        {!chatbotReduced && (
          <>
            <OsdsButton
              className="hidden xl:flex"
              aria-label="Reduce Live Chat"
              data-testid="live-chat-desktop-reduce-button"
              circle
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => handleReduceChat(true)}
            >
              <OsdsIcon
                name={ODS_ICON_NAME.SPEECH_BUBBLE_CONCEPT}
                size={ODS_ICON_SIZE.md}
                className="m-2"
                contrasted
              />
              <span className="sr-only">{`Reduce Live Chat`}</span>
            </OsdsButton>
            <OsdsButton
              className="xl:hidden"
              aria-label="Reduce Live Chat"
              data-testid="live-chat-mobile-reduce-button"
              variant={ODS_BUTTON_VARIANT.ghost}
              circle
              contrasted
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => handleReduceChat(true)}
            >
              <OsdsIcon
                name={ODS_ICON_NAME.CLOSE}
                size={ODS_ICON_SIZE.md}
                contrasted
              />
              <span className="sr-only">{`Reduce Live Chat`}</span>
            </OsdsButton>
            {chatType === 'Adrielly' && (
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.default}
                hue={ODS_THEME_COLOR_HUE._000}
                level={ODS_TEXT_LEVEL.heading}
                size={ODS_TEXT_SIZE._600}
                className="grow text-center xl:hidden"
              >
                OVHcloud Chat
              </OsdsText>
            )}
          </>
        )}
        {chatbotReduced && (
          <>
            {/* Mobile view: Close Chat */}
            <OsdsButton
              aria-label="Close Live Chat"
              variant={ODS_BUTTON_VARIANT.ghost}
              data-testid="live-chat-mobile-close-button"
              circle
              contrasted
              className="xl:hidden"
              onClick={handleCloseChat}
            >
              <OsdsIcon
                name={ODS_ICON_NAME.CLOSE}
                size={ODS_ICON_SIZE.md}
                contrasted
              />
              <span className="sr-only">{`Close Live Chat`}</span>
            </OsdsButton>

            {/* Desktop view: Open Chat */}
            <OsdsButton
              aria-label="Open Live Chat"
              data-testid="live-chat-desktop-open-button"
              circle
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => handleReduceChat(false)}
              className="hidden xl:flex"
            >
              <OsdsIcon
                name={ODS_ICON_NAME.SPEECH_BUBBLE_CONCEPT}
                size={ODS_ICON_SIZE.md}
                contrasted
                className="m-2"
              />
              <span className="sr-only">{`Open Live Chat`}</span>
            </OsdsButton>
            <OsdsIcon
              name={ODS_ICON_NAME.SPEECH_BUBBLE_CONCEPT}
              size={ODS_ICON_SIZE.md}
              contrasted
              className="xl:hidden"
            />

            {/* Desktop view: Close Chat */}
            <OsdsButton
              aria-label="Close Live Chat"
              data-testid="live-chat-desktop-close-button"
              circle
              contrasted
              className="hidden xl:flex absolute top-0 right-0 p-2 z-10"
              onClick={handleCloseChat}
            >
              <OsdsIcon
                name={ODS_ICON_NAME.CLOSE}
                size={ODS_ICON_SIZE.xxs}
                color={ODS_THEME_COLOR_INTENT.primary}
              />
              <span className="sr-only">{`Close Live Chat`}</span>
            </OsdsButton>

            {/* Mobile view: Open Chat */}
            <OsdsButton
              aria-label="Open Live Chat"
              data-testid="live-chat-mobile-open-button"
              circle
              variant={ODS_BUTTON_VARIANT.ghost}
              contrasted
              onClick={() => handleReduceChat(false)}
              className="xl:hidden"
            >
              <OsdsIcon
                name={ODS_ICON_NAME.CHEVRON_UP}
                size={ODS_ICON_SIZE.md}
                contrasted
              />
              <span className="sr-only">{`Open Live Chat`}</span>
            </OsdsButton>
          </>
        )}
      </div>
    </div>
  );
}
