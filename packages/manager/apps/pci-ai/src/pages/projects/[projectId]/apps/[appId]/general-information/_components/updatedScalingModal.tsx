import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { ai } from '@/models/types';
import { Switch } from '@/components/ui/switch';
import ResourceInput from '@/components/number-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export interface UpdateScalingSubmitData {
  fixed?: {
    replicas: number;
  };
  automatic?: {
    replicasMin: number;
    replicasMax: number;
    averageUsageTarget: number;
  };
}

interface UpdateScalingModalProps {
  app: ai.app.App;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateScalingSubmitData) => void;
}

const UpdateScalingModal = ({
  app,
  open,
  onClose,
  onSubmit,
}: UpdateScalingModalProps) => {
  const [scaling, setScaling] = useState(false);
  const automaticMaxReplicas: number = 100;
  const fixedMaxReplicas: number = 10;
  useEffect(() => {
    if (app.spec.scalingStrategy?.automatic) {
      setScaling(true);
    }
  }, [app.spec.scalingStrategy]);

  //Fixed FORM Management
  const schema = z
    .object({
      replicas: z.coerce
        .number()
        .min(1)
        .max(fixedMaxReplicas),
      replicasMin: z.coerce
        .number()
        .min(1)
        .max(automaticMaxReplicas),
      replicasMax: z.coerce
        .number()
        .min(1)
        .max(automaticMaxReplicas),
      resourceType: z.enum(
        [
          ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
          ai.app.ScalingAutomaticStrategyResourceTypeEnum.RAM,
        ],
        {
          required_error: 'You need to select a resource type.',
        },
      ),
      averageUsageTarget: z.coerce
        .number()
        .min(1)
        .max(100),
    })
    .superRefine((values, context) => {
      if (scaling && values.replicasMax < values.replicasMin) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: ' ',
          path: ['replicasMin'],
        });
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Maximum replicas should be higher than minimum replicas',
          path: ['replicasMax'],
        });
      }
    });

  type ValidationSchema = z.infer<typeof schema>;

  // generate a fixedForm controller
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      replicas: app.spec.scalingStrategy?.fixed?.replicas || 1,
      replicasMin: app.spec.scalingStrategy?.automatic?.replicasMin || 1,
      replicasMax: app.spec.scalingStrategy?.automatic?.replicasMax || 1,
      resourceType:
        app.spec.scalingStrategy?.automatic?.resourceType ||
        ai.app.ScalingAutomaticStrategyResourceTypeEnum.CPU,
      averageUsageTarget:
        app.spec.scalingStrategy?.automatic?.averageUsageTarget || 75,
    },
  });

  const submitAndForward: SubmitHandler<ValidationSchema> = (formValues) => {
    form.reset();
    console.log('form value');
    console.log(formValues);
    const fixedScalingData: UpdateScalingSubmitData = {
      fixed: {
        replicas: formValues.replicas,
      },
    };
    onSubmit(fixedScalingData);
  };

  const handleClose = (value: boolean) => {
    if (value) return;
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modify scaling</DialogTitle>
          <div>
            <p className="my-3">
              Pick the deployment strategy that best suits your app. Choose a
              fixed size for the number of replicas your app will be deployed
              on, or specify a minimum and maximum number of replicas for your
              deployments. This will dynamically optimise performance, and adapt
              to the number of requests via the auto-scaling option.
            </p>
          </div>
          <p className="mt-1 text-xs font-semibold">Strategy</p>
          <div className="flex flew-row font-semibold">
            <Switch
              className="rounded-xl mr-4"
              id="sclaing"
              checked={scaling}
              onCheckedChange={(checked: boolean) => setScaling(checked)}
            />
            {scaling ? (
              <h3>Auto-scaling enabled</h3>
            ) : (
              <h3>Auto-scaling disabled</h3>
            )}
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitAndForward)}
              className="space-y-6"
            >
              {scaling ? (
                <div>
                  <div className="my-6">
                    <FormField
                      control={form.control}
                      name="replicasMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Minimum replicas</FormLabel>
                          <FormControl>
                            <ResourceInput
                              value={field.value!}
                              onChange={(newValue) =>
                                form.setValue('replicasMin', newValue)
                              }
                              min={1}
                              max={automaticMaxReplicas}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="replicasMax"
                      render={({ field }) => (
                        <FormItem className='mt-2'>
                          <FormLabel className="mt-2 font-semibold">
                            Maximum replicas
                          </FormLabel>
                          <FormControl>
                            <ResourceInput
                              value={field.value!}
                              onChange={(newValue: number) =>
                                form.setValue('replicasMax', newValue)
                              }
                              min={1}
                              max={automaticMaxReplicas}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="my-6">
                    <FormField
                      control={form.control}
                      name="resourceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Metric monitored</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flew-row"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    value={
                                      ai.app
                                        .ScalingAutomaticStrategyResourceTypeEnum
                                        .CPU
                                    }
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  CPU
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    value={
                                      ai.app
                                        .ScalingAutomaticStrategyResourceTypeEnum
                                        .RAM
                                    }
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  RAM
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="averageUsageTarget"
                      defaultValue={1}
                      render={({ field }) => (
                        <FormItem className='mt-2'>
                          <FormLabel className="mt-2 font-semibold">
                            Trigger threshold (%)
                          </FormLabel>
                          <FormControl>
                            <ResourceInput
                              value={field.value}
                              onChange={(newValue: number) =>
                                form.setValue('averageUsageTarget', newValue)
                              }
                              min={1}
                              max={100}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="mt-0 text-xs">
                            The metric value, in percent.
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Alert variant="warning">
                    <AlertTriangle className="text-amber-900 h-4 w-4" />
                    <p>
                      The total price of the deployment is calculated based on
                      the minimum number of replicas selected. Please note that
                      this cost may increase when auto-scaling is enabled.
                    </p>
                  </Alert>
                </div>
              ) : (
                <div className="my-6">
                  <FormField
                    control={form.control}
                    name="replicas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='font-semibold'>
                          Number of replicas your app will be deployed on
                        </FormLabel>
                        <FormControl>
                          <ResourceInput
                            value={field.value}
                            onChange={(newValue: number) =>
                              form.setValue('replicas', newValue)
                            }
                            min={1}
                            max={fixedMaxReplicas}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="mt-0 text-xs">
                          Deploy on a minimum of 2 replicas for high
                          availability
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <p className="mt-6">Total deployment price</p>
              <DialogFooter className="flex justify-end">
                <DialogClose asChild></DialogClose>
                <Button type="submit">Confirm</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateScalingModal;
