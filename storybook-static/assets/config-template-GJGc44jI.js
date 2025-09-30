import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{u as o}from"./index-DdETsLzO.js";import{M as s}from"./index-BiZMyzLv.js";import"./index-Bnop-kX6.js";import"./iframe-Cw17PQb7.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function t(i){const e={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...o(),...i.components};return n.jsxs(n.Fragment,{children:[n.jsx(s,{title:"Guidelines/React Templates/Config page"}),`
`,n.jsx(e.h1,{id:"how-to-add-a-config-page-",children:"How to add a Config Page ?"}),`
`,n.jsxs(e.blockquote,{children:[`
`,n.jsx(e.p,{children:"💡 Good to know"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.code,{children:"Config"})," is not implemented in the ",n.jsx(e.a,{href:"https://github.com/ovh/manager/tree/master/packages/manager/core/generator",rel:"nofollow",children:n.jsx(e.code,{children:"generator"})})," by default, you have to create a new page"]}),`
`]}),`
`,n.jsx(e.p,{children:"A config page is a dedicated Form-based interfaces for creating services."}),`
`,n.jsxs(e.p,{children:["We recommand to call it ",n.jsx(e.code,{children:"config"})," and not ",n.jsx(e.code,{children:"create"})," or ",n.jsx(e.code,{children:"new"})]}),`
`,n.jsx(e.h2,{id:"as-a-developer",children:"As a developer"}),`
`,n.jsx(e.p,{children:"You have to create a new page for configuration settings. Here's how to implement it:"}),`
`,n.jsxs(e.p,{children:["It can be ",n.jsx(e.code,{children:"pages/config/config.page.tsx"})]}),`
`,n.jsx(e.h3,{id:"main-components",children:"Main Components"}),`
`,n.jsx(e.h4,{id:"baselayout",children:"BaseLayout"}),`
`,n.jsxs(e.p,{children:["The config page uses the ",n.jsx(e.code,{children:"BaseLayout"})," component from ",n.jsx(e.code,{children:"manager-react-components"})," as its main container. This provides consistent styling and structure across the application."]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { BaseLayout } from '@ovh-ux/manager-react-components';

const ConfigPage = () => {
  return (
    <BaseLayout
      header={{
        title: t('config.title'),
        description: t('config.description'),
      }}
    >
      {/* Config content goes here */}
    </BaseLayout>
  );
};
`})}),`
`,n.jsx(e.h3,{id:"implementation-example",children:"Implementation Example"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { BaseLayout } from '@ovh-ux/manager-react-components';
import { OdsFormField, OdsSelect, OdsCheckbox } from '@ovhcloud/ods-components/react';

const ConfigPage = () => {
  const [settings, setSettings] = useState({
    setting1: false,
    setting2: 'option1',
    setting3: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(settings);
      // Show success message
    } catch (error) {
      // Handle error
    }
  };

  return (
    <BaseLayout
      header={{
        title: t('config.title'),
        description: t('config.description'),
      }}
    >
      <form onSubmit={handleSubmit}>
        <OdsFormField label={t('config.setting1.label')}>
          <OdsCheckbox
            checked={settings.setting1}
            onChange={(value) => setSettings({ ...settings, setting1: value })}
          />
        </OdsFormField>

        <OdsFormField label={t('config.setting2.label')}>
          <OdsSelect
            value={settings.setting2}
            onChange={(value) => setSettings({ ...settings, setting2: value })}
            items={[
              { value: 'option1', label: t('config.setting2.option1') },
              { value: 'option2', label: t('config.setting2.option2') },
            ]}
          />
        </OdsFormField>

        <button type="submit">{t('config.save')}</button>
      </form>
    </BaseLayout>
  );
};
`})}),`
`,n.jsx(e.h3,{id:"react-hook-form-and-zod",children:"REACT HOOK FORM AND ZOD"}),`
`,n.jsx(e.p,{children:"For form handling and validation, we recommend using React Hook Form with Zod. This combination provides type-safe form validation and efficient form state management."}),`
`,n.jsx(e.h4,{id:"react-hook-form",children:"React Hook Form"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Provides efficient form state management"}),`
`,n.jsx(e.li,{children:"Reduces re-renders"}),`
`,n.jsx(e.li,{children:"Handles form submission and validation"}),`
`,n.jsx(e.li,{children:"Supports complex form scenarios"}),`
`]}),`
`,n.jsx(e.h4,{id:"zod",children:"Zod"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Type-safe schema validation"}),`
`,n.jsx(e.li,{children:"Runtime type checking"}),`
`,n.jsx(e.li,{children:"Automatic TypeScript type inference"}),`
`,n.jsx(e.li,{children:"Rich validation features"}),`
`]}),`
`,n.jsx(e.p,{children:"Here's an example of how to implement them:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define your form schema
const configSchema = z.object({
  setting1: z.boolean(),
  setting2: z.enum(['option1', 'option2']),
  setting3: z.string().min(1, 'This field is required'),
});

type ConfigFormData = z.infer<typeof configSchema>;

const ConfigPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      setting1: false,
      setting2: 'option1',
      setting3: '',
    },
  });

  const onSubmit = async (data: ConfigFormData) => {
    try {
      await updateSettings(data);
      // Show success message
    } catch (error) {
      // Handle error
    }
  };

  return (
    <BaseLayout
      header={{
        title: t('config.title'),
        description: t('config.description'),
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <OdsFormField 
          label={t('config.setting1.label')}
          error={errors.setting1?.message}
        >
          <OdsCheckbox
            {...register('setting1')}
          />
        </OdsFormField>

        <OdsFormField 
          label={t('config.setting2.label')}
          error={errors.setting2?.message}
        >
          <OdsSelect
            {...register('setting2')}
            items={[
              { value: 'option1', label: t('config.setting2.option1') },
              { value: 'option2', label: t('config.setting2.option2') },
            ]}
          />
        </OdsFormField>

        <button type="submit" disabled={isSubmitting}>
          {t('config.save')}
        </button>
      </form>
    </BaseLayout>
  );
};
`})}),`
`,n.jsx(e.h4,{id:"benefits-of-using-react-hook-form-and-zod",children:"Benefits of using React Hook Form and Zod"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Type Safety"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Full TypeScript support"}),`
`,n.jsx(e.li,{children:"Runtime type checking"}),`
`,n.jsx(e.li,{children:"Automatic type inference"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Performance"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Minimal re-renders"}),`
`,n.jsx(e.li,{children:"Efficient form state management"}),`
`,n.jsx(e.li,{children:"Optimized validation"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Developer Experience"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Clear error messages"}),`
`,n.jsx(e.li,{children:"Easy form state access"}),`
`,n.jsx(e.li,{children:"Simple validation rules"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Maintenance"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Centralized validation logic"}),`
`,n.jsx(e.li,{children:"Reusable schemas"}),`
`,n.jsx(e.li,{children:"Easy to update and extend"}),`
`]}),`
`]}),`
`]}),`
`,n.jsx(e.h2,{id:"-tracking-checklist",children:"📊 TRACKING Checklist"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"[ ] TrackPage display tracking on component mount"}),`
`,n.jsx(e.li,{children:"[ ] TrackClick - Next step buttons"}),`
`,n.jsx(e.li,{children:"[ ] TrackClick - Submit form buttons"}),`
`]}),`
`,n.jsx(e.h3,{id:"external-resources",children:"External Resources"}),`
`,n.jsx(e.h4,{id:"react-hook-form-1",children:"React Hook Form"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://react-hook-form.com/get-started",rel:"nofollow",children:"Official Documentation"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://react-hook-form.com/ts",rel:"nofollow",children:"TypeScript Integration"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://react-hook-form.com/get-started#Formvalidation",rel:"nofollow",children:"Form Validation"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://react-hook-form.com/advanced-usage",rel:"nofollow",children:"Advanced Usage"})}),`
`]}),`
`,n.jsx(e.h4,{id:"zod-1",children:"Zod"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://zod.dev/",rel:"nofollow",children:"Official Documentation"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://zod.dev/?id=typescript",rel:"nofollow",children:"TypeScript Integration"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://zod.dev/?id=schema-validation",rel:"nofollow",children:"Schema Validation"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://zod.dev/?id=error-handling",rel:"nofollow",children:"Error Handling"})}),`
`]}),`
`,n.jsx(e.h3,{id:"code-review-checklist",children:"Code Review Checklist"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["[ ] Use ",n.jsx(e.code,{children:"BaseLayout"})," component from ",n.jsx(e.code,{children:"manager-react-components"})]}),`
`,n.jsx(e.li,{children:"[ ] Implement proper form validation"}),`
`,n.jsx(e.li,{children:"[ ] Handle loading and error states"}),`
`,n.jsx(e.li,{children:"[ ] Use ODS components for form elements"}),`
`,n.jsx(e.li,{children:"[ ] Add proper translations"}),`
`,n.jsx(e.li,{children:"[ ] Implement proper error handling"}),`
`,n.jsx(e.li,{children:"[ ] Add success/error notifications"}),`
`,n.jsx(e.li,{children:"[ ] Follow accessibility guidelines"}),`
`]})]})}function p(i={}){const{wrapper:e}={...o(),...i.components};return e?n.jsx(e,{...i,children:n.jsx(t,{...i})}):t(i)}export{p as default};
