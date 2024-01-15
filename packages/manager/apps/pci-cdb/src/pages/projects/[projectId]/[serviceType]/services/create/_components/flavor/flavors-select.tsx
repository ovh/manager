import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Flavor } from '@/models/dto/OrderFunnel';

interface FlavorsSelectProps {
  selectedFlavor: string;
  listFlavors: Flavor[];
  onChange: (flavor: string) => void;
}

const FlavorsSelect = ({
  listFlavors,
  onChange,
  selectedFlavor,
}: FlavorsSelectProps) => {
  const Storage = ({ flavor }: { flavor: Flavor }) => {
    const { storage } = flavor;
    if (!storage) return '-';
    if (storage.minimum === storage.maximum)
      return `${storage.minimum.value} ${storage.minimum.unit}`;
    return `De ${storage.minimum.value} ${storage.minimum.unit} à ${storage.maximum.value} ${storage.maximum.unit}`;
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTableRowElement>,
    flavorName: string,
  ) => {
    if (e.key === 'Enter') {
      onChange(flavorName);
    }
  };
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-primary-100">
          <TableHead className="font-bold text-base text-primary-800">
            Type
          </TableHead>
          <TableHead className="font-bold text-base text-primary-800">
            vCores
          </TableHead>
          <TableHead className="font-bold text-base text-primary-800">
            Mémoire
          </TableHead>
          <TableHead className="font-bold text-base text-primary-800">
            Stockage utile
          </TableHead>
          <TableHead className="font-bold text-base text-primary-800">
            Coût/heure/nœud (estimé)
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {listFlavors.map((flavor) => (
          <TableRow
            tabIndex={0}
            onClick={() => onChange(flavor.name)}
            onKeyDown={(e) => handleKeyDown(e, flavor.name)}
            key={flavor.name}
            className={`border border-primary-100 hover:bg-primary-50 cursor-pointer ${
              selectedFlavor === flavor.name ? 'bg-[#DEF8FF]' : ''
            }`}
          >
            <TableCell className="border border-primary-100">
              {flavor.name}
            </TableCell>
            <TableCell className="border border-primary-100">
              {flavor.vcores ?? '-'}
            </TableCell>
            <TableCell className="border border-primary-100">
              {flavor.ram ? `${flavor.ram.value} ${flavor.ram.unit}` : '-'}
            </TableCell>
            <TableCell className="border border-primary-100">
              <Storage flavor={flavor} />
            </TableCell>
            <TableCell className="border border-primary-100">
              {(Math.random() * (2 - 0.059) + 0.059).toFixed(3)} € /heure
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FlavorsSelect;
