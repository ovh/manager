import { act, fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MOCK_CATALOG, MOCK_QUOTA, MOCKED_VOLUME } from '@/__tests__/mocks';
import VolumeEdit from '@/pages/create-volume/VolumeEdit.component';
import { createWrapper } from '@/wrapperRenders';

vi.mock('@/data/api/hooks/useCatalog', () => ({
  useVolumeCatalog: vi.fn(() => ({ data: MOCK_CATALOG })),
}));

vi.mock('@/data/api/hooks/useQuota', () => ({
  useRegionsQuota: vi.fn(() => ({ data: MOCK_QUOTA })),
}));

describe('VolumeEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Name input', () => {
    it('uses suggested name as default value if specified', () => {
      const { container } = render(
        <VolumeEdit
          projectId="fake-project-id"
          volume={MOCKED_VOLUME}
          suggestedName="Some suggested name"
          submitLabel="submit-label"
          onSubmit={() => {}}
          onCancel={() => {}}
        />,
        { wrapper: createWrapper() },
      );
      const nameInput = container.querySelector('input[name="volume_name"]');
      expect(nameInput).toHaveValue('Some suggested name');
    });

    it('uses volume.name as default value if no suggested name', () => {
      const { container } = render(
        <VolumeEdit
          projectId="fake-project-id"
          volume={MOCKED_VOLUME}
          submitLabel="submit-label"
          onSubmit={() => {}}
          onCancel={() => {}}
        />,
        { wrapper: createWrapper() },
      );
      const nameInput = container.querySelector('input[name="volume_name"]');
      expect(nameInput).toHaveValue(MOCKED_VOLUME.name);
    });

    it('allows an empty value', async () => {
      const onSubmit = vi.fn();
      const { container, queryByText } = render(
        <VolumeEdit
          projectId="fake-project-id"
          volume={MOCKED_VOLUME}
          submitLabel="submit-label"
          onSubmit={onSubmit}
          onCancel={() => {}}
        />,
        { wrapper: createWrapper() },
      );
      const nameInput = container.querySelector('input[name="volume_name"]');
      act(() =>
        fireEvent.change(nameInput as Element, { target: { value: '' } }),
      );

      // Check that no error message is present
      const errorMessage = queryByText('common_field_error_required');
      expect(errorMessage).toBeNull();

      // Check that form is submittable
      const submitButton = queryByText('submit-label');
      expect(submitButton).not.toBeDisabled();
      const formElt = container.querySelector('form');
      act(() => fireEvent.submit(formElt as Element));
      expect(onSubmit).toHaveBeenCalled();
    });

    it('show an error when name is too long and disable form', () => {
      const onSubmit = vi.fn();
      const { container, queryByText } = render(
        <VolumeEdit
          projectId="fake-project-id"
          volume={MOCKED_VOLUME}
          submitLabel="submit-label"
          onSubmit={onSubmit}
          onCancel={() => {}}
        />,
        { wrapper: createWrapper() },
      );
      const nameInput = container.querySelector('input[name="volume_name"]');
      act(() => {
        fireEvent.change(nameInput as Element, {
          target: { value: 'Some very long string. '.repeat(50) },
        });
      });

      // Check error message
      const errorMessage = queryByText('common_field_error_maxlength');
      expect(errorMessage).toBeTruthy();
      expect(errorMessage).toHaveClass('text-critical');

      // Check that form is not submittable
      const submitButton = queryByText('submit-label');
      expect(submitButton).toBeDisabled();
      const formElt = container.querySelector('form');
      act(() => fireEvent.submit(formElt as Element));
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
});
