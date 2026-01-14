import React, { useEffect } from 'react';

import { RenderOptions, render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';

type TRenderWithMockedFormOptions = {
  defaultValues?: Partial<CreateShareFormValues>;
  onFormChange?: (values: Partial<CreateShareFormValues>) => void;
};

type TRenderWithMockedForm = (
  ui: React.ReactElement,
  options?: RenderOptions & TRenderWithMockedFormOptions,
) => ReturnType<typeof render>;

export const renderWithMockedForm: TRenderWithMockedForm = (
  ui,
  { defaultValues, onFormChange, ...renderOptions } = {},
) => {
  const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    const form = useForm<CreateShareFormValues>({
      defaultValues: {
        shareData: {
          name: '',
          microRegion: '',
        },
        deploymentModes: [],
        continent: 'all',
        macroRegion: '',
        ...defaultValues,
      },
    });

    useEffect(() => {
      // eslint-disable-next-line react-hooks/incompatible-library
      const subscription = form.watch((values) => {
        onFormChange?.(values as Partial<CreateShareFormValues>);
      });
      return () => subscription.unsubscribe();
    }, [form]);

    return <FormProvider {...form}>{children}</FormProvider>;
  };

  return render(ui, {
    wrapper: TestWrapper,
    ...renderOptions,
  });
};
