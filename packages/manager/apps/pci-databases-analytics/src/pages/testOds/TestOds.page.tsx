import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ButtonTest from './_components/button';
import BadgeTest from './_components/badge';
import AccordionTest from './_components/accordion';
import BreadcrumbTest from './_components/breadcrumb';
import CardTest from './_components/card';
import ClipboardTest from './_components/clipboard';
import CheckboxTest from './_components/checkbox';
import LinkTest from './_components/link';
import InputTest from './_components/input';
import SelectTest from './_components/select';
import ToastTest from './_components/toast';
import ComboboxTest from './_components/combobox';
import RadioTest from './_components/radio';
import DatePickerTest from './_components/datepicker';
import CodeTest from './_components/code';
import FormTest from './_components/form';
import DividerTest from './_components/divider';
import DrawerTest from './_components/drawer';
import MessageTest from './_components/message';
import ModalTest from './_components/modal';
import PopoverTest from './_components/popover';
import ProgressbarTest from './_components/progressbar';
import SkeletonTest from './_components/skeleton';
import SpinnerTest from './_components/spinner';
import TableTest from './_components/table';

const TestOds = () => {
  const components = [
    { name: 'Accordion', component: AccordionTest },
    { name: 'Badge', component: BadgeTest },
    { name: 'Breadcrumb', component: BreadcrumbTest },
    { name: 'Button', component: ButtonTest },
    { name: 'Card', component: CardTest },
    { name: 'Checkbox', component: CheckboxTest },
    { name: 'Clipboard', component: ClipboardTest },
    { name: 'Code', component: CodeTest },
    { name: 'Combobox', component: ComboboxTest },
    { name: 'Datepicker', component: DatePickerTest },
    { name: 'Divider', component: DividerTest },
    { name: 'Drawer', component: DrawerTest },
    { name: 'Form', component: FormTest },
    { name: 'Input', component: InputTest },
    { name: 'Link', component: LinkTest },
    { name: 'Message', component: MessageTest },
    { name: 'Modal', component: ModalTest },
    { name: 'Input', component: InputTest },
    { name: 'Popover', component: PopoverTest },
    { name: 'Progress', component: ProgressbarTest },
    { name: 'Radio', component: RadioTest },
    { name: 'Select', component: SelectTest },
    { name: 'Skeleton', component: SkeletonTest },
    { name: 'Spinner', component: SpinnerTest },
    { name: 'Table', component: TableTest },
    { name: 'Toast', component: ToastTest },
  ];
  const [currentComponent, setCurrentComponent] = useState(components[0]);
  return (
    <>
      <h1>Test ODS</h1>
      <div className="flex gap-0.5 flex-wrap">
        {components.map((c) => (
          <Button
            size="sm"
            variant={currentComponent.name === c.name ? 'default' : 'outline'}
            className={
              currentComponent.name === c.name
                ? 'bg-blue-500 text-white py-0 h-6'
                : 'py-0 h-6'
            }
            key={c.name}
            onClick={() => setCurrentComponent(c)}
          >
            {c.name}
          </Button>
        ))}
      </div>
      <currentComponent.component />
    </>
  );
};

export default TestOds;
