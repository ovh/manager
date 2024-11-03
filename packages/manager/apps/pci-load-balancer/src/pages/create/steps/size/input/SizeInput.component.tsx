import { ShapesInputComponent } from '@ovh-ux/manager-pci-common';
import { TAddon } from '@/pages/create/store';
import { LabelComponent } from './Label.component';

export default function SizeInputComponent({
  addons,
  value = null,
  onInput,
}: Readonly<{
  addons: TAddon[];
  value?: TAddon;
  onInput: (item: TAddon) => void;
}>): JSX.Element {
  return (
    <ShapesInputComponent<TAddon>
      items={addons}
      value={value}
      onInput={onInput}
      item={{
        LabelComponent,
        getId: (item) => item.code,
      }}
    />
  );
}
