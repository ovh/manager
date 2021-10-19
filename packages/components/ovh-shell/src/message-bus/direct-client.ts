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

  send(data: unknown): void {
    this.peers.forEach((peer) => {
      peer.listeners.forEach((listener) => {
        listener(data);
      });
    });
  }

  onReceive(callback: CallableFunction): void {
    this.listeners.push(callback);
  }
}
