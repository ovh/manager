type Status = "pending" | "in-progress" | "done" | "failed"; 

export type ClusterWithIAM = {
  id: string;
  iam: {
    id: string;
    urn: string;
    displayName: string;
  };
  model: string;
  nodes: {
    id: string;
    serverId: number;
    serverName: string;
  }[];
  region: string;
  status: Status;
};
