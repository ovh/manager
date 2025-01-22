import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const TestOds = () => {
  const [components, setComponents] = useState<
    { name: string; component: React.ComponentType }[]
  >([]);
  const [currentComponent, setCurrentComponent] = useState(
    components[0] || null,
  );

  useEffect(() => {
    // Dynamically import all components in the '_components' folder
    const modules = import.meta.glob('./_components/**/index.tsx');
    const loadComponents = async () => {
      const loadedComponents = await Promise.all(
        Object.entries(modules)
          .filter(([path]) => !path.includes('/Stories.tsx')) // Exclude `Stories.tsx`
          .map(async ([path, importer]) => {
            const module = await importer();
            const name = path
              .replace('./_components/', '')
              .replace('/index.tsx', '')
              .replace(/([a-z])([A-Z])/g, '$1 $2') // Converts camelCase or PascalCase to readable format
              .replace(/_/g, ' '); // Replace underscores with spaces

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return { name, component: (module as { default: any }).default };
          }),
      );
      setComponents(loadedComponents);
      setCurrentComponent(loadedComponents[0]);
    };

    loadComponents();
  }, []);

  return (
    <>
      <h1>Test ODS</h1>
      <h3>Components</h3>
      <div className="flex gap-0.5 flex-wrap">
        {components.map((c) => (
          <Button
            size="sm"
            variant={currentComponent?.name === c.name ? 'default' : 'outline'}
            className={
              currentComponent?.name === c.name
                ? 'bg-blue-500 text-white py-0 h-6'
                : 'py-0 h-6'
            }
            key={c.name}
            onClick={() => setCurrentComponent(c)}
          >
            <span className="capitalize">{c.name}</span>
          </Button>
        ))}
      </div>
      {currentComponent && <currentComponent.component />}
    </>
  );
};

export default TestOds;
