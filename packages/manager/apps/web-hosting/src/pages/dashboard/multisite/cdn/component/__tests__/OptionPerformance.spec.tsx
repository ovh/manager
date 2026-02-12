import React from 'react';

import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CdnFormValues } from '@/data/types/product/cdn';
import dashboardTranslation from '@/public/translations/dashboard/Messages_fr_FR.json';
import { wrapper } from '@/utils/test.provider';
import { getDomRect } from '@/utils/test.setup';

import { OptionPerformance } from '../OptionPerformance';

const TestWrapper = ({
  children,
  controlValues = {} as CdnFormValues,
}: {
  children: (control: ReturnType<typeof useForm<CdnFormValues>>['control']) => React.ReactNode;
  controlValues?: CdnFormValues;
}) => {
  const { control } = useForm<CdnFormValues>({
    defaultValues: controlValues,
  });
  return <>{children(control)}</>;
};

describe('OptionPerformance', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    vi.clearAllMocks();
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });
  it('should render correctly', () => {
    const { container } = render(
      <TestWrapper>
        {(control) => (
          <OptionPerformance
            controlValues={{} as CdnFormValues}
            control={control}
            optionsData={[]}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );
    expect(container).toBeInTheDocument();
  });

  it('should display performance category title', () => {
    render(
      <TestWrapper>
        {(control) => (
          <OptionPerformance
            controlValues={{} as CdnFormValues}
            control={control}
            optionsData={[]}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    expect(
      screen.getByText(dashboardTranslation.cdn_shared_option_category_performance),
    ).toBeInTheDocument();
  });

  it('should display always online toggle', () => {
    render(
      <TestWrapper>
        {(control) => (
          <OptionPerformance
            controlValues={{} as CdnFormValues}
            control={control}
            optionsData={[]}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    expect(
      screen.getByText(dashboardTranslation.cdn_shared_option_always_online_title),
    ).toBeInTheDocument();
  });
});
