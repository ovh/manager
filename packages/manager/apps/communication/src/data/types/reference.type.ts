export type Reference = {
  description: string;
  name: string;
};

export type NotificationReference = {
  categories: Reference[];
  priorities: Reference[];
};
