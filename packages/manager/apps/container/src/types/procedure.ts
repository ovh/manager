export enum Procedures {
  INDIA,
  FRAUD,
}

export type Procedure = {
  status: 'ok' | 'open' | 'required';
  ticketId: string;
};
