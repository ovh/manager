import { ShapesInputComponent } from '@ovh-ux/manager-pci-common';
import { LabelComponent } from './Label.component';
import { ProductAddonDetail } from '@/types/product.type';

export default function SizeInputComponent({
  addons,
  value = null,
  onInput,
  columnsCount = 3,
}: Readonly<{
  addons: ProductAddonDetail[];
  value?: ProductAddonDetail;
  onInput: (item: ProductAddonDetail) => void;
  columnsCount?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}>): JSX.Element {
  return (
    <ShapesInputComponent<ProductAddonDetail>
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
