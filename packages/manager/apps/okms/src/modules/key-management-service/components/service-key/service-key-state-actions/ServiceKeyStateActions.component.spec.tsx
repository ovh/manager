import { ServiceKeyAction } from '@key-management-service/hooks/service-key/service-key.type';
import { useServiceKeyActionsList } from '@key-management-service/hooks/service-key/useServiceKeyActionsList';
import { okmsRoubaix1Mock } from '@key-management-service/mocks/kms/okms.mock';
import { serviceKeyMock1 } from '@key-management-service/mocks/service-keys/serviceKeys.mock';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BUTTON_COLOR } from '@ovhcloud/ods-react';

import ServiceKeyStateActions from './ServiceKeyStateActions.component';

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

describe('ServiceKeyStateActions', () => {
  it('renders only state actions', () => {
    mockedUseServiceKeyActionsList.mockReturnValue([
      makeAction('service-key-download_encryption_key_pem'),
      makeAction('service-key-download_encryption_key_jwk'),
      makeAction('service-key-deactivate_encryption_key'),
      makeAction('service-key-reactivate_encryption_key'),
      makeAction('service-key-delete_encryption_key'),
    ]);

    render(<ServiceKeyStateActions okms={okmsRoubaix1Mock} okmsKey={serviceKeyMock1} />);

    expect(screen.queryByTestId('service-key-download_encryption_key_pem')).not.toBeInTheDocument();
    expect(screen.queryByTestId('service-key-download_encryption_key_jwk')).not.toBeInTheDocument();
    expect(screen.getByTestId('service-key-deactivate_encryption_key')).toBeInTheDocument();
    expect(screen.getByTestId('service-key-reactivate_encryption_key')).toBeInTheDocument();
    expect(screen.getByTestId('service-key-delete_encryption_key')).toBeInTheDocument();
  });
});
