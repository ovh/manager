import '@/common/setupTests';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { render } from '@/common/utils/test.provider';
import RecordHelpDrawer, { getRecordHelpEntries } from '@/zone/pages/zone/components/RecordHelpDrawer';

const GUIDE_URL = 'https://docs.ovhcloud.com/fr/guides/web-cloud/domains/dns-zone-a-record-creation';

describe('getRecordHelpEntries', () => {
  it('lists the subdomain, target and TTL of an A record', () => {
    expect(getRecordHelpEntries('A').map((entry) => entry.name)).toEqual(['subDomain', 'target', 'ttl']);
  });

  it('lists the subdomain, priority, target and TTL of an MX record', () => {
    expect(getRecordHelpEntries('MX').map((entry) => entry.name)).toEqual(['subDomain', 'priority', 'target', 'ttl']);
  });
});

describe('RecordHelpDrawer', () => {
  it('renders the title and the field descriptions', () => {
    render(<RecordHelpDrawer recordType="A" guideUrl={GUIDE_URL} onClose={vi.fn()} />);
    expect(screen.getByText('zone_page_form_help_title')).toBeInTheDocument();
    expect(screen.getByText('zone_page_form_help_subtitle')).toBeInTheDocument();
    expect(screen.getByText('zone_page_tooltip_subdomain')).toBeInTheDocument();
    expect(screen.getByText('zone_page_tooltip_ttl')).toBeInTheDocument();
  });

  it('renders the guide link when a guide exists', () => {
    render(<RecordHelpDrawer recordType="A" guideUrl={GUIDE_URL} onClose={vi.fn()} />);
    const link = screen.getByText('zone_page_form_help_guide_link').closest('a');
    expect(link).toHaveAttribute('href', GUIDE_URL);
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('calls onClose when clicking the close button', () => {
    const onClose = vi.fn();
    render(<RecordHelpDrawer recordType="A" guideUrl={GUIDE_URL} onClose={onClose} />);
    fireEvent.click(screen.getByText(/actions:close/));
    expect(onClose).toHaveBeenCalled();
  });
});
