export type DashboardTab = {
  name: string;
  title: string;
  to: string;
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
