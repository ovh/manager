import { render } from '@testing-library/react';
import {
  HashRouter,
  Route,
  Routes,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { vi, describe, it } from 'vitest';
import DeleteWorkflowRedirect from './DeleteWorkflowRedirect';

describe('DeleteWorkflowRedirect', () => {
  it('redirects to the correct URL with projectId and workflowId', () => {
    const { container } = render(
      <HashRouter basename="/">
        <Routes>
          <Route path="" element={<DeleteWorkflowRedirect />} />
        </Routes>
      </HashRouter>,
    );
    expect(container.innerHTML).toContain(
      '/pci/projects/mocked_projectId/workflow/delete/workflowId',
    );
  });

  it('handles missing projectId gracefully', () => {
    vi.mocked(useParams).mockReturnValue({});

    const { container } = render(
      <HashRouter basename="/">
        <Routes>
          <Route path="" element={<DeleteWorkflowRedirect />} />
        </Routes>
      </HashRouter>,
    );

    expect(container.innerHTML).toContain(
      '/pci/projects/undefined/workflow/delete/workflowId',
    );
  });

  it('handles missing workflowId gracefully', () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({}),
      vi.fn(),
    ]);

    const { container } = render(
      <HashRouter basename="/">
        <Routes>
          <Route path="" element={<DeleteWorkflowRedirect />} />
        </Routes>
      </HashRouter>,
    );

    expect(container.innerHTML).toContain(
      '/pci/projects/undefined/workflow/delete/null',
    );
  });
});
