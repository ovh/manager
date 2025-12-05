import React from 'react';

import { fireEvent, render, screen, within } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CdnFormValues, CdnOption, CdnOptionType } from '@/data/types/product/cdn';
import dashboardTranslation from '@/public/translations/dashboard/Messages_fr_FR.json';
import { wrapper } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

import { OptionCache } from '../OptionCache';

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

const devmodeOption: CdnOption = {
  name: 'devmode',
  type: CdnOptionType.DEVMODE,
  config: null,
  pattern: null,
  enabled: true,
  extra: null,
};

const querystringOption: CdnOption = {
  name: 'querystring',
  type: CdnOptionType.QUERYSTRING,
  config: null,
  pattern: null,
  enabled: true,
  extra: null,
};

const prewarmOption: CdnOption = {
  name: 'prewarm',
  type: CdnOptionType.PREWARM,
  config: null,
  pattern: null,
  enabled: true,
  extra: {
    usage: 1000,
    quota: 10000,
  },
};

describe('OptionCache', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    const { container } = render(
      <TestWrapper>
        {(control) => (
          <OptionCache
            controlValues={{} as CdnFormValues}
            control={control}
            optionsData={[]}
            advancedPurge={false}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );
    expect(container).toBeInTheDocument();
  });

  it('should display cache category title', () => {
    render(
      <TestWrapper>
        {(control) => (
          <OptionCache
            controlValues={{} as CdnFormValues}
            control={control}
            optionsData={[]}
            advancedPurge={false}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    expect(
      screen.getByText(dashboardTranslation.cdn_shared_option_category_cache),
    ).toBeInTheDocument();
  });

  it('should render devmode toggle when devmode option is available', () => {
    render(
      <TestWrapper>
        {(control) => (
          <OptionCache
            controlValues={{} as CdnFormValues}
            control={control}
            optionsData={[devmodeOption]}
            advancedPurge={false}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    // Check that devmode toggle exists by finding the heading and then the checkbox in that section
    const devmodeHeading = screen.getByRole('heading', {
      name: dashboardTranslation.cdn_shared_option_dev_mode_title,
    });
    const devmodeSection = devmodeHeading.closest('div');
    const devmodeCheckbox = within(devmodeSection).getByRole('checkbox');
    expect(devmodeCheckbox).toBeInTheDocument();
  });

  it('should toggle devmode option', () => {
    render(
      <TestWrapper>
        {(control) => (
          <OptionCache
            controlValues={{} as CdnFormValues}
            control={control}
            optionsData={[devmodeOption]}
            advancedPurge={false}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    const devmodeHeading = screen.getByRole('heading', {
      name: dashboardTranslation.cdn_shared_option_dev_mode_title,
    });
    const devmodeSection = devmodeHeading.closest('div');
    const devmodeToggle = within(devmodeSection).getByRole('checkbox');
    fireEvent.click(devmodeToggle);
    expect(devmodeToggle).toBeChecked();
  });

  it('should render querystring toggle when querystring option is available', () => {
    render(
      <TestWrapper>
        {(control) => (
          <OptionCache
            controlValues={{} as CdnFormValues}
            control={control}
            optionsData={[querystringOption]}
            advancedPurge={false}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    // Check that querystring toggle exists by finding the heading and then the checkbox in that section
    const querystringHeading = screen.getByRole('heading', {
      name: dashboardTranslation.cdn_shared_option_query_string_title,
    });
    const querystringSection = querystringHeading.closest('div');
    const querystringCheckbox = within(querystringSection).getByRole('checkbox');
    expect(querystringCheckbox).toBeInTheDocument();
  });

  it('should show querystring select when querystring is enabled', () => {
    const controlValues = { querystring: true } as unknown as CdnFormValues;
    render(
      <TestWrapper controlValues={controlValues}>
        {(control) => (
          <OptionCache
            controlValues={controlValues}
            control={control}
            optionsData={[querystringOption]}
            advancedPurge={false}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('should render prewarm quota when prewarm is enabled', () => {
    const controlValues = { prewarm: true } as unknown as CdnFormValues;
    render(
      <TestWrapper controlValues={controlValues}>
        {(control) => (
          <OptionCache
            controlValues={controlValues}
            control={control}
            optionsData={[prewarmOption]}
            advancedPurge={false}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    expect(
      screen.getByText(dashboardTranslation.cdn_shared_option_prewarm_quota),
    ).toBeInTheDocument();
    expect(
      screen.getByText(dashboardTranslation.cdn_shared_option_prewarm_btn_edit_urls),
    ).toBeInTheDocument();
  });

  it('should navigate to edit URLs page when prewarm edit button is clicked', () => {
    const controlValues = { prewarm: true } as unknown as CdnFormValues;
    render(
      <TestWrapper controlValues={controlValues}>
        {(control) => (
          <OptionCache
            controlValues={controlValues}
            control={control}
            optionsData={[prewarmOption]}
            advancedPurge={false}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    const editButton = screen.getByText(
      dashboardTranslation.cdn_shared_option_prewarm_btn_edit_urls,
    );
    fireEvent.click(editButton);
    expect(navigate).toHaveBeenCalled();
  });

  it('should display advanced flush info for basic and security when advancedPurge is false', () => {
    render(
      <TestWrapper>
        {(control) => (
          <OptionCache
            controlValues={{} as CdnFormValues}
            control={control}
            optionsData={[]}
            advancedPurge={false}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    expect(
      screen.getByText(
        dashboardTranslation.cdn_shared_option_advanced_flush_info_for_basic_and_security,
      ),
    ).toBeInTheDocument();
  });

  it('should display advanced flush info when advancedPurge is true', () => {
    render(
      <TestWrapper>
        {(control) => (
          <OptionCache
            controlValues={{} as CdnFormValues}
            control={control}
            optionsData={[]}
            advancedPurge={true}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    expect(
      screen.getByText(dashboardTranslation.cdn_shared_option_advanced_flush_info),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        dashboardTranslation.cdn_shared_option_advanced_flush_info_for_basic_and_security,
      ),
    ).not.toBeInTheDocument();
  });

  it('should handle querystring parameter selection', () => {
    const controlValues = { querystring: true } as unknown as CdnFormValues;
    render(
      <TestWrapper controlValues={controlValues}>
        {(control) => (
          <OptionCache
            controlValues={controlValues}
            control={control}
            optionsData={[querystringOption]}
            advancedPurge={false}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });
});
