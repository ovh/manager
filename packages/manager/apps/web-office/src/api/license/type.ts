export type LicenseType = {
  address: string;
  city: string;
  creationDate: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phone: string;
  serviceName: string;
  serviceType: string;
  status: string;
  zipCode: string;
  iam: {
    id: string;
    urn: string;
  };
  [key: string]: string | { id: string; urn: string };
};

export type GetOfficeLicenseServiceParams = {
  serviceName?: string;
};
