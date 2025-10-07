import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import GeneralInformationPage from './GeneralInformation.page';

// --- Types for mocks ---
interface ClipboardProps {
  value: string;
}
interface LinksProps {
  href: string;
  label: string;
}

// --- Mock Clipboard & Links ---
vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('@ovh-ux/manager-react-components')
  >();
  return {
    ...actual,
    Clipboard: ({ value }: ClipboardProps) => (
      <button
        data-testid="clipboard"
        data-value={value}
        onClick={() => void navigator.clipboard.writeText(value)}
      >
        Copy
      </button>
    ),
    // eslint-disable-next-line react/no-multi-comp
    Links: ({ href, label }: LinksProps) => (
      <a data-testid={`link-${label}`} href={href}>
        {label}
      </a>
    ),
  };
});

describe('GeneralInformationPage', () => {
  it('renders tile titles (section headings)', () => {
    render(<GeneralInformationPage />);

    expect(screen.getByText('Service Information')).toBeInTheDocument();
    expect(screen.getAllByText('Documentation')[0]).toBeInTheDocument();
    expect(screen.getByText('Network Information')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('renders service details and allows clipboard copy', () => {
    const writeText = vi.fn<() => Promise<void>>();
    Object.assign(navigator, ({
      clipboard: { writeText },
    } as unknown) as Navigator);

    render(<GeneralInformationPage />);

    expect(
      screen.getByText(
        /Hosted Private Cloud – VMware vSphere service running in GRA region./i,
      ),
    ).toBeInTheDocument();

    const clipboards = screen.getAllByTestId('clipboard');
    expect(clipboards[0]).toHaveAttribute(
      'data-value',
      'https://api.ovh.com/1.0/hostedprivatecloud',
    );
    expect(clipboards[1]).toHaveAttribute('data-value', 'srv-12345-abcde');

    fireEvent.click(clipboards.at(0)); // non-null assertion for TS
    expect(writeText).toHaveBeenCalledWith(
      'https://api.ovh.com/1.0/hostedprivatecloud',
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders network information with correct values', () => {
    render(<GeneralInformationPage />);

    const ipClipboard = screen
      .getAllByTestId('clipboard')
      .find((el) => el.getAttribute('data-value')?.includes('51.210.0.0/28'));
    expect(ipClipboard).toBeTruthy();

    expect(screen.getByText(/1 Gbps Guaranteed/i)).toBeInTheDocument();
  });

  it.each([
    ['Documentation', 'https://help.ovhcloud.com/csm/en-hosted-private-cloud'],
    ['API Explorer', 'https://api.ovh.com/console/'],
    [
      'Getting Started Guide',
      'https://help.ovhcloud.com/csm/en-hosted-private-cloud-vmware-vsphere-getting-started',
    ],
    ['vrack-12345', 'https://www.ovhcloud.com/en/network/vrack/'],
    ['Open Support Center', 'https://help.ovhcloud.com/'],
    ['View Tickets', 'https://www.ovh.com/manager/dedicated/#/ticket'],
  ])('renders link "%s" with correct href', (label: string, href: string) => {
    render(<GeneralInformationPage />);

    const link = screen.getByTestId(`link-${label}`);
    expect(link).toHaveAttribute('href', href);
  });
});
