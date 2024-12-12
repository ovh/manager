import { TemporaryLogsLink } from '../types/dbaas/logs';

export type TMessageLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Tmessage = {
  _id: string;
  timestamp: string;
  source: string;
  level: TMessageLevel;
  message: string;
};

export type TGetLogTailMessagesResponse = {
  messages: {
    message: Tmessage;
  }[];
};

export interface IGetLogTailMessages {
  logTailMessageUrl: TemporaryLogsLink['url'];
}

export const getLogTailMessages = async ({
  logTailMessageUrl,
}: IGetLogTailMessages): Promise<TGetLogTailMessagesResponse> => {
  return fetch(`${logTailMessageUrl}`).then((response) => response.json());
};
