import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DeploymentModeSection } from '@/pages/create/components/localisation/deploymentMode/DeploymentModeSection.component';

vi.mock(
  '@/pages/create/components/localisation/deploymentMode/DeploymentModeSelection.component',
  () => ({
    DeploymentModeSelection: () => <div>DeploymentModeSelection</div>,
  }),
);

describe('DeploymentModeSection', () => {
  it('should render section with title and DeploymentModeSelection', () => {
    render(<DeploymentModeSection />);

    expect(screen.getByText('create:localisation.deploymentMode.title')).toBeVisible();
    expect(screen.getByText('DeploymentModeSelection')).toBeVisible();
  });
});
