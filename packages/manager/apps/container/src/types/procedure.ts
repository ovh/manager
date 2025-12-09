export enum Procedures {
  INDIA,
  FRAUD,
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
