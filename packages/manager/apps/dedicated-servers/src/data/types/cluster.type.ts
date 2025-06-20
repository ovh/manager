import { IamObject } from "@ovh-ux/manager-react-components";

type Status = "pending" | "in-progress" | "done" | "failed"; 

export type Cluster = {
  id: string;
  iam: IamObject;
  model: string;
  nodes: {
    id: string;
    serverId: number;
    serverName: string;
  }[];
  region: string;
  status: Status;
};
