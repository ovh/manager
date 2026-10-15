import '@/common/setupTests';
import { beforeAll, describe, it, expect, vi } from 'vitest';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { mockShellContext, render } from '@/common/utils/test.provider';
import QuickAddEntry from '@/zone/pages/zone/components/QuickAddEntry';

vi.mock('@/zone/hooks/useAddZoneRecord/useAddZoneRecord', () => ({
  useAddZoneRecord: () => ({ addRecord: vi.fn(), isAddingRecord: false }),
}));

vi.mock('@/zone/hooks/useUpdateZoneRecord/useUpdateZoneRecord', () => ({
  useUpdateZoneRecord: () => ({ updateRecord: vi.fn(), isUpdatingRecord: false }),
}));

vi.mock('@/zone/hooks/useIsDesktop', () => ({
  useIsDesktop: () => true,
}));

function renderQuickAddEntry(ovhSubsidiary: string) {
  const shellContext = {
    ...mockShellContext,
    environment: {
      ...mockShellContext.environment,
      getUser: () => ({ ovhSubsidiary }),
    },
  } as typeof mockShellContext;
  return render(
    <ShellContext.Provider value={shellContext}>
      <QuickAddEntry serviceName="example.com" visible />
    </ShellContext.Provider>,
  );
}

async function selectRecordType(label: string) {
  await act(async () => {
    fireEvent.click(screen.getByRole('combobox'));
  });
  const option = await screen.findByText(label, { selector: 'span' });
  await act(async () => {
    fireEvent.click(option);
  });
}

describe('QuickAddEntry — help drawer', () => {
  beforeAll(() => {
    Element.prototype.scrollTo = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('hides the help button until a record type is selected', () => {
    renderQuickAddEntry('FR');
    expect(screen.queryByText('zone_page_form_help_button')).not.toBeInTheDocument();
  });

  it('opens the help drawer with the guide link for an A record', async () => {
    renderQuickAddEntry('FR');
    await selectRecordType('A');

    fireEvent.click(await screen.findByText('zone_page_form_help_button'));

    await waitFor(() => {
      expect(screen.getByText('zone_page_form_help_title')).toBeInTheDocument();
    });
    expect(screen.getByText('zone_page_form_help_guide_link').closest('a')).toHaveAttribute(
      'href',
      'https://docs.ovhcloud.com/fr/guides/web-cloud/domains/dns-zone-a-record-creation',
    );
  });

  it('uses the subsidiary to pick the guide', async () => {
    renderQuickAddEntry('IN');
    await selectRecordType('MX');

    fireEvent.click(await screen.findByText('zone_page_form_help_button'));

    await waitFor(() => {
      expect(screen.getByText('zone_page_form_help_guide_link').closest('a')).toHaveAttribute(
        'href',
        'https://docs.ovhcloud.com/en/guides/web-cloud/domains/dns-zone-mx',
      );
    });
  });

  it('links the CNAME record to its docs guide', async () => {
    renderQuickAddEntry('FR');
    await selectRecordType('CNAME');

    fireEvent.click(await screen.findByText('zone_page_form_help_button'));

    await waitFor(() => {
      expect(screen.getByText('zone_page_form_help_guide_link').closest('a')).toHaveAttribute(
        'href',
        'https://docs.ovhcloud.com/fr/guides/web-cloud/domains/dns-zone-cname-record-creation',
      );
    });
  });

  it.each(['DNAME', 'SRV'])('does not show the help button for a %s record', async (recordType) => {
    renderQuickAddEntry('FR');
    await selectRecordType(recordType);

    expect(screen.queryByText('zone_page_form_help_button')).not.toBeInTheDocument();
  });
});
