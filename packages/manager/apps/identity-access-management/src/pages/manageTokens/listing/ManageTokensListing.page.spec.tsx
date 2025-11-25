import '@testing-library/jest-dom';
import { describe, it, vi } from 'vitest';
import { renderTestApp } from '@/test-utils/renderTestApp';

describe('Manage Tokens page', () => {
  it('displays Manage Tokens page', async () => {
    await renderTestApp('/manage-tokens/fakeUserId');
  });
});
