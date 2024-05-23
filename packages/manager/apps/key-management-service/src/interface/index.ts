export type OKMS = {
  id: string;
  region: string;
  kmipEndpoint: string;
  restEndpoint: string;
  iam: IAM;
};

export type IAM = {
  displayName: string;
  id: string;
  urn: string;
};
