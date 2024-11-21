import { ShapesInputComponent } from '@ovh-ux/manager-pci-common';
import { TAddon } from '@/pages/create/store';
import { LabelComponent } from './Label.component';

export default function SizeInputComponent({
  addons,
  value = null,
  onInput,
  columnsCount = 3,
}: Readonly<{
  addons: TAddon[];
  value?: TAddon;
  onInput: (item: TAddon) => void;
  columnsCount?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}>): JSX.Element {
  return (
    <ShapesInputComponent<TAddon>
      items={addons}
      value={value}
      onInput={onInput}
      columnsCount={columnsCount}
      item={{
        LabelComponent,
        getId: (item) => item.code,
      }}
    />
  );
}
