export type OKMS = {
  id: string;
  region: string;
  kmiEndpoint: string;
  restEndpoint: string;
  iam: IAM;
};

export type IAM = {
  displayName: string;
  id: string;
  urn: string;
};
