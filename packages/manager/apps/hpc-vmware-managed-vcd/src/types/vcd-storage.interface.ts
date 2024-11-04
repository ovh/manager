export interface IVcdStorageState {
  billingType: string;
  capacity: number;
  name: string;
  profile: string;
  type: string;
}

interface IVcdStorageTask {
  id: string;
  link: string;
  status: string;
  type: string;
}

export default interface IVcdStorage {
  id: string;
  resourceStatus: string;
  currentState: IVcdStorageState;
  currentTasks?: IVcdStorageTask[];
}
