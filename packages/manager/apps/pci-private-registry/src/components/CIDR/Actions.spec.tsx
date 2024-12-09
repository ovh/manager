import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useParams } from 'react-router-dom';
import ActionComponent from './Actions';
import { useUpdateIpRestriction } from '@/api/hooks/useIpRestrictions';

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));
vi.mock('@/api/hooks/useIpRestrictions', () => ({
  useUpdateIpRestriction: vi.fn(),
}));

describe('ActionComponent', () => {
  it('renders ActionMenu with correct items', () => {
    // Mock les valeurs retournées
    (useParams as vi.Mock).mockReturnValue({
      projectId: 'project123',
      registryId: 'registry456',
    });
    const updateIpRestrictionsMock = vi.fn();
    (useUpdateIpRestriction as vi.Mock).mockReturnValue({
      updateIpRestrictions: updateIpRestrictionsMock,
    });

    // Données fictives pour les props
    const cidrMock = {
      ipBlock: '192.168.0.1/24',
      authorization: 'ALLOW',
      description: 'Test description',
    };

    // Rendu du composant
    render(<ActionComponent cidr={cidrMock} />);

    // Vérifie si l'ActionMenu est bien rendu
    const deleteButton = screen.getByText('private_registry_common_delete');
    expect(deleteButton).toBeInTheDocument();

    // Simule un clic
    fireEvent.click(deleteButton);

    // Vérifie que la fonction updateIpRestrictions est appelée correctement
    expect(updateIpRestrictionsMock).toHaveBeenCalledWith({
      cidrToUpdate: {
        ALLOW: [
          {
            ipBlock: '192.168.0.1/24',
            authorization: 'ALLOW',
            description: 'Test description',
          },
        ],
      },
      action: 'DELETE',
    });
  });
});
