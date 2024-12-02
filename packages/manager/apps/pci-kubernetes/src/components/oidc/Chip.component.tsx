import { OsdsInput, OsdsChip } from '@ovhcloud/ods-components/react';
import {
  ODS_CHIP_SIZE,
  ODS_INPUT_TYPE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import { useState } from 'react';

export type InputProps = Omit<
  React.ComponentProps<typeof OsdsInput>,
  'onOdsValueChange' | 'onOdsInputBlur'
> & { onChange: () => void; onBlur: () => void };

export const Chip = ({
  name,
  value,
  onChange,
  onBlur,
  error,
  ...rest
}: InputProps) => {
  const [categories, setSelectedCategories] = useState(['a', 'b', 'c']);

  const onDeleteCategory = (category: string) =>
    setSelectedCategories(categories.filter((c) => c !== category));

  return (
    <>
      <OsdsInput
        type={ODS_INPUT_TYPE.text}
        className={`mt-3 ${error ? 'bg-red-100' : ''}`}
        name={name}
        data-testid={`${name}-input`}
        onOdsValueChange={onChange}
        onOdsInputBlur={onBlur}
        value={value}
        {...rest}
      />

      {/* {categories.map((category) => (
        <OsdsChip
          key={category}
          className="inline-flex m-3"
          color={ODS_THEME_COLOR_INTENT.primary}
          removable
          size={ODS_CHIP_SIZE.sm}
          onOdsChipRemoval={() => onDeleteCategory(category)}
        >
          {category}
        </OsdsChip>
      ))} */}
    </>
  );
};
