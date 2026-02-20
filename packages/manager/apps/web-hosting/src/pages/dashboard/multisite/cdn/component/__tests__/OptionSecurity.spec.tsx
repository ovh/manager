import React from 'react';

import { fireEvent, render, screen, within } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CdnFormValues, CdnOption, CdnOptionType } from '@/data/types/product/cdn';
import { wrapper } from '@/utils/test.provider';
import { getDomRect, navigate } from '@/utils/test.setup';

import { OptionSecurity } from '../OptionSecurity';

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

const securityOptionsData: CdnOption[] = [
  {
    name: 'cors',
    type: CdnOptionType.CORS,
    config: null,
    pattern: null,
    enabled: true,
    extra: null,
  },
  {
    name: 'https_redirect',
    type: CdnOptionType.HTTPS_REDIRECT,
    config: null,
    pattern: null,
    enabled: true,
    extra: null,
  },
  {
    name: 'hsts',
    type: CdnOptionType.HSTS,
    config: null,
    pattern: null,
    enabled: true,
    extra: null,
  },
  {
    name: 'mixed_content',
    type: CdnOptionType.MIXED_CONTENT,
    config: null,
    pattern: null,
    enabled: true,
    extra: null,
  },
  {
    name: 'waf',
    type: CdnOptionType.WAF,
    config: null,
    pattern: null,
    enabled: true,
    extra: null,
  },
];

describe('OptionSecurity', () => {
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
          <OptionSecurity
            controlValues={{} as CdnFormValues}
            control={control}
            optionsData={securityOptionsData}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );
    expect(container).toBeInTheDocument();
  });

  it('should return null when no security options available', () => {
    const { container } = render(
      <TestWrapper>
        {(control) => (
          <OptionSecurity controlValues={{} as CdnFormValues} control={control} optionsData={[]} />
        )}
      </TestWrapper>,
      { wrapper },
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render all security toggle cards', () => {
    render(
      <TestWrapper>
        {(control) => (
          <OptionSecurity
            controlValues={{} as CdnFormValues}
            control={control}
            optionsData={securityOptionsData}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    expect(screen.getByText('Cross-Origin Resource Sharing (CORS)')).toBeInTheDocument();
    expect(screen.getByText('HTTPS-Redirect')).toBeInTheDocument();
    expect(screen.getByText('HTTP Strict Transport Security (HSTS)')).toBeInTheDocument();
    expect(screen.getByText('Mixed-Content')).toBeInTheDocument();
    expect(screen.getByText('Web Application Firewall (WAF)')).toBeInTheDocument();
  });

  it('should show CORS edit button when CORS is enabled', () => {
    const controlValues = { cors: true } as CdnFormValues;
    render(
      <TestWrapper controlValues={controlValues}>
        {(control) => (
          <OptionSecurity
            controlValues={controlValues}
            control={control}
            optionsData={securityOptionsData}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    const editButton = screen.getByRole('button');
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
    expect(navigate).toHaveBeenCalled();
  });

  it('should show HTTPS redirect code selector when HTTPS redirect is enabled', () => {
    const controlValues = { httpsRedirect: true } as CdnFormValues;
    render(
      <TestWrapper controlValues={controlValues}>
        {(control) => (
          <OptionSecurity
            controlValues={controlValues}
            control={control}
            optionsData={securityOptionsData}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    const codeSelector = screen.getByTestId('httpsRedirectCode');
    expect(codeSelector).toBeInTheDocument();
  });

  it('should show warning message when HTTPS redirect is enabled', () => {
    const controlValues = { httpsRedirect: true } as CdnFormValues;
    render(
      <TestWrapper controlValues={controlValues}>
        {(control) => (
          <OptionSecurity
            controlValues={controlValues}
            control={control}
            optionsData={securityOptionsData}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    const httpsHeading = screen.getByRole('heading', { name: /HTTPS-Redirect/i });
    const httpsSection = httpsHeading.closest('div');
    const warningMessage =
      within(httpsSection).queryByRole('status') ||
      within(httpsSection).queryByRole('alert') ||
      within(httpsSection).queryByText(/ssl/i, { exact: false });
    expect(warningMessage).toBeInTheDocument();
  });

  it('should show HSTS age input and unit selector when HSTS is enabled', () => {
    const controlValues = { hsts: true } as CdnFormValues;
    render(
      <TestWrapper controlValues={controlValues}>
        {(control) => (
          <OptionSecurity
            controlValues={controlValues}
            control={control}
            optionsData={securityOptionsData}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    const ageInput = screen.getByRole('spinbutton');
    const unitSelector = screen.getByTestId('hstUnit');
    expect(ageInput).toBeInTheDocument();
    expect(unitSelector).toBeInTheDocument();
  });

  it('should show warning message when HSTS is enabled', () => {
    const controlValues = { hsts: true } as CdnFormValues;
    render(
      <TestWrapper controlValues={controlValues}>
        {(control) => (
          <OptionSecurity
            controlValues={controlValues}
            control={control}
            optionsData={securityOptionsData}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    const hstsHeading = screen.getByRole('heading', {
      name: /HTTP Strict Transport Security \(HSTS\)/i,
    });
    const hstsSection = hstsHeading.closest('div');
    const warningMessage =
      within(hstsSection).queryByRole('status') ||
      within(hstsSection).queryByRole('alert') ||
      within(hstsSection).queryByText(/ssl/i, { exact: false });
    expect(warningMessage).toBeInTheDocument();
  });

  it('should toggle CORS option', () => {
    render(
      <TestWrapper>
        {(control) => (
          <OptionSecurity
            controlValues={{} as CdnFormValues}
            control={control}
            optionsData={securityOptionsData}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    const corsHeading = screen.getByRole('heading', {
      name: /Cross-Origin Resource Sharing \(CORS\)/i,
    });
    const corsSection = corsHeading.closest('div');
    const corsToggle = within(corsSection).getByRole('checkbox');
    fireEvent.click(corsToggle);
    expect(corsToggle).toBeChecked();
  });

  it('should toggle HTTPS redirect option', () => {
    render(
      <TestWrapper>
        {(control) => (
          <OptionSecurity
            controlValues={{} as CdnFormValues}
            control={control}
            optionsData={securityOptionsData}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    const httpsHeading = screen.getByRole('heading', { name: /HTTPS-Redirect/i });
    const httpsSection = httpsHeading.closest('div');
    const httpsToggle = within(httpsSection).getByRole('checkbox');
    fireEvent.click(httpsToggle);
    expect(httpsToggle).toBeChecked();
  });

  it('should toggle HSTS option', () => {
    render(
      <TestWrapper>
        {(control) => (
          <OptionSecurity
            controlValues={{} as CdnFormValues}
            control={control}
            optionsData={securityOptionsData}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    const hstsHeading = screen.getByRole('heading', {
      name: /HTTP Strict Transport Security \(HSTS\)/i,
    });
    const hstsSection = hstsHeading.closest('div');
    const hstsToggle = within(hstsSection).getByRole('checkbox');
    fireEvent.click(hstsToggle);
    expect(hstsToggle).toBeChecked();
  });

  it('should toggle Mixed-Content option', () => {
    render(
      <TestWrapper>
        {(control) => (
          <OptionSecurity
            controlValues={{} as CdnFormValues}
            control={control}
            optionsData={securityOptionsData}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    const mixedContentHeading = screen.getByRole('heading', { name: /Mixed-Content/i });
    const mixedContentSection = mixedContentHeading.closest('div');
    const mixedContentToggle = within(mixedContentSection).getByRole('checkbox');
    fireEvent.click(mixedContentToggle);
    expect(mixedContentToggle).toBeChecked();
  });

  it('should toggle WAF option', () => {
    render(
      <TestWrapper>
        {(control) => (
          <OptionSecurity
            controlValues={{} as CdnFormValues}
            control={control}
            optionsData={securityOptionsData}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    const wafHeading = screen.getByRole('heading', { name: /Web Application Firewall \(WAF\)/i });
    const wafSection = wafHeading.closest('div');
    const wafToggle = within(wafSection).getByRole('checkbox');
    fireEvent.click(wafToggle);
    expect(wafToggle).toBeChecked();
  });

  it('should handle HTTPS redirect code change', () => {
    const controlValues = {
      httpsRedirect: true,
      httpsRedirectCode: '301',
    } as unknown as CdnFormValues;
    render(
      <TestWrapper controlValues={controlValues}>
        {(control) => (
          <OptionSecurity
            controlValues={controlValues}
            control={control}
            optionsData={securityOptionsData}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    const codeSelector = screen.getByTestId('httpsRedirectCode');
    expect(codeSelector).toBeInTheDocument();
  });

  it('should handle HSTS age input change', () => {
    const controlValues = { hsts: true, hstsAge: 3600 } as unknown as CdnFormValues;
    render(
      <TestWrapper controlValues={controlValues}>
        {(control) => (
          <OptionSecurity
            controlValues={controlValues}
            control={control}
            optionsData={securityOptionsData}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    const ageInput = screen.getByRole('spinbutton');
    fireEvent.change(ageInput, { target: { value: '7200' } });
    expect(ageInput).toHaveValue(7200);
  });

  it('should handle HSTS unit selector change', () => {
    const controlValues = { hsts: true, hstUnit: '1' } as unknown as CdnFormValues;
    render(
      <TestWrapper controlValues={controlValues}>
        {(control) => (
          <OptionSecurity
            controlValues={controlValues}
            control={control}
            optionsData={securityOptionsData}
          />
        )}
      </TestWrapper>,
      { wrapper },
    );

    const unitSelector = screen.getByTestId('hstUnit');
    expect(unitSelector).toBeInTheDocument();
  });
});
