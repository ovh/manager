export default class AnthosOnboardingCtrl {
  onGuideLinkClick(guide) {
    this.trackClick(`onboarding::guide::${guide.name}`);
  }
}
