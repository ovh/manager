import {
  instanceCreationSchema,
  TInstanceCreationForm,
} from '@/pages/instances/create/CreateInstance.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { PropsWithChildren } from 'react';
import { useForm, FormProvider, DefaultValues } from 'react-hook-form';

export const TestCreateInstanceFormWrapper = ({
  children,
  defaultValues,
}: PropsWithChildren<{
  defaultValues?: DefaultValues<TInstanceCreationForm>;
}>) => {
  const form = useForm<TInstanceCreationForm>({
    resolver: zodResolver(instanceCreationSchema),
    defaultValues,
    mode: 'onChange',
  });

  return <FormProvider {...form}>{children}</FormProvider>;
};
