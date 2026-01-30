import React from 'react';

import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { DataGridTextCellMock } from '@/test-utils/mocks/manager-react-components';
import { OdsBadgeMock } from '@/test-utils/mocks/ods-components';
import { useTranslationMock } from '@/test-utils/mocks/react-i18next';

import { ResourceStatusBadge } from './ResourceStatusBadge.component';

vi.mock('react-i18next', () => ({
  useTranslation: useTranslationMock,
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: DataGridTextCellMock,
}));

vi.mock('@ovhcloud/ods-components', () => ({
  ODS_BADGE_COLOR: {
    information: 'information',
    critical: 'critical',
    success: 'success',
    warning: 'warning',
  },
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsBadge: OdsBadgeMock,
}));

describe('ResourceStatusBadge', () => {
  it('renders translated status and maps READY to success color', () => {
    render(<ResourceStatusBadge resourceStatus="READY" />);

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('translated_ready');
    expect(badge.getAttribute('color')).toBe('success');
  });

  it('maps ERROR to critical color', () => {
    render(<ResourceStatusBadge resourceStatus="ERROR" />);

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveTextContent('translated_error');
    expect(badge.getAttribute('color')).toBe('critical');
  });
});
