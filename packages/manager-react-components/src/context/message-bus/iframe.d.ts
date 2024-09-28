import { IShellMessage } from '../common';
import IMessageBus from './IMessageBus';

export default class IFrameMessageBus implements IMessageBus {
  iframe?: HTMLIFrameElement;

  listeners: CallableFunction[];

  onMessage: (event: MessageEvent) => void;

  constructor(iframe?: HTMLIFrameElement);

  send<T>(message: IShellMessage<T>): void;

  onReceive<T>(callback: (message: T) => void): void;

  cleanup(): void;
}
