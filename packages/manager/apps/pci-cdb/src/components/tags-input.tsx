import React, { useMemo, useState } from 'react';
import { z } from 'zod';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from './ui/form';

interface TagsInputProps {
  value: string[] | undefined;
  onChange: (newTags: string[] | undefined) => void;
  schema: any;
}

const TagsInput = React.forwardRef<HTMLInputElement, TagsInputProps>(
  ({ value, schema, onChange }, ref) => {
    console.log(schema)
    type ValidationSchema = z.infer<typeof schema>;
    const [tagInput, setTagInput] = useState('');
    const form = useForm<ValidationSchema>({
      resolver: zodResolver(schema),
      defaultValues: [],
    });
    if (!value) return <></>;

    const errors = useMemo(() => {
        const messages: string[] = [];
        const formErrors = form.formState.errors;
        Object.keys(formErrors).forEach((key) => {
          const validKey = key as keyof typeof formErrors;
          const formError = formErrors[validKey];
          if (formError && formError.message) {
            messages.push(formError.message);
          }
        });
  
        return messages;
      }, [form.formState.errors]);

    const handleAddTag: SubmitHandler<ValidationSchema> = (formValues) => {
      onChange([
        ...value,
        formValues.role.replace('(defined db)', formValues.customDB),
      ]);
      form.reset();
    };

    const addTag = () => {
      try {
        schema.parse([...value, tagInput]);
        onChange([...value, tagInput]);
        // setValue('tags', [...value, tagInput]);
        setTagInput('');
      } catch (error) {
        if (error instanceof z.ZodError) {
          const validationErrors = error.errors.map((err) => err.message);
          console.error('Tag validation error:', validationErrors);
        } else {
          console.error('An unexpected error occurred:', error);
        }
      }
    };

    const removeTag = (index: number) => {
      const newTags = [...value];
      newTags.splice(index, 1);
      onChange([...value, tagInput]);
    };
    return (
      <div className="flex w-full items-end">
        {/* <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter customDB"
                      {...field}
                      onKeyDown={handleKeyDown}
                      disabled={
                        !currentRole.includes(USER_CONFIG.roles.customTag)
                      }
                      readOnly={
                        !currentRole.includes(USER_CONFIG.roles.customTag)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
        <Input
          type="text"
          placeholder="Add a tag"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          ref={ref}
        />
        <button type="button" onClick={addTag}>
          Add
        </button>
        <div>
          {errors.map((error, i) => (
            <span key={i} className="text-sm font-medium text-destructive">
              {error}
            </span>
          ))}
        </div>
        <ul>
          {value.map((tag, index) => (
            <li key={index}>
              {tag}{' '}
              <button type="button" onClick={() => removeTag(index)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  },
);

TagsInput.displayName = 'TagsInput';

export default TagsInput;
