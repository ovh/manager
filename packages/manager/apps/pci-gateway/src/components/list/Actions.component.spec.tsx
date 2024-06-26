import { describe, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { useHref } from 'react-router-dom';
import Actions from './Actions.component';
import { Gateway } from '@/interface';

vi.mock('react-router-dom');

const shellContext = {
  shell: {
    navigation: {
      getURL: vi.fn().mockResolvedValue('mocked_url'),
    },
  },
};

const wrapper = ({ children }) => (
  <ShellContext.Provider value={(shellContext as unknown) as ShellContextType}>
    {children}
  </ShellContext.Provider>
);

describe('Actions', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(
      <Actions
        projectId="test"
        gateway={{ id: '1', name: 'test', region: 'test' } as Gateway}
      />,
      { wrapper },
    );
    const button = getByTestId('actions-hrefEdit');
    expect(button).toBeInTheDocument();
  });

  it('navigates to correct URL on edit button click', async () => {
    vi.mocked(useHref).mockReturnValue('hrefEdit');
    const { getByTestId, debug, container } = render(
      <Actions
        projectId="test"
        gateway={{ id: '1', name: 'test', region: 'test' } as Gateway}
      />,
      { wrapper },
    );
    const button = getByTestId('actions-hrefEdit');
    expect(button).toHaveAttribute('href', 'hrefEdit');
  });

  it('navigates to correct URL on delete button click', async () => {
    vi.mocked(useHref).mockReturnValue('hrefRemove');
    const { getByTestId } = render(
      <Actions
        projectId="test"
        gateway={{ id: '1', name: 'test', region: 'test' } as Gateway}
      />,
      { wrapper },
    );
    const button = getByTestId('actions-hrefRemove');
    expect(button).toHaveAttribute('href', 'hrefRemove');
  });
});
