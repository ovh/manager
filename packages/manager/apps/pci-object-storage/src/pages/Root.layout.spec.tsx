// import { describe, it, expect, vi, beforeEach } from 'vitest';
// import { render, screen, waitFor } from '@testing-library/react';

// import Layout, { breadcrumb as Breadcrumb } from '@/pages/Root.layout';
// import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
// import * as projectAPI from '@/data/project/project.api';

// const breadCrumbParam = {
//   params: {
//     projectId: 'projectId',
//     category: 'dataplatform',
//   },
//   request: new Request('https://my-api.com/endpoint'),
// };

// describe('Services Layout', () => {
//   beforeEach(() => {
//     vi.restoreAllMocks();

//     vi.mock('@/data/project/project.api', () => {
//       return {
//         getProject: vi.fn(() => ({
//           project_id: '123456',
//           projectName: 'projectName',
//           description: 'description',
//         })),
//       };
//     });
//   });
//   afterEach(() => {
//     vi.clearAllMocks();
//   });

//   it('renders the breadcrumb component', async () => {
//     render(<Breadcrumb data={''} params={breadCrumbParam.params} />, {
//       wrapper: RouterWithQueryClientWrapper,
//     });
//     await waitFor(() => {
//       expect(screen.getByText('crumb-dataplatform')).toBeInTheDocument();
//     });
//   });

//   it('renders the Layout component', async () => {
//     render(<Layout />, {
//       wrapper: RouterWithQueryClientWrapper,
//     });
//     await waitFor(() => {
//       expect(projectAPI.getProject).toHaveBeenCalled();
//     });
//   });

//   it('renders the Layout component', async () => {
//     render(<Layout />, {
//       wrapper: RouterWithQueryClientWrapper,
//     });
//     await waitFor(() => {
//       expect(screen.getByTestId('pageLayout')).toBeInTheDocument();
//     });
//   });
// });
