import { h } from 'vue';

const Badge = (props) =>
  h(props.htmlTag, { class: `oui-badge oui-badge_${props.level}` }, props.textContent);

Badge.props = {
  level: {
    type: String,
    default: 'info',
  },
  textContent: String,
  htmlTag: {
    type: String,
    default: 'span',
  },
};

export default Badge;
