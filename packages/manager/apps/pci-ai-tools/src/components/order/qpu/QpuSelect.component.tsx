import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@datatr-ux/uxlib';
import { cn } from '@/lib/utils';
import { Qpu } from '@/types/orderFunnel';
import Price from '@/components/price/Price.component';

interface QpusSelectProps {
  qpus: Qpu[];
  value: string;
  onChange: (newQpu: string) => void;
  className?: string;
  isUpdate?: boolean;
}

const QpusSelect = React.forwardRef<HTMLTableElement, QpusSelectProps>(
  ({ qpus, value, onChange, isUpdate, className }, ref) => {
    const { t } = useTranslation('ai-tools/components/qpu');

    qpus.sort((a, b) => a.pricing[0].price - b.pricing[0].price);
    const clickInput = (qpuName: string) => {
      const inputElement = document.getElementById(
        `qpu-${qpuName}`,
      ) as HTMLInputElement | null;
      if (inputElement) {
        inputElement.click();
      }
    };
    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLTableRowElement>,
      qpuName: string,
    ) => {
      if (e.key === 'Enter') {
        clickInput(qpuName);
      }
    };
    return (
      <Table
        data-testid="qpu-select-table"
        ref={ref}
        className={cn('min-w-max w-full', className)}
      >
        <TableHeader
          className="border bg-[#f7f8f8]"
          data-testid="qpu-select-table-header"
        >
          <TableRow>
            <TableHead className="h-10 px-2 border font-semibold text-primary-800">
              {t('tableHeadType')}
            </TableHead>
            {!isUpdate && (
              <TableHead className="h-10 px-2 border font-semibold text-primary-800">
                {t('tableHeadDescription')}
              </TableHead>
            )}
            <TableHead className="h-10 px-2 border font-semibold text-primary-800">
              {t('tableHeadQubits')}
            </TableHead>
            <TableHead className="h-10 px-2 border font-semibold text-primary-800">
              {t('tableHeadPrice')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody data-testid="qpu-select-table-body">
          {qpus.map((qpu) => (
            <TableRow
              data-testid={`qpu-table-row-${qpu.id}`}
              tabIndex={0}
              onClick={() => clickInput(qpu.id)}
              onKeyDown={(e) => handleKeyDown(e, qpu.id)}
              key={qpu.id}
              className={`border hover:bg-primary-50 cursor-pointer text-[#4d5592] ${
                value === qpu.id
                  ? 'bg-primary-50 font-semibold !border-2 border-primary-500'
                  : ''
              }`}
            >
              <td className="hidden">
                <input
                  type="radio"
                  name="qpu-select"
                  onChange={(e) => onChange(e.target.value)}
                  className="hidden"
                  id={`qpu-${qpu.id}`}
                  value={qpu.id}
                  checked={value === qpu.id}
                />
              </td>
              <TableCell className="text-[#4d5592] border capitalize">
                <div className="flex gap-2 w-full items-center">
                  <Cpu className="size-4" />
                  <span>{qpu.id}</span>
                </div>
              </TableCell>
              {!isUpdate && (
                <TableCell className="text-[#4d5592] border capitalize">
                  {qpu.description}
                </TableCell>
              )}
              <TableCell className="text-[#4d5592] border capitalize">
                {qpu.qubits}
              </TableCell>
              <TableCell className="text-[#4d5592] border capitalize">
                <Price
                  priceInUcents={(qpu.pricing[0]?.price || 0) * 3600}
                  taxInUcents={(qpu.pricing[0]?.tax || 0) * 3600}
                  decimals={2}
                  displayInHour={true}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
);

QpusSelect.displayName = 'QpusSelect';

export default QpusSelect;
