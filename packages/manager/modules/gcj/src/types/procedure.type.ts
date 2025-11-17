export enum Procedures {
  DIABLE_2FA,
  INDIA,
  FRAUD,
  GDPR,
}

export enum ProcedureStatus {
  Ok = 'ok',
  Open = 'open',
  Required = 'required',
}

export type Procedure = {
  status: ProcedureStatus;
  ticketId: string;
};
