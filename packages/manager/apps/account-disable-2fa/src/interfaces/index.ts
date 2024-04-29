export type Status2fa = {
  ticketId: string;
  status: 'open' | 'creationAuthorized';
};

export type Status2faStrategies = { [K in Status2fa['status']]: string };
