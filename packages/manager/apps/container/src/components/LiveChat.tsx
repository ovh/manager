import React, { useEffect, useState } from 'react';
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

type LiveChatType = 'Adrielly' | 'SNOW';

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

const LiveChat: React.FC<ComponentProps<LiveChatProps>> = (
  { language, open, reduced, subsidiary, supportLevel, ...rest }: LiveChatProps,
): JSX.Element => {

  const [chatType, setChatType] = useState<LiveChatType>('Adrielly');

  console.log('lc','open', open, 'reduced', reduced);

  const customerLevel = getCustomerLevel(supportLevel);
  // const url = `https://chat.ovh.com/system/templates/liveChat-manager/${customerLevel}/${subsidiary}_${language}/docs/index2.html`;
  const url = `https://chat.ovh.com/system/templates/pre-prod/prepa_prod/STD/FR_fr/docs/index2.html`;


  useEffect(() => {
    if (open) {
      setChatType('Adrielly');
    }
  }, [open])

  useEffect(() => {

    const livechatMessageEventHandler = (ev: MessageEvent<{ event: string, queue: string }>) => {

      if (ev.origin !== 'https://chat.ovh.com') return;
      ev.stopPropagation();

      if (typeof ev.data !== 'object' || ev.data.event !== 'open_agent_chat') return
      setChatType('SNOW');

    }

    window.addEventListener('message', livechatMessageEventHandler)
    return () => window.removeEventListener('message', livechatMessageEventHandler);
  }, [])

  if (chatType === 'Adrielly') {
    return (<>
      <VirtualAgent
        name="LiveChat"
        title={'Adrielly'}
        url={url}
        agentStarted={open}
        agentReduced={reduced}
        useStorage
        buttonColor="#000e9c"
        headerColor="radial-gradient(circle at bottom left, #f98841, #f75a56)"
        customStyles={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
        }}
        {...rest}
      />
    </>)
  }
  else if (chatType === 'SNOW') {
    return (<>
      <VirtualAgent
        name="LiveChat"
        title={'SNOW'}
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
    </>)
  }
};

export default LiveChat;
