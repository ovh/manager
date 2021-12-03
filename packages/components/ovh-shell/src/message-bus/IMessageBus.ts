import { IShellMessage } from '../common';

export default interface IMessageBus {
  send: <T>(data: IShellMessage<T>) => void;
  onReceive: <T>(callback: (message: T) => void) => void;
}
