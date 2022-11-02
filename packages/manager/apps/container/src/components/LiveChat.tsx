import React from 'react';
import VirtualAgent from './VirtualAgent';

interface LiveChatProps {
  language: string;
  subsidiary: string;
  open?: boolean;
  reduced?: boolean;
  onClose?: () => void;
  onReduce?: () => void;
}

const LiveChat: React.FC<ComponentProps<LiveChatProps>> = (
  props: LiveChatProps,
): JSX.Element => {
  const { language, open, reduced, subsidiary, ...rest } = props;
  const url = `https://chat.ovh.com/system/templates/liveChat-manager/STD/${subsidiary}_${language}/docs/index2.html`;

  return (
    <VirtualAgent
      name="LiveChat"
      title="OVHcloud Chat"
      url={url}
      agentStarted={open}
      agentReduced={reduced}
      useStorage={true}
      buttonColor="#ed642a"
      headerColor="radial-gradient(circle at bottom left, #f98841, #f75a56)"
      customStyles={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
      }}
      {...rest}
    />
  );
};

export default LiveChat;
