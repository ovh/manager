import indicator from './templates/indicator.html';
import nextButton from './templates/nextButton.html';
import prevButton from './templates/prevButton.html';

export default class WalkMeTemplate {
  static getNavigation(currentIndex, steps) {
    return `
      ${prevButton.replace(
        '{{ visibility }}',
        currentIndex === 0 ? 'invisible' : 'visible',
      )}
      <div class="oui-slideshow__indicators mr-4 text-center">
        ${steps
          .map((step, index) => indicator.replace('{{ id }}', index))
          .join('')}
      </div>
      ${nextButton.replace(
        '{{ visibility }}',
        currentIndex === steps.length - 1 ? 'invisible' : 'visible',
      )}
    `;
  }
}
