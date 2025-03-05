import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('zustand');

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (translationKey: string) => translationKey,
  }),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  useProjectUrl: () => '/foo/bar',
}));

vi.mock('@/hooks/project/useProjectId', () => ({
  useProjectId: () => '8c8c4fd6d4414aa29fc777752b00005198664',
}));
