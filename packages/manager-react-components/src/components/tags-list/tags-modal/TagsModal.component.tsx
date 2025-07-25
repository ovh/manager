import React, {
  forwardRef,
  ElementRef,
  useState,
  useCallback,
  ForwardedRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  BUTTON_VARIANT,
  BUTTON_SIZE,
  Input,
  MODAL_COLOR,
  ModalContent,
} from '@ovhcloud/ods-react';
import { Modal } from '../../Modal';
import './translations';
import { TagsStack } from '../tags-stack/TagsStack.component';
import { TagsModalProps } from './TagsModal.props';

export const TagsModal = forwardRef(
  (
    {
      open = false,
      heading,
      tags,
      onEditTags,
      onCancel,
      onOpenChange,
    }: TagsModalProps,
    ref: ForwardedRef<ElementRef<typeof ModalContent>>,
  ) => {
    const { t } = useTranslation('tags-modal');
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<string[]>(tags);

    const handleSearch = useCallback(() => {
      setResults(search ? tags.filter((tag) => tag.includes(search)) : tags);
    }, [search, tags]);

    return (
      <Modal
        ref={ref}
        type={MODAL_COLOR.neutral}
        open={open}
        heading={`Tags: ${heading}`}
        {...(onEditTags && {
          primaryButton: {
            label: `${t('edit_tags')}`,
            onClick: onEditTags,
          },
        })}
        secondaryButton={{
          label: `${t('back')}`,
          onClick: onCancel,
        }}
        onOpenChange={onOpenChange}
      >
        <div className="flex w-full mb-4">
          <Input
            name="search"
            className="rounded-l flex-1 mr-1"
            placeholder={t('search_placeholder')}
            type="text"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(event.target.value);
            }}
          />
          <Button
            variant={BUTTON_VARIANT.outline}
            size={BUTTON_SIZE.sm}
            onClick={handleSearch}
          >
            {t('search')}
          </Button>
        </div>
        <div className="w-full min-w-[85px] max-h-[120px] overflow-auto">
          {results && <TagsStack tags={results} />}
        </div>
      </Modal>
    );
  },
);

export default TagsModal;
