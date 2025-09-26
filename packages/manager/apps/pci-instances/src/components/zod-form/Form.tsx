import { zodResolver } from '@hookform/resolvers/zod';
import { PropsWithChildren } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { TSchemaInput, TSchemaOutput } from '@/input-validation';

export const Form = <Schema extends Parameters<typeof zodResolver>[0]>({
  schema,
  onSubmit,
  values,
  children,
}: PropsWithChildren<{
  schema: Schema;
  onSubmit: SubmitHandler<TSchemaOutput<Schema>>;
  values: TSchemaInput<Schema>;
}>) => {
  const { handleSubmit, formState, ...restForm } = useForm({
    resolver: zodResolver(schema),
    values,
    mode: 'onBlur',
  });

  return (
    <FormProvider
      formState={formState}
      handleSubmit={handleSubmit}
      {...restForm}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};
