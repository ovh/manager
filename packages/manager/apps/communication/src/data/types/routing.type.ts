import { z } from 'zod';
import { ContactMean } from './contact-mean.type';

export type NotificationRoutingContactMean = Pick<
  ContactMean,
  'id' | 'email' | 'type' | 'status' | 'error'
>;

export type NotificationRoutingCondition = {
  category: string[];
  priority: string[];
};

export type NotificationRoutingRule = {
  continue: boolean;
  condition: NotificationRoutingCondition;
  contactMeans: NotificationRoutingContactMean[];
};

export type NotificationRouting = {
  active: boolean;
  createdAt: string;
  id: string;
  name: string;
  rules: NotificationRoutingRule[];
};

export const CreateRoutingSchema = z
  .object({
    active: z.boolean(),
    name: z
      .string({ required_error: 'error_required_field' })
      .trim()
      .min(1, { message: 'error_required_field' }),
    rules: z
      .array(
        z.object({
          continue: z.boolean(),
          condition: z.object({
            category: z.array(
              z.string({ required_error: 'error_required_field' }),
            ),
            priority: z.array(
              z.string({ required_error: 'error_required_field' }),
            ),
          }),
          contactMeans: z
            .array(
              z.object({
                id: z.string({ required_error: 'error_required_field' }),
              }),
            )
            .min(1, { message: 'error_required_field' }),
        }),
      )
      .min(1, { message: 'error_required_field' }),
  })
  .strip();
export type CreateRouting = z.infer<typeof CreateRoutingSchema>;
