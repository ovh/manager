import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ButtonTest from './_components/ButtonTest';
import BadgeTest from './_components/BadgeTest';
import AccordionTest from './_components/AccordionTest';
import BreadcrumbTest from './_components/BreadcrumbTest';
import CardTest from './_components/CardTest';

const TestOds = () => {
  const components = [
    { name: 'Accordion', component: AccordionTest },
    { name: 'Badge', component: BadgeTest },
    { name: 'Breadcrumb', component: BreadcrumbTest },
    { name: 'Button', component: ButtonTest },
    { name: 'Card', component: CardTest },
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
