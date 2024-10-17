import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import Create from '@/pages/disableMFA/create/Create.page';

const user = {
  legalForm: 'other',
  subsidiary: 'FR',
  language: 'en_CA',
};

vi.mock('@/context/User/useUser', () => ({
  default: () => ({
    user,
  }),
}));

vi.mock('@/components/legalInformations/LegalInformations.component', () => ({
  LegalInformations: () => <div>2FALegalInformations</div>,
}));

describe('Create.page', () => {
  it('renders the component correctly', () => {
    const { getByText } = render(<Create />);

    const legalElement = getByText('2FALegalInformations');

    expect(legalElement).toBeInTheDocument();
  });
});
