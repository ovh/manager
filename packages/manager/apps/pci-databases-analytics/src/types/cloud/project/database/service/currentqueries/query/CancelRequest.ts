/** Cloud database service current queries query cancel request */
export interface CancelRequest {
  /** Database server connection ID */
  pid: number;
  /** Request immediate termination instead of soft cancel */
  terminate: boolean;
}
