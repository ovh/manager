import { onMounted, ref, onUnmounted } from 'vue';

const useWindowResize = () => {
  const width = ref(0);
  const handleResize = () => {
    width.value = window.innerWidth;
  };

  onMounted(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  return width;
};

export default useWindowResize;
