export const allDomManagerService = 'ALL_DOM';

export const TERMINATE_URL = (serviceName?: string) =>
  serviceName ? `terminate/${serviceName}` : 'terminate';
export const CANCEL_TERMINATE_URL = (serviceName?: string) =>
  serviceName ? `terminate/cancel/${serviceName}` : 'terminate/cancel';
