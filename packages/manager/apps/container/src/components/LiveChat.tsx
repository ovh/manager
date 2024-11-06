import React from 'react';
import VirtualAgent from './VirtualAgent';

interface LiveChatProps {
  language: string;
  subsidiary: string;
  open?: boolean;
  supportLevel: string;
  reduced?: boolean;
  onClose?: () => void;
  onReduce?: () => void;
}

const getCustomerLevel = (level: string) => {
  switch (level) {
    case 'standard':
      return 'STD';
    case 'premium':
      return 'PRM';
    case 'business':
      return 'BUS';
    case 'enterprise':
      return 'ENT';
    case 'premium-accredited':
        return 'PRP';
    default:
      return 'STD';
  }
};

// test

const LiveChat: React.FC<ComponentProps<LiveChatProps>> = (
  { language, open, reduced, subsidiary, supportLevel, ...rest }: LiveChatProps,
): JSX.Element => {
  const customerLevel = getCustomerLevel(supportLevel);
  const url = `https://chat.ovh.com/system/templates/liveChat-manager/${customerLevel}/${subsidiary}_${language}/docs/index2.html`;

  return (
    <VirtualAgent
      name="LiveChat"
      title="OVHcloud Chat"
      url={url}
      agentStarted={open}
      agentReduced={reduced}
      useStorage
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
