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

export const distributionImageNameSchema = z.string().nullable();

export const sshNameSchema = z.string().nonempty();

export const sshIdSchema = z.string().optional();

export const sshKeySchema = z
  .string()
  .trim()
  .regex(sshKeyRegex);

type TAddSshKeyFormSchemaBuilderArgs = Partial<{
  unavailableNames: string[];
  requiredError: string;
  unavailableNameError: string;
}>;

export const buildAddSshKeyFormSchema = ({
  unavailableNames = [],
  requiredError,
  unavailableNameError,
}: TAddSshKeyFormSchemaBuilderArgs = {}) =>
  z.object({
    sshName: z
      .string()
      .nonempty(requiredError)
      .refine((name) => !unavailableNames.includes(name), {
        message: unavailableNameError,
      }),
    sshKey: sshKeySchema,
  });

export type TAddSshKeyForm = z.infer<
  ReturnType<typeof buildAddSshKeyFormSchema>
>;
