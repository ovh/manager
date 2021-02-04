<script>
import { defineComponent, h } from 'vue';

export default defineComponent({
  props: {
    level: {
      type: String,
      default: 'info',
    },
    textContent: String,
    htmlTag: {
      type: String,
      default: 'span',
    },
  },
  render() {
    return h(
      this.htmlTag,
      {
        class: `oui-badge oui-badge_${this.level}`,
      },
      this.textContent,
    );
  },
});
</script>

<style scoped></style>
