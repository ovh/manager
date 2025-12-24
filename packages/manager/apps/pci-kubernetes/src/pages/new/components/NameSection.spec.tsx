import { render } from '@testing-library/react';
import { FieldValues, UseFormReturn, useFormContext } from 'react-hook-form';

import { NameSection } from './NameSection.component';

vi.mock('react-hook-form');

describe('NameSection', () => {
  it('highlights field description when the name field contains error', async () => {
    vi.mocked(useFormContext).mockReturnValue({
      register: () => ({}),
      formState: {
        errors: { name: 'error' },
      },
    } as unknown as UseFormReturn<FieldValues, unknown, undefined>);

    const { getByText } = render(<NameSection />);

    const helper = getByText('kubernetes_add_cluster_name_input_pattern_validation_error');
    expect(helper).toHaveAttribute('aria-live', 'polite');
  });

  it('does not highlight field description when the name field is valid', async () => {
    vi.mocked(useFormContext).mockReturnValue({
      register: () => ({}),
      formState: {
        errors: { name: null },
      },
    } as unknown as UseFormReturn<FieldValues, unknown, undefined>);

    const { getByText } = render(<NameSection />);

    const helper = getByText('kubernetes_add_cluster_name_input_pattern_validation_error');
    expect(helper).not.toHaveAttribute('aria-live');
  });
});
