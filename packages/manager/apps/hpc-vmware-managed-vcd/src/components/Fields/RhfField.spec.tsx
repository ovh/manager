import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod/v3';
import { RhfField } from '.';

const SCHEMA = z.object({
  inputTest: z.string().max(5),
});

const HELPER_MESSAGE = 'Do not write more 5 caracters';

const FieldRender = ({ defaultValue = '' }) => {
  const methods = useForm<z.infer<typeof SCHEMA>>({
    resolver: zodResolver(SCHEMA),
    mode: 'all',
    defaultValues: {
      inputTest: defaultValue,
    },
  });

  methods.trigger('inputTest');

  return (
    <FormProvider {...methods}>
      <form>
        <RhfField
          data-testid="rhfField"
          controllerParams={methods.register('inputTest')}
          helperMessage={HELPER_MESSAGE}
        >
          <RhfField.Label>My Input</RhfField.Label>
          <RhfField.Quantity data-testid="inputTest" />
          <RhfField.HelperAuto />
        </RhfField>
      </form>
    </FormProvider>
  );
};

describe('RhfField component unit test suite', () => {
  it('should render field with correct helper', async () => {
    const { getByText } = render(<FieldRender />);

    expect(getByText('My Input')).toBeVisible();
    expect(getByText(HELPER_MESSAGE)).toBeVisible();
  });

  it('should render field with correct error', async () => {
    const { getByTestId, queryByText } = render(
      <FieldRender defaultValue="too lonnnnnng chain" />,
    );

    await waitFor(
      () => {
        expect(queryByText(HELPER_MESSAGE)).not.toBeInTheDocument();
        expect(getByTestId('rhfField')).toHaveAttribute(
          'error',
          HELPER_MESSAGE,
        );
      },
      { timeout: 500 },
    );
  });
});
