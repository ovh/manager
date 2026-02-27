import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderOptions, render } from '@testing-library/react';
import { DeepPartial, FormProvider, useForm } from 'react-hook-form';

import { CreateShareFormValues, createShareSchema } from '@/pages/create/schema/CreateShare.schema';

type TRenderWithMockedFormOptions = {
  defaultValues?: DeepPartial<CreateShareFormValues>;
  onFormChange?: (values: DeepPartial<CreateShareFormValues>) => void;
};

type TRenderWithMockedForm = (
  ui: React.ReactElement,
  options?: RenderOptions & TRenderWithMockedFormOptions,
) => ReturnType<typeof render>;

export const renderWithMockedForm: TRenderWithMockedForm = (
  ui,
  { defaultValues, onFormChange, ...renderOptions } = {},
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    const form = useForm<CreateShareFormValues>({
      resolver: zodResolver(createShareSchema),
      defaultValues: {
        deploymentModes: [],
        continent: 'all',
        macroRegion: '',
        ...defaultValues,
        shareData: {
          name: '',
          microRegion: '',
          specName: '',
          size: 150,
          ...defaultValues?.shareData,
        },
        availabilityZone: null,
      },
      mode: 'onChange',
    });

    useEffect(() => {
      // eslint-disable-next-line react-hooks/incompatible-library
      const subscription = form.watch((values) => {
        onFormChange?.(values as Partial<CreateShareFormValues>);
      });

      return () => subscription.unsubscribe();
    }, [form]);

    return (
      <QueryClientProvider client={queryClient}>
        <FormProvider {...form}>{children}</FormProvider>
      </QueryClientProvider>
    );
  };

  return render(ui, {
    wrapper: TestWrapper,
    ...renderOptions,
  });
};
