import '@/setupTests';
import React, { PropsWithChildren } from 'react';
import { vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { OdsFileUpload } from '@ovhcloud/ods-components/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  OdsFileChangeEventDetail,
  OdsFileUploadCustomEvent,
} from '@ovhcloud/ods-components';
import {
  uploadDomain,
  updateContactArgument,
  updateDocumentArgument,
  updateStringArgument,
} from '@/__mocks__/update';
import Update from '@/pages/update/Update';
import { useOperationArguments } from '@/hooks/update/useOperationArguments';
import { useGetDomainInformation } from '@/hooks/data/query';
import { serviceInfo } from '@/__mocks__/serviceInfo';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useParams: () => {
    return {
      id: '1',
    };
  },
}));

vi.mock('@/hooks/data/query', () => ({
  useDomain: vi.fn(() => {
    return {
      data: uploadDomain,
      isLoading: false,
    };
  }),
  useGetDomainInformation: vi.fn(),
}));

vi.mock('@/hooks/update/useOperationArguments', () => ({
  useOperationArguments: vi.fn(),
}));

describe('Update page', () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('display the correct data related to the domain', async () => {
    (useOperationArguments as jest.Mock).mockReturnValue({
      data: updateContactArgument,
      isLoading: false,
    });

    render(<Update />, { wrapper });

    await waitFor(() => {
      expect(
        screen.getByText('domain_operations_update_title'),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          '"Domain is scheduled for deletion on 2026-08-24 12:58:23"',
        ),
      );
      expect(screen.getByText('domain_operation_comment'));
    });
  });

  it('display the contact content', async () => {
    (useOperationArguments as jest.Mock).mockReturnValue({
      data: {
        data: updateContactArgument,
        isLoading: false,
      },
    });

    (useGetDomainInformation as jest.Mock).mockReturnValue({
      data: serviceInfo,
      isLoading: false,
    });

    render(<Update />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('contactupdate')).toBeInTheDocument();
    });
  });

  it('display the document content', async () => {
    (useOperationArguments as jest.Mock).mockReturnValue({
      data: {
        data: updateDocumentArgument,
        isLoading: false,
      },
    });

    render(<Update />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('upload')).toBeInTheDocument();
    });
  });

  it('display the string content', async () => {
    (useOperationArguments as jest.Mock).mockReturnValue({
      data: {
        data: updateStringArgument,
        isLoading: false,
      },
    });

    render(<Update />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('input-name')).toBeInTheDocument();
    });
  });
});

describe('OdsFileUpload Component', () => {
  const mockOnChange = vi.fn();
  const mockOnCancel = vi.fn();
  const mockOnRejected = vi.fn();

  const renderComponent = (props = {}) => {
    return render(
      <OdsFileUpload
        onOdsChange={mockOnChange}
        onOdsCancel={mockOnCancel}
        onOdsRejected={mockOnRejected}
        maxFile={1}
        maxSize={1048576} // 1MB
        maxSizeLabel="No file larger than"
        accept=".jpg"
        acceptedFileLabel="Accepted file types : pdf, jpg"
        files={[]}
        data-testid="upload"
        {...props}
      />,
    );
  };

  it('renders the file upload component with default props', () => {
    renderComponent();
    expect(screen.getByTestId('upload')).toBeInTheDocument();
  });

  it('triggers onOdsChange when files are selected', () => {
    renderComponent();

    const files = [
      new File(['image'], 'example.jpg', { type: 'application/pdf' }),
    ];
    const eventDetail: OdsFileChangeEventDetail = {
      files,
      noError: false,
    };
    const customEvent = new CustomEvent('odsChange', {
      detail: eventDetail,
    }) as OdsFileUploadCustomEvent<OdsFileChangeEventDetail>;

    const fileUploadElement = screen.getByTestId('upload');
    fileUploadElement.dispatchEvent(customEvent);

    expect(mockOnChange).toHaveBeenCalledWith(customEvent);
    expect(mockOnChange.mock.calls[0][0].detail.files[0].name).toBe(
      'example.jpg',
    );
  });
});
