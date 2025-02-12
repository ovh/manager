import githubIcon from './assets/github-icon.svg';

export default class ChangelogButtonCtrl {
  /* @ngInject */
  constructor(atInternet) {
    this.githubIcon = githubIcon;
    this.atInternet = atInternet;
  }

  $onInit() {
    const chapterKeys = ['chapter1', 'chapter2', 'chapter3'];
    this.computedTrackingContext = this.chapters.reduce((acc, value, index) => {
      acc[chapterKeys[index]] = value;
      return acc;
    }, {});
  }

  trackClick(key) {
    this.atInternet.trackClick({
      name: `tile-changelog-roadmap::external-link::go-to-${key}`,
      type: 'action',
      ...this.computedTrackingContext,
    });
  }
}
