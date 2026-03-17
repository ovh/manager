import '@/common/setupTests';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { render } from '@/common/utils/test.provider';
import { FormProvider, useForm } from 'react-hook-form';
import { SPFRecordForm } from '@/zone/pages/zone/add/components/forms/SPFRecordForm';

vi.mock('@/zone/hooks/useIsDesktop', () => ({
  useIsDesktop: vi.fn(() => true),
}));

// Expose form values for assertion
let getFormValues: () => Record<string, unknown>;

function FormWrapper({
  children,
  defaults,
}: Readonly<{
  children: React.ReactNode;
  defaults?: Record<string, unknown>;
}>) {
  const methods = useForm({
    defaultValues: {
      target: '',
      subDomain: '',
      fieldType: 'SPF',
      ttl: { value: 3600, unit: 'seconds' },
      ttlSelect: 'default',
      spf_includeOvh: true,
      spf_useMx: false,
      spf_useA: false,
      spf_includesRaw: '',
      spf_ip4Raw: '',
      spf_ip6Raw: '',
      spf_policy: '~all',
      ...defaults,
    },
  });
  getFormValues = () => methods.getValues();
  return <FormProvider {...methods}>{children}</FormProvider>;
}

const renderSPF = (
  serviceName = 'example.com',
  defaults?: Record<string, unknown>,
) =>
  render(
    <FormWrapper defaults={defaults}>
      <SPFRecordForm serviceName={serviceName} />
    </FormWrapper>,
  );

const getPreview = () => screen.getByDisplayValue(/\. IN TXT/);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('SPFRecordForm', () => {
  describe('SPF preview composition', () => {
    it('shows the default SPF with include:mx.ovh.com and ~all policy', () => {
      renderSPF('example.com');
      expect(getPreview()).toHaveDisplayValue(
        'example.com. IN TXT "v=spf1 include:mx.ovh.com ~all"',
      );
    });

    it('adapts the preview domain name to the serviceName prop', () => {
      renderSPF('mydomain.net');
      expect(getPreview()).toHaveDisplayValue(
        'mydomain.net. IN TXT "v=spf1 include:mx.ovh.com ~all"',
      );
    });

    it('omits include:mx.ovh.com when spf_includeOvh starts unchecked', () => {
      renderSPF('example.com', { spf_includeOvh: false });
      expect(getPreview()).toHaveDisplayValue(
        'example.com. IN TXT "v=spf1 ~all"',
      );
    });

    it('includes mx when spf_useMx starts checked', () => {
      renderSPF('example.com', { spf_useMx: true });
      expect(getPreview()).toHaveDisplayValue(
        'example.com. IN TXT "v=spf1 include:mx.ovh.com mx ~all"',
      );
    });

    it('includes a when spf_useA starts checked', () => {
      renderSPF('example.com', { spf_useA: true });
      expect(getPreview()).toHaveDisplayValue(
        'example.com. IN TXT "v=spf1 include:mx.ovh.com a ~all"',
      );
    });

    it('composes a full SPF with all mechanisms enabled', () => {
      renderSPF('example.com', {
        spf_includeOvh: true,
        spf_useMx: true,
        spf_useA: true,
        spf_includesRaw: 'spf.google.com',
        spf_ip4Raw: '192.168.1.0/24',
        spf_ip6Raw: '2001:db8::/32',
        spf_policy: '-all',
      });

      const preview = getPreview();
      expect(preview).toHaveDisplayValue(/v=spf1/);
      expect(preview).toHaveDisplayValue(/include:mx\.ovh\.com/);
      expect(preview).toHaveDisplayValue(/include:spf\.google\.com/);
      expect(preview).toHaveDisplayValue(/ip4:192\.168\.1\.0\/24/);
      expect(preview).toHaveDisplayValue(/ip6:2001:db8::/);
      expect(preview).toHaveDisplayValue(/mx/);
      expect(preview).toHaveDisplayValue(/-all/);
    });
  });

  describe('form state synchronization', () => {
    it('syncs the composed SPF value to the form target field on mount', async () => {
      renderSPF();
      await waitFor(() => {
        expect(getFormValues().target).toBe(
          'v=spf1 include:mx.ovh.com ~all',
        );
      });
    });

    it('syncs a complex SPF value to target when multiple mechanisms are set', async () => {
      renderSPF('example.com', {
        spf_includeOvh: true,
        spf_useMx: true,
        spf_ip4Raw: '10.0.0.1',
        spf_policy: '-all',
      });
      await waitFor(() => {
        const target = getFormValues().target as string;
        expect(target).toContain('include:mx.ovh.com');
        expect(target).toContain('ip4:10.0.0.1');
        expect(target).toContain('mx');
        expect(target).toContain('-all');
      });
    });

    it('syncs minimal SPF to target when nothing is enabled', async () => {
      renderSPF('example.com', { spf_includeOvh: false });
      await waitFor(() => {
        expect(getFormValues().target).toBe('v=spf1 ~all');
      });
    });
  });

  describe('user interactions with textareas', () => {
    it('updates the preview when user types in the includes textarea', async () => {
      const { user } = renderSPF();
      const includesTextarea = screen.getByPlaceholderText(
        /zone_page_form_spf_includes_placeholder/,
      );

      await user.type(includesTextarea, 'spf.google.com');

      await waitFor(() => {
        expect(getPreview()).toHaveDisplayValue(/include:spf\.google\.com/);
        expect(getFormValues().target).toContain('include:spf.google.com');
      });
    });

    it('updates the preview when user types in the IPv4 textarea', async () => {
      const { user } = renderSPF();
      const ip4Textarea = screen.getByPlaceholderText(
        /zone_page_form_spf_ip4_placeholder/,
      );

      await user.type(ip4Textarea, '192.168.1.0/24');

      await waitFor(() => {
        expect(getPreview()).toHaveDisplayValue(/ip4:192\.168\.1\.0\/24/);
        expect(getFormValues().target).toContain('ip4:192.168.1.0/24');
      });
    });

    it('updates the preview when user types in the IPv6 textarea', async () => {
      const { user } = renderSPF();
      const ip6Textarea = screen.getByPlaceholderText(
        /zone_page_form_spf_ip6_placeholder/,
      );

      await user.type(ip6Textarea, '2001:db8::/32');

      await waitFor(() => {
        expect(getPreview()).toHaveDisplayValue(/ip6:2001:db8::/);
        expect(getFormValues().target).toContain('ip6:2001:db8::');
      });
    });
  });

  describe('checkbox interactions', () => {
    it('toggles include:mx.ovh.com via the OVH checkbox', async () => {
      renderSPF('example.com', { spf_includeOvh: false });
      expect(getPreview()).not.toHaveDisplayValue(/include:mx\.ovh\.com/);

      const ovhCheckbox = screen
        .getByText(/zone_page_form_spf_include_ovh/)
        .closest('[data-scope="checkbox"]');
      if (ovhCheckbox) fireEvent.click(ovhCheckbox);

      await waitFor(() => {
        expect(getPreview()).toHaveDisplayValue(/include:mx\.ovh\.com/);
      });
    });

    it('adds mx mechanism via the MX checkbox', async () => {
      renderSPF();

      const mxCheckbox = screen
        .getByText(/zone_page_form_spf_mx/)
        .closest('[data-scope="checkbox"]');
      if (mxCheckbox) fireEvent.click(mxCheckbox);

      await waitFor(() => {
        const target = getFormValues().target as string;
        expect(target).toContain(' mx ');
      });
    });

    it('adds a mechanism via the A checkbox', async () => {
      renderSPF();
      const aCheckbox = screen
        .getByText(/zone_page_form_spf_a$/)
        .closest('[data-scope="checkbox"]');
      if (aCheckbox) fireEvent.click(aCheckbox);

      await waitFor(() => {
        const target = getFormValues().target as string;
        expect(target).toMatch(/\ba\b/);
      });
    });
  });

  describe('form structure', () => {
    it('renders all expected form sections', () => {
      renderSPF();
      expect(
        screen.getByText(/zone_page_form_spf_mechanisms_label/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/zone_page_form_spf_includes_label/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/zone_page_form_spf_ip4_label/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/zone_page_form_spf_ip6_label/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/zone_page_form_spf_policy_label/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/zone_page_form_spf_preview_label/),
      ).toBeInTheDocument();
      expect(screen.getByText(/zone_page_info_SPF/)).toBeInTheDocument();
    });

    it('renders three textareas for includes, IPv4 and IPv6', () => {
      renderSPF();
      expect(
        screen.getByPlaceholderText(
          /zone_page_form_spf_includes_placeholder/,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/zone_page_form_spf_ip4_placeholder/),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/zone_page_form_spf_ip6_placeholder/),
      ).toBeInTheDocument();
    });
  });

  describe('responsive layout', () => {
    it('renders a two-column grid on desktop', async () => {
      const { useIsDesktop } = await import('@/zone/hooks/useIsDesktop');
      (useIsDesktop as ReturnType<typeof vi.fn>).mockReturnValue(true);
      const { container } = renderSPF();
      expect(container.querySelector('.grid-cols-2')).toBeInTheDocument();
    });

    it('renders a single-column flex layout on mobile', async () => {
      const { useIsDesktop } = await import('@/zone/hooks/useIsDesktop');
      (useIsDesktop as ReturnType<typeof vi.fn>).mockReturnValue(false);
      const { container } = renderSPF();
      expect(
        container.querySelector('.grid-cols-2'),
      ).not.toBeInTheDocument();
    });
  });
});
