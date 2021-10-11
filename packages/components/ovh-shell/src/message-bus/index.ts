export default interface MessageBus {
  send: (data: unknown) => void;
  onReceive: (callback: CallableFunction) => void;
}
