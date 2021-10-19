export default interface IMessageBus {
  send: (data: unknown) => void;
  onReceive: (callback: CallableFunction) => void;
}
