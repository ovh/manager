export type DomainDetails = {
  domain: string;
  additional: string[];
  type: string;
  state: string;
  creationDate: string;
  expirationDate: string;
  setMessage?: ({ status, label }: { status: string; label: string }) => void;
};

export type AttachedDomain = {
  currentState: {
    fqdn: string;
    ssl: {
      status: string;
    };
    hosting: {
      serviceName: string;
    };
  };
};

export type TCertificate = {
  isReportable: boolean;
  provider: string;
  regenerable: boolean;
  status: string;
  taskId?: number;
  type: string;
};
