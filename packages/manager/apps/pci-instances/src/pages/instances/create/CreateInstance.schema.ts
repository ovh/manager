import { z } from 'zod';
import { instanceNameRegex } from '@/constants';
import { DEPLOYMENT_MODES } from '@/types/instance/common.type';

export const nameSchema = z.string().regex(instanceNameRegex);

export const deploymentModesSchema = z.array(z.enum(DEPLOYMENT_MODES));

export const continentSelectionSchema = z.string();

export const macroRegionSelectionSchema = z.string().nullable();

export const flavorCategorySchema = z.string();

export const flavorTypeSchema = z.string();

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
