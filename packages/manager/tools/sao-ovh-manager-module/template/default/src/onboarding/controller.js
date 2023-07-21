<% const pascalcasedName = this.camelcase(name, { pascalCase: true }) -%>
import { GUIDES } from './constants';

export default class <%= pascalcasedName %>OnboardingCtrl {
  constructor() {
    this.GUIDES = GUIDES;
  }
}
