import { z } from 'zod';
import { pluginData } from '@/api/data/plugins';

export enum SigningAlgorithms {
  ES256 = 'ES256',
  ES384 = 'ES384',
  ES512 = 'ES512',
  PS256 = 'PS256',
  PS384 = 'PS384',
  PS512 = 'PS512',
  RS256 = 'RS256',
  RS384 = 'RS384',
  RS512 = 'RS512',
}

export enum PlaceHolder {
  issuerUrl = 'https://www.ovhcloud.com/fr/',
  clientId = 'my-oidc-client-id',
  usernameClaim = 'sub',
  usernamePrefix = 'oidc:',
  groupsClaim = 'groups',
  requiredClaim = 'group=admin,group=dev-team',
  groupsPrefix = 'oidc:',
  caContent = '"LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t...\n\t<base64-encoded CA content continues here>"',
}

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

// Fonction pour vérifier si une chaîne est une chaîne Base64 valide
function isBase64(str: string) {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}

export const oidcSchema = z.object({
  issuerUrl: z
    .string()
    .url({
      message:
        'pci_projects_project_kubernetes_details_service_upsert_oidc_provider_issue_url_error',
    })
    .refine((url) => url.startsWith('https://'), {
      message:
        'pci_projects_project_kubernetes_details_service_upsert_oidc_provider_issue_https_error',
    }),
  clientId: z
    .string()
    .min(1, { message: 'common:common_field_error_required' }),
  usernameClaim: z.string().optional(),
  usernamePrefix: z.string().optional(),
  groupsClaim: z
    .string()
    .nullable()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        const groupPattern = /^([\w-]+)(,([\w-]+))*$/;
        return groupPattern.test(value);
      },
      {
        message:
          'pci_projects_project_kubernetes_details_service_oidc_provider_field_groups_claim_error',
      },
    ),
  groupsPrefix: z.string().optional(),
  signingAlgorithms: z
    .array(z.nativeEnum(SigningAlgorithms))
    .nullable()
    .optional(),
  caContent: z
    .string()
    .default(`${PlaceHolder.groupsClaim}`)
    .optional()
    .refine(
      (value) => {
        if (value) {
          return isBase64(value);
        }
        return true;
      },
      {
        message:
          'pci_projects_project_kubernetes_details_service_oidc_provider_field_ca_content_error',
      },
    ),
  requiredClaim: z
    .string()
    .nullable()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        const claimPattern = /^([\w-]+=[\w-]+)(,([\w-]+=[\w-]+))*$/;
        return claimPattern.test(value);
      },
      {
        message:
          'pci_projects_project_kubernetes_details_service_oidc_provider_field_required_claim_error',
      },
    ),
});

export type FormValues = z.infer<typeof oidcSchema>;

export type TOidcFormValues = Omit<FormValues, 'clientId | issuerUrl'> & {
  clientId: string;
  issuerUrl: string;
};

export type TOidcProvider = {
  issuerUrl: string;
  clientId: string;
  usernameClaim?: string;
  usernamePrefix?: string;
  groupsClaim?: string[];
  requiredClaim?: string[];
  groupsPrefix?: string;
  signingAlgorithms?: SigningAlgorithms[];
  caContent?: string;
};
