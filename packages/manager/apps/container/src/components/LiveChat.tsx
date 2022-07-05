import React from 'react';
import VirtualAgent from './VirtualAgent';

interface LiveChatProps {
  locale: string;
  open?: boolean;
  onClose?: () => void;
}

const LiveChat: React.FC<ComponentProps<LiveChatProps>> = (
  props: LiveChatProps,
): JSX.Element => {
  const { locale, open } = props;
  const language = locale.split('_')[0];
  const baseURL = 'https://chat.ovh.com/system/templates/livechat-manager';

  const url = `${baseURL}/germany/lc-de.html`;

  return (
    <VirtualAgent
      name="LiveChat"
      title="OVHcloud Chat"
      url={url}
      agentStarted={true}
      useStorage={true}
      buttonColor="#ed642a"
      headerColor="radial-gradient(circle at bottom left, #f98841, #f75a56)"
      customStyles={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
      }}
      {...props}
    />
  );
};

export default LiveChat;
