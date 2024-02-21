import Price from '@/components/price';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AvailabilitiesHookOutput } from '@/hooks/useAvailabilities';
import { formatStorage } from '@/lib/bytesHelper';
import { Flavor } from '@/models/order-funnel';

interface FlavorsSelectProps {
  model: AvailabilitiesHookOutput;
  showMonthlyPrice?: boolean;
}

const FlavorsSelect = ({
  model,
  showMonthlyPrice = false,
}: FlavorsSelectProps) => {
  const Storage = ({ flavor }: { flavor: Flavor }) => {
    const { storage } = flavor;
    if (!storage) return '-';
    if (
      storage.minimum.value === storage.maximum.value &&
      storage.minimum.unit === storage.maximum.unit
    )
      return formatStorage(storage.minimum);
    return `De ${formatStorage(storage.minimum)} à ${formatStorage(
      storage.maximum,
    )}`;
  };
  const clickInput = (flavorName: string) => {
    const inputElement = document.getElementById(
      `flavor-${flavorName}`,
    ) as HTMLInputElement | null;
    if (inputElement) {
      inputElement.click();
    }
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTableRowElement>,
    flavorName: string,
  ) => {
    if (e.key === 'Enter') {
      clickInput(flavorName);
    }
  };
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-primary-100 hover:bg-primary-10">
          <TableHead className="font-bold text-base text-[#4d5592]">
            Type
          </TableHead>
          <TableHead className="font-bold text-base text-[#4d5592]">
            vCores
          </TableHead>
          <TableHead className="font-bold text-base text-[#4d5592]">
            Mémoire
          </TableHead>
          <TableHead className="font-bold text-base text-[#4d5592]">
            Stockage utile
          </TableHead>
          <TableHead className="font-bold text-base text-[#4d5592]">
            Coût/heure/nœud (estimé)
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {model.listFlavors
          .sort((a, b) => a.order - b.order)
          .map((flavor) => (
            <TableRow
              tabIndex={0}
              onClick={() => clickInput(flavor.name)}
              onKeyDown={(e) => handleKeyDown(e, flavor.name)}
              key={flavor.name}
              className={`border border-primary-100 hover:bg-primary-50 cursor-pointer text-[#4d5592] ${
                model.flavor === flavor.name ? 'bg-[#DEF8FF] font-bold' : ''
              }`}
            >
              <td className="hidden">
                <input
                  type="radio"
                  name="flavor-select"
                  onChange={(e) => model.setFlavor(e.target.value)}
                  className="hidden"
                  id={`flavor-${flavor.name}`}
                  value={flavor.name}
                  checked={model.flavor === flavor.name}
                />
              </td>
              <TableCell className="text-[#4d5592] border border-primary-100">
                {flavor.name}
              </TableCell>
              <TableCell className="text-[#4d5592] border border-primary-100">
                {flavor.vcores ?? '-'}
              </TableCell>
              <TableCell className="text-[#4d5592] border border-primary-100">
                {flavor.ram ? `${flavor.ram.value} ${flavor.ram.unit}` : '-'}
              </TableCell>
              <TableCell className="text-[#4d5592] border border-primary-100">
                <Storage flavor={flavor} />
              </TableCell>
              <TableCell className="text-[#4d5592] border border-primary-100">
                <Price
                  priceInUcents={
                    flavor.pricing[showMonthlyPrice ? 'monthly' : 'hourly']
                      .price
                  }
                  taxInUcents={
                    flavor.pricing[showMonthlyPrice ? 'monthly' : 'hourly'].tax
                  }
                  decimals={showMonthlyPrice ? 2 : 3}
                />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default FlavorsSelect;
