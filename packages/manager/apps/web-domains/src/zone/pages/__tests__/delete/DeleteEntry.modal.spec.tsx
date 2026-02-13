import '@/common/setupTests';
import { fireEvent, render,wrapper } from '@/common/utils/test.provider';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { DeleteEntryModal } from '@/zone/pages/zone/delete/DeleteEntry.modal';
import { ZoneRecord } from '@/zone/types/zoneRecords.types';

const recordMock = {
    id: '1',
    subDomain: 'www',
    subDomainToDisplay: 'www',
    zone: 'example.com',
    zoneToDisplay: 'example.com',
    fieldType: 'A',
    target: '192.168.1.1',
    targetToDisplay: '192.168.1.1',
    ttl: 3600,
};

describe('DeleteEntryModal', () => {
    const onCloseCallback = vi.fn();
    const onRefetch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render correctly', () => {
        const { getByText } = render(
            <DeleteEntryModal
                record={recordMock as ZoneRecord}
                onCloseCallback={onCloseCallback}
                onRefetch={onRefetch}
            />,
            { wrapper },
        );

        expect(
            getByText('zone_page_delete_entry_modal_heading'),
        ).toBeDefined();
    });

    it('should close modal on cancel', () => {
        const { getByRole } = render(
            <DeleteEntryModal
                record={recordMock as ZoneRecord}
                onCloseCallback={onCloseCallback}
                onRefetch={onRefetch}
            />,
            { wrapper },
        );

        const cancelBtn = getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelBtn);

        expect(onCloseCallback).toHaveBeenCalled();
    });
});
