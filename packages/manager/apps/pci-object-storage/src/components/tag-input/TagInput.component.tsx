import { TFunction } from 'i18next';
import { Plus, X } from 'lucide-react';
import { Button, Input } from '@datatr-ux/uxlib';
import { Tag } from '@/types/Tag';

type TagError = {
  key?: { message?: string };
  value?: { message?: string };
};

type TagInputProps = {
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  isPending: boolean;
  disabled?: boolean;
  showHeader?: boolean;
  t: TFunction;
  errors?: TagError[];
};

export const TagInput = ({
  tags,
  setTags,
  isPending,
  disabled = false,
  showHeader = true,
  t,
  errors,
}: TagInputProps) => {
  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const updateTag = (
    index: number,
    field: 'key' | 'value',
    newValue: string,
  ) => {
    setTags(
      tags.map((tag, i) => (i === index ? { ...tag, [field]: newValue } : tag)),
    );
  };

  const addNewTag = () => {
    setTags([...tags, { key: '', value: '' }]);
  };

  const isDisabled = isPending || disabled;
  return (
    <div className="mt-2">
      {showHeader && (
        <div>
          <h3 className="text-sm font-medium mb-2">{t('tagsLabel')}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('tagsDescription')}
          </p>
        </div>
      )}

      <div className="space-y-2">
        {tags.map((tag, index) => {
          const keyError = errors?.[index]?.key?.message;
          return (
            <div key={index}>
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <Input
                    placeholder={t('tagKeyPlaceholder')}
                    value={tag.key}
                    onChange={(e) => updateTag(index, 'key', e.target.value)}
                    disabled={isDisabled}
                    data-invalid={!!keyError}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder={t('tagValuePlaceholder')}
                    value={tag.value}
                    onChange={(e) => updateTag(index, 'value', e.target.value)}
                    disabled={isDisabled}
                  />
                </div>
                <Button
                  type="button"
                  mode="outline"
                  variant="critical"
                  size="menu"
                  className="mt-1"
                  onClick={() => removeTag(index)}
                  disabled={isDisabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {keyError && (
                <p className="text-critical-500 text-sm mt-1">{keyError}</p>
              )}
            </div>
          );
        })}
      </div>

      <Button
        className="mt-2"
        type="button"
        size="md"
        mode="outline"
        onClick={addNewTag}
        disabled={isDisabled}
      >
        <Plus className="h-4 w-4" />
        {t('addTag')}
      </Button>
    </div>
  );
};
