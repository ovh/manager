import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { agentStatusColor } from '@/components/ResourceStatusBadge/_utils/resourceStatusColor.utils';
import { useTranslationMock } from '@/test-utils/mocks/react-i18next';

import { AgentStatusLegend } from '../AgentStatusLegend';

vi.mock('react-i18next', () => ({
  useTranslation: useTranslationMock,
}));

vi.mock('@/components/ResourceStatusBadge/ResourceStatusBadge.component', () => ({
  ResourceStatusBadge: vi
    .fn()
    .mockImplementation(({ resourceStatus }) => <span>{resourceStatus}</span>),
}));

describe('AgentStatusLegend', () => {
  it('renders all agent statuses and their legends', () => {
    render(<AgentStatusLegend />);

    const statuses = Object.keys(agentStatusColor);

    statuses.forEach((status) => {
      // Check for ResourceStatusBadge
      expect(screen.getByText(status)).toBeInTheDocument();

      // Check for legend text
      expect(
        screen.getByText(`translated_agent_status_${status.toLowerCase()}_legend`),
      ).toBeInTheDocument();
    });
  });
});
