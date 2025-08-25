export enum IpTaskStatus {
  init = 'init',
  todo = 'todo',
  doing = 'doing',
  cancelled = 'cancelled',
  done = 'done',
  customError = 'customError',
  ovhError = 'ovhError',
}

export enum IpTaskFunction {
  genericMoveFloatingIp = 'genericMoveFloatingIp',
  arinBlockReassign = 'arinBlockReassign',
  changeRipeOrg = 'changeRipeOrg',
  checkAndReleaseIp = 'checkAndReleaseIp',
  supernetByoipFailoverPartitioning = 'supernetByoipFailoverPartitioning',
}

export type IpTask = {
  /**
   * Details of this task
   */
  comment: string | null;

  /**
   * Destination for moveFloatingIp tasks
   */
  destination: {
    /**
     * Service where IP is routed to
     */
    serviceName: string | null;
  } | null;

  /**
   * Completion date (ISO date-time string)
   */
  doneDate: string | null;

  /**
   * Function name
   */
  function: IpTaskFunction;

  /**
   * Last update (ISO date-time string)
   */
  lastUpdate: string | null;

  /**
   * Task creation date (ISO date-time string)
   */
  startDate: string;

  /**
   * Task status
   */
  status: IpTaskStatus;

  /**
   * The ID of the task
   */
  taskId: number;
};
