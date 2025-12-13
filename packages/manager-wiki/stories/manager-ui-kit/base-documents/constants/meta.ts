// Since v7, storybook does not allow anything else than string literal on Meta.
// so we can't use those constants on meta declaration and still needs to duplicate those values.
// Until a solution is found, those are still useful when defining <StorybookLink />

enum SECTION {
  design = 'Design and Style',
  guides = 'Guides',
  home = 'OVHcloud Design System',
  migrationGuide = 'Migration guide',
  reactComponents = 'React Components',
  tools = 'Tools',
  whatsNew = 'What\'s new?',
}

enum HOME_TITLE {
  accessibilityGuide = `${SECTION.home}/${SECTION.guides}/Accessibility`,
  getStarted = `${SECTION.home}/Get Started`,
  handlingFormGuide = `${SECTION.home}/${SECTION.guides}/Handling Form`,
  i18nGuide = `${SECTION.home}/${SECTION.guides}/Internationalization`,
  migration12to13 = `${SECTION.home}/${SECTION.whatsNew}/${SECTION.migrationGuide}/12.x to 13.x`,
  migration13to14 = `${SECTION.home}/${SECTION.whatsNew}/${SECTION.migrationGuide}/13.x to 14.x`,
  migration14to15 = `${SECTION.home}/${SECTION.whatsNew}/${SECTION.migrationGuide}/14.x to 15.x`,
  migration15to16 = `${SECTION.home}/${SECTION.whatsNew}/${SECTION.migrationGuide}/15.x to 16.x`,
  migration16to17 = `${SECTION.home}/${SECTION.whatsNew}/${SECTION.migrationGuide}/16.x to 17.x`,
  migration17to18 = `${SECTION.home}/${SECTION.whatsNew}/${SECTION.migrationGuide}/17.x to 18.x`,
  styleCustomization = `${SECTION.home}/${SECTION.design}/Style Customization`,
  welcome = `${SECTION.home}/Welcome`,
}

enum REACT_COMPONENTS_TITLE {
  accordion = `${SECTION.reactComponents}/Accordion`,
  badge = `${SECTION.reactComponents}/Badge`,
  breadcrumb = `${SECTION.reactComponents}/Breadcrumb`,
  button = `${SECTION.reactComponents}/Button`,
  card = `${SECTION.reactComponents}/Card`,
  cart = `${SECTION.reactComponents}/Cart`,
  checkbox = `${SECTION.reactComponents}/Checkbox`,
  clipboard = `${SECTION.reactComponents}/Clipboard`,
  code = `${SECTION.reactComponents}/Code`,
  combobox = `${SECTION.reactComponents}/Combobox`,
  contentAddon = `${SECTION.reactComponents}/Content Addon`,
  datepicker = `${SECTION.reactComponents}/Datepicker`,
  divider = `${SECTION.reactComponents}/Divider`,
  drawer = `${SECTION.reactComponents}/Drawer`,
  fileUpload = `${SECTION.reactComponents}/File Upload`,
  flag = `${SECTION.reactComponents}/Flag`,
  formField = `${SECTION.reactComponents}/Form Field`,
  icon = `${SECTION.reactComponents}/Icon`,
  input = `${SECTION.reactComponents}/Input`,
  link = `${SECTION.reactComponents}/Link`,
  medium = `${SECTION.reactComponents}/Medium`,
  menu = `${SECTION.reactComponents}/Menu`,
  message = `${SECTION.reactComponents}/Message`,
  meter = `${SECTION.reactComponents}/Meter`,
  modal = `${SECTION.reactComponents}/Modal`,
  pagination = `${SECTION.reactComponents}/Pagination`,
  password = `${SECTION.reactComponents}/Password`,
  phoneNumber = `${SECTION.reactComponents}/Phone Number`,
  popover = `${SECTION.reactComponents}/Popover`,
  progressBar = `${SECTION.reactComponents}/Progress Bar`,
  searchBar = `${SECTION.reactComponents}/Search Bar`,
  quantity = `${SECTION.reactComponents}/Quantity`,
  radioGroup = `${SECTION.reactComponents}/Radio Group`,
  range = `${SECTION.reactComponents}/Range`,
  select = `${SECTION.reactComponents}/Select`,
  skeleton = `${SECTION.reactComponents}/Skeleton`,
  spinner = `${SECTION.reactComponents}/Spinner`,
  switch = `${SECTION.reactComponents}/Switch`,
  table = `${SECTION.reactComponents}/Table`,
  tabs = `${SECTION.reactComponents}/Tabs`,
  tag = `${SECTION.reactComponents}/Tag`,
  text = `${SECTION.reactComponents}/Text`,
  textarea = `${SECTION.reactComponents}/Textarea`,
  timepicker = `${SECTION.reactComponents}/Timepicker`,
  toggle = `${SECTION.reactComponents}/Toggle`,
  tooltip = `${SECTION.reactComponents}/Tooltip`,
  treeView = `${SECTION.reactComponents}/Tree View`,
}

enum STORY {
  documentation = 'Documentation',
  technicalInformation = 'Technical information',
}

export {
  HOME_TITLE,
  REACT_COMPONENTS_TITLE,
  SECTION,
  STORY,
};
