import { ServiceKeyAction } from '@key-management-service/hooks/service-key/service-key.type';
import { useServiceKeyActionsList } from '@key-management-service/hooks/service-key/useServiceKeyActionsList';
import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { serviceKeyMock1 } from '@key-management-service/mocks/service-keys/serviceKeys.mock';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BUTTON_COLOR } from '@ovhcloud/ods-react';

import ServiceKeyDownloadActions from './ServiceKeyDownloadActions.component';

vi.mock('@key-management-service/hooks/service-key/useServiceKeyActionsList', () => ({
  useServiceKeyActionsList: vi.fn(),
}));

const mockedUseServiceKeyActionsList = vi.mocked(useServiceKeyActionsList);

const makeAction = (buttonId: ServiceKeyAction['buttonId']): ServiceKeyAction => ({
  buttonId,
  label: buttonId,
  color: BUTTON_COLOR.primary,
  onClick: vi.fn(),
});

describe('ServiceKeyDownloadActions', () => {
  it('renders only download actions', () => {
    mockedUseServiceKeyActionsList.mockReturnValue([
      makeAction('service-key-download_encryption_key_pem'),
      makeAction('service-key-download_encryption_key_jwk'),
      makeAction('service-key-deactivate_encryption_key'),
      makeAction('service-key-reactivate_encryption_key'),
      makeAction('service-key-delete_encryption_key'),
    ]);

    render(<ServiceKeyDownloadActions okms={okmsRoubaix1Mock} okmsKey={serviceKeyMock1} />);

    expect(screen.getByTestId('service-key-download_encryption_key_pem')).toBeInTheDocument();
    expect(screen.getByTestId('service-key-download_encryption_key_jwk')).toBeInTheDocument();
    expect(screen.queryByTestId('service-key-deactivate_encryption_key')).not.toBeInTheDocument();
    expect(screen.queryByTestId('service-key-reactivate_encryption_key')).not.toBeInTheDocument();
    expect(screen.queryByTestId('service-key-delete_encryption_key')).not.toBeInTheDocument();
  });
});
