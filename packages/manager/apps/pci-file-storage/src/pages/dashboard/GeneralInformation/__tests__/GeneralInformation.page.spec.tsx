import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import GeneralInformationPage from '../GeneralInformation.page';

vi.mock('../components/ShareGeneralInfoBlock.component', () => ({
  __esModule: true,
  ShareGeneralInfoBlock: () => <div>ShareGeneralInfoBlock</div>,
}));

vi.mock('../components/SharePropertiesBlock.component', () => ({
  __esModule: true,
  SharePropertiesBlock: () => <div>SharePropertiesBlock</div>,
}));

describe('GeneralInformation page', () => {
  it('should render ShareGeneralInfoBlock and SharePropertiesBlock', () => {
    render(<GeneralInformationPage />);

    expect(screen.getByText('ShareGeneralInfoBlock')).toBeVisible();
    expect(screen.getByText('SharePropertiesBlock')).toBeVisible();
  });
});
