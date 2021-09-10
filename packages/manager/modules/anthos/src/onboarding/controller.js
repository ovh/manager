export default class AnthosOnboardingCtrl {
  $onInit() {
    this.trackPage('onboarding');
  }

  onGuideLinkClick(guide) {
    this.trackClick(`onboarding::guide::${guide.name}`);
  }
}
