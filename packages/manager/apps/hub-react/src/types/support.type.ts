export type Ticket = {
  serviceName: string;
  state: string;
  subject: string;
  ticketId: string;
};

export type SupportDataResponse = {
  count: number;
  data: Ticket[];
};
