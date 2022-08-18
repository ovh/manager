import { Calendar, InputCalendar } from '@ovh-ux/manager-themes';
import esLocale from 'date-fns/locale/es';
import frLocale from 'date-fns/locale/fr';

export default {
  title: 'Example/Calendar',
  component: Calendar,
};

const Template = () => (
  <>
    <Calendar locale={frLocale} />
  </>
);

const TemplateLocale = () => <InputCalendar locale={esLocale} />;

const TemplateInput = () => (
  <>
    <InputCalendar valueDate={new Date(2022, 5, 18)} />
  </>
);

const TemplateMaxDates = () => (
  <>
    <InputCalendar
      maxDate={new Date(2022, 7, 18)}
      minDate={new Date(2022, 7, 11)}
    />
  </>
);

const TemplateDisabledDates = () => (
  <InputCalendar
    disabledDates={[new Date(2022, 7, 18), new Date(2022, 7, 11)]}
  />
);

export const Default = Template.bind({});
export const Input = TemplateInput.bind({});
export const MaxAndMinDates = TemplateMaxDates.bind({});
export const DisabledDates = TemplateDisabledDates.bind({});
export const WithLocale = TemplateLocale.bind({});
