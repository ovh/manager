import { LogSubscription, Stream } from '../data/types/dbaas/logs';

const getStreamSubscription = (subscriptions: LogSubscription[], streamId?: Stream['streamId']) =>
  subscriptions.find((sub) => sub.streamId === streamId);

export default getStreamSubscription;
