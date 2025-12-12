import { z } from 'zod';
import { instanceNameRegex, sshKeyRegex } from '@/constants';
import { DEPLOYMENT_MODES } from '@/types/instance/common.type';

export const nameSchema = z.string().regex(instanceNameRegex);

export const deploymentModesSchema = z.array(z.enum(DEPLOYMENT_MODES));

export const continentSelectionSchema = z.string();

export const macroRegionSelectionSchema = z.string().nullable();

export const flavorCategorySchema = z.string().nullable();

export const flavorTypeSchema = z.string().nullable();

export const flavorIdSchema = z.string().nullable();

export const microRegionSelectionSchema = z.string().nullable();

export const availabilityZoneSelectionSchema = z.string().nullable();

export const quantityRules = {
  min: 1,
  max: 5,
};

export const quantitySchema = z
  .number()
  .min(quantityRules.min)
  .max(quantityRules.max);

export const distributionImageTypeSchema = z.string().nullable();

export const distributionImageVariantIdSchema = z.string().nullable();

export const distributionImageVersionSchema = z.object({
  distributionImageVersionId: z.string().nullable(),
  distributionImageVersionName: z.string().nullable(),
});

export type TDistributionImageVersion = z.infer<
  typeof distributionImageVersionSchema
>;

export const distributionImageVersionNameSchema = z.string().nullable();

export const distributionImageOsTypeSchema = z.string().nullable();

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

export const networkIdSchema = z.string().nullable();
