import '@/common/setupTests';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { wrapper } from '@/common/utils/test.provider';
import { useParams } from 'react-router-dom';
import { DeleteEntryModal } from '@/zone/pages/zone/delete/DeleteEntry.modal';
import { zoneRecordsMock } from '@/zone/__mocks__/records';

const deleteDomainZoneRecord = vi.fn();

vi.mock('@/zone/datas/api', () => ({
  deleteDomainZoneRecord: vi.fn(),
}));

vi.mock('@ovh-ux/muk', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/muk')>();
  return {
    ...actual,
    useNotifications: vi.fn(() => ({
      addSuccess: vi.fn(),
      addWarning: vi.fn(),
      addError: vi.fn(),
      clearNotifications: vi.fn(),
      notifications: [],
    })),
  };
});

const onCloseCallback = vi.fn();
const onRefetch = vi.fn();

const record = zoneRecordsMock[0];

describe('DeleteEntryModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useParams as ReturnType<typeof vi.fn>).mockReturnValue({
      serviceName: 'example.com',
    });
  });

  it('renders the modal with correct heading', () => {
    render(
      <DeleteEntryModal
        record={record}
        onCloseCallback={onCloseCallback}
        onRefetch={onRefetch}
      />,
      { wrapper },
    );

    expect(
      screen.getByText('zone_page_delete_entry_modal_heading'),
    ).toBeInTheDocument();
  });

  it('displays the record fields in the modal', () => {
    render(
      <DeleteEntryModal
        record={record}
        onCloseCallback={onCloseCallback}
        onRefetch={onRefetch}
      />,
      { wrapper },
    );

    expect(screen.getByText(record.fieldType)).toBeInTheDocument();
    expect(screen.getByText(record.targetToDisplay)).toBeInTheDocument();
  });

  it('displays the warning message', () => {
    render(
      <DeleteEntryModal
        record={record}
        onCloseCallback={onCloseCallback}
        onRefetch={onRefetch}
      />,
      { wrapper },
    );

    expect(
      screen.getByText('zone_page_delete_entry_modal_warning'),
    ).toBeInTheDocument();
  });

  it('calls onCloseCallback when cancel button is clicked', () => {
    render(
      <DeleteEntryModal
        record={record}
        onCloseCallback={onCloseCallback}
        onRefetch={onRefetch}
      />,
      { wrapper },
    );

    fireEvent.click(screen.getByText('@ovh-ux/manager-common-translations/actions:cancel'));
    expect(onCloseCallback).toHaveBeenCalledTimes(1);
  });

  it('calls deleteDomainZoneRecord with correct arguments on confirm', async () => {
    const { deleteDomainZoneRecord: mockDeleteFn } = await import(
      '@/zone/datas/api'
    );
    (mockDeleteFn as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

    render(
      <DeleteEntryModal
        record={record}
        onCloseCallback={onCloseCallback}
        onRefetch={onRefetch}
      />,
      { wrapper },
    );

    fireEvent.click(screen.getByText('@ovh-ux/manager-common-translations/actions:confirm'));

    await waitFor(() => {
      expect(mockDeleteFn).toHaveBeenCalledWith('example.com', record.id);
    });
  });

  it('renders without a record (null record)', () => {
    render(
      <DeleteEntryModal
        record={null}
        onCloseCallback={onCloseCallback}
        onRefetch={onRefetch}
      />,
      { wrapper },
    );

    expect(
      screen.getByText('zone_page_delete_entry_modal_heading'),
    ).toBeInTheDocument();
  });
});
