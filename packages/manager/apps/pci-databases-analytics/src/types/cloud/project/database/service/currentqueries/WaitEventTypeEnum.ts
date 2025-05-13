/** Possible event type on which the backend is waiting */
export enum WaitEventTypeEnum {
  'ACTIVITY' = 'ACTIVITY',
  'BUFFER_PIN' = 'BUFFER_PIN',
  'CLIENT' = 'CLIENT',
  'EXTENSION' = 'EXTENSION',
  'IO' = 'IO',
  'IPC' = 'IPC',
  'LOCK' = 'LOCK',
  'LWLOCK' = 'LWLOCK',
  'TIMEOUT' = 'TIMEOUT',
}
