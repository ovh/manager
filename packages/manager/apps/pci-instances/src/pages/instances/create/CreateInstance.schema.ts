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

export const sshNameSchema = z.string().min(1);

export const sshKeySchema = z.string().regex(sshKeyRegex);

export const addSshKeyFormSchema = z.object({
  sshName: sshNameSchema,
  sshKey: sshKeySchema,
});

export type TAddSshKeyForm = z.infer<typeof addSshKeyFormSchema>;
