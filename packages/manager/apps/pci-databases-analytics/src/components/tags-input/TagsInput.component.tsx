import React, { useRef } from 'react';
import { z } from 'zod';
import { X, PlusCircle } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Button } from '../ui/button';

interface TagsInputProps {
  value: string[];
  onChange: (newTags: string[]) => void;
  min?: number;
  max?: number;
  pattern?: RegExp;
  placeholder?: string;
  disabled?: boolean;
  schema?: z.ZodString;
  children?: React.ReactNode;
}

const TagsInput = React.forwardRef<HTMLInputElement, TagsInputProps>(
  (
    {
      value,
      onChange,
      min,
      max,
      pattern,
      placeholder,
      disabled = false,
      schema: inputSchema,
      children,
    },
    ref,
  ) => {
    const addTagBtnRef = useRef<HTMLButtonElement>(null);
    let inputRules = z.string();

    if (inputSchema) {
      inputRules = inputSchema;
    } else {
      if (typeof min === 'number') {
        inputRules = inputRules.min(min);
      }
      if (typeof max === 'number') {
        inputRules = inputRules.max(max);
      }
      if (pattern instanceof RegExp) {
        inputRules = inputRules.regex(pattern, {
          message: 'Invalid pattern',
        });
      }
    }
    const schema = z
      .object({
        tag: inputRules,
      })
      .refine((newTag) => !value.includes(newTag.tag), {
        message: 'No duplicate value',
        path: ['tag'],
      });
    type ValidationSchema = z.infer<typeof schema>;
    const form = useForm<ValidationSchema>({
      resolver: zodResolver(schema),
      defaultValues: {
        tag: '',
      },
    });

    const handleAddTag: SubmitHandler<ValidationSchema> = (formValues) => {
      const newTags = [...value, formValues.tag];
      onChange(newTags);
      form.reset();
    };

    const handleRemoveTag = (index: number) => {
      const updatedTags = [...value];
      updatedTags.splice(index, 1);
      onChange(updatedTags);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        addTagBtnRef.current?.click();
        event.preventDefault();
      }
    };

    return (
      <Form {...form}>
        <div className="w-full flex flex-col gap-2">
          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <>
                <div className="flex w-full items-end">
                  <FormItem ref={ref} className="flex-grow">
                    <FormControl>
                      <Input
                        data-testid="input_tag"
                        type="text"
                        placeholder={placeholder}
                        onKeyDown={handleKeyDown}
                        disabled={disabled}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                  <Button
                    data-testid="add_tag_button"
                    ref={addTagBtnRef}
                    variant={'ghost'}
                    type="button"
                    onClick={form.handleSubmit(handleAddTag)}
                    className="text-primary rounded-full p-2 ml-2 hover:text-primary"
                  >
                    <PlusCircle />
                  </Button>
                </div>
                <FormMessage />
              </>
            )}
          />
          {children || (
            <div className="flex gap-2 flex-wrap">
              {value.map((tag, index) => (
                <div
                  key={`${tag}-${index}`}
                  className="border rounded-sm px-2.5 py-0.5 text-xs flex gap-2 items-center"
                >
                  <span>{tag}</span>
                  <Button
                    data-testid={`remove_tag_button_${index}`}
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    variant={'ghost'}
                    size={'icon'}
                    className="w-3 h-3 p-0"
                  >
                    <X />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Form>
    );
  },
);

TagsInput.displayName = 'TagsInput';

export default TagsInput;
