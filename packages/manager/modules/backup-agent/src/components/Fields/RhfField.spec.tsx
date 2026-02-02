import React, { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import 'element-internals-polyfill';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { RhfField } from './RhfField.component';

const SCHEMA = z.object({
  inputTest: z.string().max(5),
});

const HELPER_MESSAGE = 'Do not write more 5 caracters';

const FieldRender = ({ defaultValue = '' }) => {
  const { control, register, trigger } = useForm<z.infer<typeof SCHEMA>>({
    resolver: zodResolver(SCHEMA),
    mode: 'all',
    defaultValues: {
      inputTest: defaultValue,
    },
  });

  useEffect(() => {
    void trigger('inputTest');
  }, []);

  return (
    <form>
      <RhfField
        control={control}
        data-testid="rhfField"
        controllerParams={register('inputTest')}
        helperMessage={HELPER_MESSAGE}
      >
        <RhfField.Label>My Input</RhfField.Label>
        <RhfField.Quantity data-testid="inputTest" />
        <RhfField.HelperAuto />
      </RhfField>
    </form>
  );
};

describe('RhfField component unit test suite', () => {
  it('should render field with correct helper', () => {
    const { getByText } = render(<FieldRender />);

    expect(getByText('My Input')).toBeVisible();
    expect(getByText(HELPER_MESSAGE)).toBeVisible();
  });

  it('should render field with correct error', async () => {
    const { getByTestId, queryByText } = render(<FieldRender defaultValue="too lonnnnnng chain" />);

    await waitFor(
      () => {
        expect(queryByText(HELPER_MESSAGE)).not.toBeInTheDocument();
        expect(getByTestId('rhfField')).toHaveAttribute('error', HELPER_MESSAGE);
      },
      { timeout: 500 },
    );
  });
});
