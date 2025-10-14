import { ContactMeanType } from './contact-mean.type';

export type NotificationRoutingContactMean = {
  id: string;
  email: string;
  type: ContactMeanType;
};

export type NotificationRoutingCondition = {
  category: string[];
  priority: string[];
};

export type NotificationRoutingRule = {
  continue: boolean;
  condition: NotificationRoutingCondition;
  contactMeans: NotificationRoutingContactMean[];
};

export type NotificationRouting = {
  active: boolean;
  createdAt: string;
  id: string;
  name: string;
  rules: NotificationRoutingRule[];
};
