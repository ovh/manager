export interface PublicCloudProject {
  access: string;
  creationDate: string;
  description: string;
  expiration: string;
  iam: {
    id: string;
    urn: string;
  };
  orderId: number;
  planCode: string;
  project_id: string;
  projectName: string;
  unleash: boolean;
  status: string;
  manualQuota: boolean;
}
