import { z } from 'zod';
import { pluginData } from '@/api/data/plugins';

export type TKube = {
  id: string;
  region: string;
  name: string;
  url: string;
  attachedTo?: string;
  nodesUrl: string;
  version: string;
  nextUpgradeVersions: string[];
  kubeProxyMode: string;
  customization: TClusterCustomization | null;
  status: string;
  updatePolicy: string;
  isUpToDate: boolean;
  controlPlaneIsUpToDate: boolean;
  privateNetworkId: string;
  nodesSubnetId: string;
  loadBalancersSubnetId: string;
  createdAt: string;
  updatedAt: string;
  auditLogsSubscribed: boolean;
  privateNetworkConfiguration: TNetworkConfiguration;
  isClusterReady: boolean;
  plugins: typeof pluginData;
};

export type TAdmissionPlugin = {
  enabled: string[];
  disabled: string[];
};

export type TApiServerCustomization = {
  admissionPlugins: TAdmissionPlugin;
};

export type TClusterCustomization = {
  apiServer: TApiServerCustomization;
};

export type TNetworkConfiguration = {
  privateNetworkRoutingAsDefault: boolean;
  defaultVrackGateway: string;
};

export enum UpdatePolicy {
  NeverUpdate = 'NEVER_UPDATE',
  MinimalDowntime = 'MINIMAL_DOWNTIME',
  AlwaysUpdate = 'ALWAYS_UPDATE',
}

export enum BreakPoints {
  XS = 0,
  SM = 540,
  MD = 720,
  LG = 960,
  XL = 1140,
}

export const oidcSchema = z.object({
  issuerUrl: z
    .string()
    .url({
      message:
        'upsert-oidc-provider:pci_projects_project_kubernetes_details_service_upsert_oidc_provider_issue_url_error',
    })
    .refine((url) => url.startsWith('https://'), {
      message:
        'upsert-oidc-provider:pci_projects_project_kubernetes_details_service_upsert_oidc_provider_issue_https_error',
    }),
  clientId: z
    .string()
    .min(1, { message: 'common:common_field_error_required' }),
  usernameClaim: z.string().optional(),
  usernamePrefix: z.string().optional(),
  groupsClaim: z
    .string()
    .nullable()
    .optional(),
  groupsPrefix: z.string().optional(),
  signingAlgorithms: z
    .string()
    .nullable()
    .optional(),
  caContent: z.string().optional(),
  requiredClaim: z
    .string()
    .nullable()
    .optional(),
});

export type FormValues = z.infer<typeof oidcSchema>;

export type OidcFormValues = Omit<FormValues, 'clientId | issuerUrl'> & {
  clientId: string;
  issuerUrl: string;
};
