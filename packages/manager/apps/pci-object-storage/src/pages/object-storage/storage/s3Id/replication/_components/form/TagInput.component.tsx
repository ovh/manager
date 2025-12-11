import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';
import { Button, Input } from '@datatr-ux/uxlib';
import { TagMap, TagValidationErrors } from '../../../../../../../types/Tag';

type TagInputProps = {
  tags: TagMap;
  setTags: (tags: TagMap) => void;
  isPending: boolean;
  disabled?: boolean;
  validationErrors?: TagValidationErrors;
};

export const TagInput = ({
  tags,
  setTags,
  isPending,
  disabled = false,
  validationErrors = {},
}: TagInputProps) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/replication');

  const removeTag = (id: number) => {
    const nextTags = { ...tags };
    delete nextTags[id];
    setTags(nextTags);
  };

  const updateTag = (id: number, field: 'key' | 'value', value: string) => {
    setTags({
      ...tags,
      [id]: { ...tags[id], [field]: value },
    });
  };

  const addNewTag = () => {
    const nextId = Math.max(0, ...Object.keys(tags).map(Number)) + 1;
    setTags({
      ...tags,
      [nextId]: { key: '', value: '' },
    });
  };

  const isDisabled = isPending || disabled;
  return (
    <div className="mt-2">
      <div>
        <h3 className="text-sm font-medium mb-2">{t('tagsLabel')}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t('tagsDescription')}
        </p>
      </div>

      <div className="space-y-2">
        {Object.entries(tags).map(([id, tag]) => (
          <div key={id} className="flex gap-2 items-start">
            <div className="flex-1">
              <Input
                placeholder={t('tagKeyPlaceholder')}
                value={tag.key}
                onChange={(e) => updateTag(Number(id), 'key', e.target.value)}
                disabled={isDisabled}
                className={
                  validationErrors[Number(id)]?.key ? 'border-red-500' : ''
                }
              />
              {validationErrors[Number(id)]?.key && (
                <p className="text-xs text-red-500 mt-1">
                  {validationErrors[Number(id)].key}
                </p>
              )}
            </div>
            <div className="flex-1">
              <Input
                placeholder={t('tagValuePlaceholder')}
                value={tag.value}
                onChange={(e) => updateTag(Number(id), 'value', e.target.value)}
                disabled={isDisabled}
                className={
                  validationErrors[Number(id)]?.value ? 'border-red-500' : ''
                }
              />
              {validationErrors[Number(id)]?.value && (
                <p className="text-xs text-red-500 mt-1">
                  {validationErrors[Number(id)].value}
                </p>
              )}
            </div>
            <Button
              type="button"
              mode="outline"
              variant="critical"
              size="menu"
              className="mt-1"
              onClick={() => removeTag(Number(id))}
              disabled={isDisabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
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
