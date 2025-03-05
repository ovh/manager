export enum KycProcedures {
  INDIA = 'identity',
  FRAUD = 'fraud',
}

export enum KycStatuses {
  OK = 'ok',
  OPEN = 'open',
  REQUIRED = 'required',
}

export type KycStatus = {
  status: string;
  ticketId?: string;
};
