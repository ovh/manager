export interface Guide {
  key: string; // guide uniquer identifier
  url: Record<string, string>; // mapping of ovhSubsidiary and URLs
  tracking?: string; // optional data tracking to be sent
}
