import { IShellMessage } from '../common';
import IMessageBus from './IMessageBus';

export default class DirectClientMessageBus implements IMessageBus {
  peers: Array<DirectClientMessageBus>;

  listeners: Array<CallableFunction>;

  constructor() {
    this.listeners = [];
    this.peers = [];
  }

  addPeer(peer: DirectClientMessageBus) {
    this.peers.push(peer);
  }

  send<T>(data: IShellMessage<T>): void {
    this.peers.forEach((peer) => {
      peer.listeners.forEach((listener) => {
        listener(data);
      });
    });
  }

  onReceive<T>(callback: (message: T) => void): void {
    this.listeners.push(callback);
  }
}
