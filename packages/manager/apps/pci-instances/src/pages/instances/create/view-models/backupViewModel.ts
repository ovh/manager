import { mockedLocalBackups } from '@/__mocks__/instance/constants';

export const selectLocalBackups = () => ({
  items: mockedLocalBackups,
  price: '~0,011 € HT/mois/Go',
});
