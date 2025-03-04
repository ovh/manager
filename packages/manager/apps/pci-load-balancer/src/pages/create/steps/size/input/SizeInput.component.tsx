import { ShapesInputComponent } from '@ovh-ux/manager-pci-common';
import { LabelComponent } from './Label.component';
import { Addon } from '@/types/addon.type';

export default function SizeInputComponent({
  addons,
  value = null,
  onInput,
  columnsCount = 3,
}: Readonly<{
  addons: Addon[];
  value?: Addon;
  onInput: (item: Addon) => void;
  columnsCount?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}>): JSX.Element {
  return (
    <ShapesInputComponent<Addon>
      items={addons}
      value={value}
      onInput={onInput}
      columnsCount={columnsCount}
      item={{
        LabelComponent,
        getId: (item) => item.size,
      }}
    />
  );
}
