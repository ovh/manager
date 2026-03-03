import '@/common/setupTests';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { wrapper } from '@/common/utils/test.provider';
import MinimizedSection from '@/zone/pages/zone/reset/MinimizedSection';

describe('MinimizedSection', () => {
    it('renders the minimized question', () => {
        const onMinimizedChange = vi.fn();
        render(
            <MinimizedSection minimized={false} onMinimizedChange={onMinimizedChange} />,
            { wrapper },
        );

        expect(
            screen.getByText('zone_page_reset_minimized_question'),
        ).toBeInTheDocument();
    });

    it('renders both yes and no options', () => {
        const onMinimizedChange = vi.fn();
        render(
            <MinimizedSection minimized={false} onMinimizedChange={onMinimizedChange} />,
            { wrapper },
        );

        expect(screen.getByText('zone_page_reset_minimized_no')).toBeInTheDocument();
        expect(
            screen.getByText('zone_page_reset_minimized_yes'),
        ).toBeInTheDocument();
    });

    it('shows "no" selected by default when minimized is false', () => {
        const onMinimizedChange = vi.fn();
        render(
            <MinimizedSection minimized={false} onMinimizedChange={onMinimizedChange} />,
            { wrapper },
        );

        const noRadio = screen.getByRole('radio', { name: /zone_page_reset_minimized_no/i });
        expect(noRadio).toBeChecked();
    });

    it('shows "yes" selected when minimized is true', () => {
        const onMinimizedChange = vi.fn();
        render(
            <MinimizedSection minimized={true} onMinimizedChange={onMinimizedChange} />,
            { wrapper },
        );

        const yesRadio = screen.getByRole('radio', { name: /zone_page_reset_minimized_yes/i });
        expect(yesRadio).toBeChecked();
    });
});
