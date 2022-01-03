export default class NumberChoiceController {
  $onInit() {
    this.hasPremium = this.choices.premium?.length;
    this.commonChoices = this.choices.common.map((choice) => ({
      id: choice,
      name: choice,
    }));

    if (this.hasPremium) {
      this.premiumChoices = this.choices.premium.map((choice) => ({
        id: choice,
        name: choice,
      }));
    }

    if (this.ngModel.numberType === this.prices.common.range) {
      [this.selectedCommonNumber] = this.commonChoices;
      this.ngModel.premium = undefined;
    } else {
      [this.selectedPremiumNumber] = this.premiumChoices;
      this.ngModel.common = undefined;
    }
  }

  onCommonChange(modelValue) {
    this.ngModel.numberType = this.prices.common.range;
    this.ngModel.common = modelValue.id;
    this.ngModel.premium = undefined;
    this.selectedPremiumNumber = undefined;
  }

  onPremiumChange(modelValue) {
    this.ngModel.numberType = this.prices.premium.range;
    this.ngModel.premium = modelValue.id;
    this.ngModel.common = undefined;
    this.selectedCommonNumber = undefined;
  }
}
