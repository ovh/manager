import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ButtonTest from './_components/button';
import BadgeTest from './_components/badge';
import AccordionTest from './_components/accordion';
import BreadcrumbTest from './_components/breadcrumb';
import CardTest from './_components/card';
import ClipboardTest from './_components/clipboard';
import CheckboxTest from './_components/checkbox';

const TestOds = () => {
  const components = [
    { name: 'Accordion', component: AccordionTest },
    { name: 'Badge', component: BadgeTest },
    { name: 'Breadcrumb', component: BreadcrumbTest },
    { name: 'Button', component: ButtonTest },
    { name: 'Card', component: CardTest },
    { name: 'Checkbox', component: CheckboxTest },
    { name: 'Clipboard', component: ClipboardTest },
  ];
  const [currentComponent, setCurrentComponent] = useState(components[0]);
  return (
    <>
      <h1>Test ODS</h1>
      <div className="flex gap-0.5">
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
