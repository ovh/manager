// import { describe, it, vi } from 'vitest';
// import { fireEvent, render } from '@testing-library/react';
// import { UpdateOIDCProviderPage } from '@/pages/oidc-provider/update/UpdateOIDCProvider.page';
// import { wrapper } from '@/wrapperRenders';
// import * as useKubernetesModule from '@/api/hooks/useKubernetes';

// describe('UpdateOIDCProviderPage', () => {
// it('renders OIDC Provider Modal correctly', () => {
//   const { getByTestId } = render(<UpdateOIDCProviderPage />, { wrapper });

//   // Vérifie si le modal est bien dans le DOM
//   expect(getByTestId('oidcProviderModal')).toBeInTheDocument();
// });

// it('displays loading spinner when data is pending', () => {
//   vi.spyOn(useKubernetesModule, 'useOidcProvider').mockReturnValue({
//     isPending: true,
//   } as any); // Remplacez `any` par le type correct

// const { getByTestId } = render(<UpdateOIDCProviderPage />, { wrapper });

// Vérifie si le spinner de chargement est visible
//   expect(getByTestId('oidcProviderModal-spinner')).toBeVisible();
// });

// it('displays modal content when data is available', () => {
//   vi.spyOn(useKubernetesModule, 'useOidcProvider').mockReturnValue({
//     isPending: false,
//     data: { clientId: 'test-client-id' },
//   } as any);

//   const { getByText } = render(<UpdateOIDCProviderPage />, { wrapper });

//   // Vérifie si un texte spécifique est bien présent dans le modal
//   expect(
//     getByText(/some text that should be in the modal content/i)
//   ).toBeInTheDocument();
// });

// it('calls updateOidcProvider on confirm button click', () => {
//   const mockUpdateOidcProvider = vi.fn();
//   vi.spyOn(useKubernetesModule, 'useOidcProvider').mockReturnValue({
//     useOidcProvider: mockUpdateOidcProvider,
//     isPending: false,
//   } as any);

//   const { getByTestId } = render(<UpdateOIDCProviderPage />, { wrapper });

//   // Simule un clic sur le bouton de soumission
//   fireEvent.click(getByTestId('oidcProviderModal-button_submit'));

//   // Vérifie si la fonction de mise à jour est bien appelée
//   expect(mockUpdateOidcProvider).toHaveBeenCalled();
// });

// it('disables submit button when update is pending', () => {
//   vi.spyOn(useKubernetesModule, 'useOidcProvider').mockReturnValue({
//     useOidcProvider: vi.fn(),
//     isPending: true,
//   } as any);

//   const { getByTestId } = render(<UpdateOIDCProviderPage />, { wrapper });

//   // Vérifie si le bouton de soumission est désactivé
//   expect(getByTestId('oidcProviderModal-button_submit')).toBeDisabled();
// });
// });
