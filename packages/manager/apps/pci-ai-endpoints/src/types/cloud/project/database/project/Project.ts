export interface IamData {
  displayName: string;
  id: string;
  tags: Record<string, string>;
  urn: string;
}

export interface ProjectData {
  access: string;
  creationDate: string;
  description: string;
  expiration: string;
  iam: IamData;
  manualQuota: boolean;
  orderId: number;
  planCode: string;
  projectName: string;
  project_id: string;
  status: string;
  unleash: boolean;
}
