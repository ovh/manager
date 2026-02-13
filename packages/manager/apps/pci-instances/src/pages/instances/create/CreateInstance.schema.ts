import { z } from 'zod';
import { instanceNameRegex, sshKeyRegex } from '@/constants';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { BILLING_TYPE, DEPLOYMENT_MODES } from '@/types/instance/common.type';

export const nameSchema = z.string().regex(instanceNameRegex);

export const deploymentModesSchema = z.array(z.enum(DEPLOYMENT_MODES));

export const continentSelectionSchema = z.string();

export const macroRegionSelectionSchema = z.string().nullable();

export const flavorCategorySchema = z.string().nullable();

export const flavorTypeSchema = z.string().nullable();

export const flavorIdSchema = z.string().nullable();

export const microRegionSelectionSchema = z.string().nullable();

export const backupImageSchema = z
  .object({
    id: z.string(),
    region: z.string(),
    name: z.string(),
  })
  .nullable();

export const billingTypeSelectionSchema = z.nativeEnum(BILLING_TYPE);

export const availabilityZoneSelectionSchema = z.string().nullable();

export const quantityDefaultValue = 1;

export const quantitySchema = z
  .number()
  .refine((val) => val >= quantityDefaultValue);

export const distributionImageTypeSchema = z.enum([
  'linux',
  'apps',
  'windows',
  'backups',
]);

export const distributionImageVariantIdSchema = z.string().nullable();

export const distributionImageVersionSchema = z.object({
  distributionImageVersionId: z.string().nullable(),
  distributionImageVersionName: z.string().nullable(),
});

export type TDistributionImageVersion = z.infer<
  typeof distributionImageVersionSchema
>;

export const distributionImageVersionNameSchema = z.string().nullable();

export const distributionImageOsTypeSchema = z
  .enum(['baremetal-linux', 'bsd', 'linux', 'windows'])
  .nullable();

export const sshKeyIdSchema = z
  .string()
  .nonempty()
  .nullable();

export const sshPublicKeySchema = z
  .string()
  .trim()
  .regex(sshKeyRegex);

type TAddSshKeyFormSchemaBuilderArgs = Partial<{
  unavailableSshKeyIds: string[];
  requiredMessageError: string;
  unavailableNameError: string;
}>;

export const buildAddSshKeyFormSchema = ({
  unavailableSshKeyIds = [],
  requiredMessageError: requiredError,
  unavailableNameError,
}: TAddSshKeyFormSchemaBuilderArgs = {}) =>
  z.object({
    sshKeyId: z
      .string()
      .nonempty(requiredError)
      .refine((id) => !unavailableSshKeyIds.includes(id), {
        message: unavailableNameError,
      }),
    sshPublicKey: sshPublicKeySchema,
  });

export type TAddSshKeyForm = z.infer<
  ReturnType<typeof buildAddSshKeyFormSchema>
>;

export const subnetIdSchema = z.string().nullable();

const VLAN_ID_MIN = 0;
const VLAN_ID_MAX = 4000;
const SUBNET_MASK_MIN = 9;
const SUBNET_MASK_MAX = 29;
const NETWORK_NAME_LENGTH = 255;

const ipSchema = z.string().ip();
const maskSchema = z
  .number()
  .min(SUBNET_MASK_MIN)
  .max(SUBNET_MASK_MAX);

export const networkSchema = z
  .object({
    name: z
      .string()
      .max(NETWORK_NAME_LENGTH)
      .nonempty(`${NAMESPACES.FORM}:error_required_field`),
    vlanId: z.custom<number>(
      (id) =>
        id !== ''
          ? z.coerce
              .number()
              .min(VLAN_ID_MIN)
              .max(VLAN_ID_MAX)
              .safeParse(id).success
          : false,
      'creation:pci_instance_creation_network_add_new_vlanId_error',
    ),
    cidr: z.string().refine((value) => {
      const [ip, mask] = value.split('/');
      return (
        ipSchema.safeParse(ip).success &&
        maskSchema.safeParse(Number(mask)).success
      );
    }),
    enableDhcp: z.boolean(),
  })
  .nullable();

export const localBackupRotationSchema = z.string().nullable();

export const distantBackupLocalizationSchema = z.string().nullable();

export const willGatewayBeAttachedSchema = z.boolean();

export const ipPublicTypeSchema = z.enum(['basicIp', 'floatingIp']).nullable();

export const floatingIpAssignmentSchema = z
  .enum(['createNew', 'reuseExisting'])
  .nullable();

export const existingFloatingIpIdSchema = z.string().nullable();

export const postInstallScriptSchema = z.string().nullable();

export type TAddNetworkForm = z.infer<typeof networkSchema>;
export type TInstanceCreationForm = z.infer<typeof instanceCreationSchema>;
export const instanceCreationSchema = z.object({
  name: nameSchema,
  quantity: quantitySchema,
  deploymentModes: deploymentModesSchema,
  continent: continentSelectionSchema,
  flavorCategory: flavorCategorySchema,
  flavorType: flavorTypeSchema,
  flavorId: flavorIdSchema,
  macroRegion: macroRegionSelectionSchema,
  microRegion: microRegionSelectionSchema,
  availabilityZone: availabilityZoneSelectionSchema,
  distributionImageType: distributionImageTypeSchema,
  distributionImageVariantId: distributionImageVariantIdSchema,
  distributionImageVersion: distributionImageVersionSchema,
  distributionImageOsType: distributionImageOsTypeSchema,
  backup: backupImageSchema,
  sshKeyId: sshKeyIdSchema,
  newSshPublicKey: sshPublicKeySchema.nullable(),
  subnetId: subnetIdSchema,
  newPrivateNetwork: networkSchema,
  willGatewayBeAttached: willGatewayBeAttachedSchema,
  ipPublicType: ipPublicTypeSchema,
  floatingIpAssignment: floatingIpAssignmentSchema,
  existingFloatingIpId: existingFloatingIpIdSchema,
  billingType: billingTypeSelectionSchema,
  localBackupRotation: localBackupRotationSchema,
  distantBackupLocalization: distantBackupLocalizationSchema,
  postInstallScript: postInstallScriptSchema,
});
