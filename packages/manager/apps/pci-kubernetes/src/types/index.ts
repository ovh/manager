import { z } from 'zod';

import { OvhSubsidiary } from '@ovh-ux/manager-react-components';

import { pluginData } from '@/api/data/plugins';
import { isBase64 } from '@/helpers';

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
  issuerUrl = 'https://your-identity-provider.com',
  clientId = 'k8s-client',
  caContent = '"LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t...\n\t<base64-encoded CA content continues here>"',
  groupsClaim = 'groups',
  groupsPrefix = 'oidc:',
  requiredClaim = 'group=admin,group=dev-team',
  usernameClaim = 'sub',
  usernamePrefix = 'oidc:',
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
  plan: TClusterPlan;
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

export enum TClusterPlanEnum {
  FREE = 'free',
  STANDARD = 'standard',
}

export type TClusterPlan = (typeof TClusterPlanEnum)[keyof typeof TClusterPlanEnum];

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
        'pci_projects_project_kubernetes_details_service_upsert_oidc_provider_issue_url_error',
    })
    .refine((url) => url.startsWith('https://'), {
      message:
        'pci_projects_project_kubernetes_details_service_upsert_oidc_provider_issue_https_error',
    }),
  clientId: z.string().min(1, { message: 'common:common_field_error_required' }),
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
  groupsPrefix: z.string().nullable().optional(),
  requiredClaim: z
    .string()
    .nullable()
    .optional()
    .superRefine((value, ctx) => {
      if (!value) return;
      if (/,,/.test(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'pci_projects_project_kubernetes_details_service_oidc_provider_field_required_claim_comma_error',
        });
      }
      if (!/^([\w-]+=[\w-]+)(,([\w-]+=[\w-]+))*$/.test(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'pci_projects_project_kubernetes_details_service_oidc_provider_field_required_claim_error',
        });
      }
    }),
  signingAlgorithms: z.array(z.nativeEnum(SigningAlgorithms)).nullable().optional(),
  usernameClaim: z.string().nullable().optional(),
  usernamePrefix: z.string().nullable().optional(),
});

export type FormValues = z.infer<typeof oidcSchema>;

export type TOidcFormValues = Omit<FormValues, 'clientId | issuerUrl'> & {
  clientId: string;
  issuerUrl: string;
};

export type TOidcProvider = {
  issuerUrl: string;
  clientId: string;
  caContent?: string;
  groupsClaim?: string[];
  groupsPrefix?: string;
  requiredClaim?: string[];
  signingAlgorithms?: SigningAlgorithms[];
  usernameClaim?: string;
  usernamePrefix?: string;
};

export enum DeploymentMode {
  MULTI_ZONES = 'region-3-az',
  MONO_ZONE = 'region',
  LOCAL_ZONE = 'localzone',
}

export type UrlRecord = { [Key in OvhSubsidiary]?: string } & {
  DEFAULT: string;
};

export type TScalingState = {
  quantity: {
    desired: number;
    min: number;
    max: number;
  };
  isAutoscale: boolean;
};

export type NodePoolState = {
  name: string;
  isTouched: boolean;
  scaling: TScalingState;
  antiAffinity: boolean;
  selectedAvailabilityZone?: string;
};

export type TCreateNodePoolParam = {
  flavorName: string;
  name: string;
  availabilityZones?: string[];
  antiAffinity: boolean;
  monthlyBilled: boolean;
  autoscale: boolean;
  minNodes?: number;
  desiredNodes: number;
  maxNodes?: number;
};

export type TPlan = {
  title: string;
  type: DeploymentMode;
  description: string;
  content: string[];
  footer?: string;
  value: TClusterPlan;
  code: string;
  price: number | null;
};

export type NodePool = {
  name: string;
  antiAffinity: boolean;
  autoscale: boolean;
  availabilityZones?: string[];
  desiredNodes: number;
  minNodes?: number;
  localisation: string | null;
  flavorName: string;
  maxNodes?: number;
  monthlyBilled: boolean;
};

export type NodePoolPrice = NodePool & { monthlyPrice: number };
