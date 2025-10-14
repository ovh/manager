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
    this.formatedTrackingContext = `${this.chapters
      ?.filter((chapter) => chapter !== '')
      ?.join('::')}::tile-changelog-roadmap::external-link::go-to-`;
  }

  trackClick(key) {
    this.atInternet.trackClick({
      name: `${this.formatedTrackingContext}${key}`,
      type: 'action',
      ...this.computedTrackingContext,
    });
  }
}
