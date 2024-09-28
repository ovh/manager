import { IShellMessage } from '../common';
import IMessageBus from './IMessageBus';

export default class DirectClientMessageBus implements IMessageBus {
  peers: Array<DirectClientMessageBus>;

  listeners: Array<CallableFunction>;

  constructor();

  addPeer(peer: DirectClientMessageBus): void;

  send<T>(data: IShellMessage<T>): void;

  onReceive<T>(callback: (message: T) => void): void;

  cleanup(): void;
}
