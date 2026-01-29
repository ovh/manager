import { z } from 'zod';

export const rebuildSchema = z.object({
  imageId: z.string().min(1, 'Image is required'),
  sshKey: z.enum(['none', 'manual']).default('none'),
  publicSshKey: z.string().optional(),
  doNotSendPassword: z.boolean().default(false),
  installRTM: z.boolean().default(false),
  confirmed: z.boolean().refine((val) => val === true, {
    message: 'You must confirm to proceed',
  }),
});

export type TRebuildFormValues = z.infer<typeof rebuildSchema>;

export const defaultRebuildValues: TRebuildFormValues = {
  imageId: '',
  sshKey: 'none',
  publicSshKey: '',
  doNotSendPassword: false,
  installRTM: false,
  confirmed: false,
};
