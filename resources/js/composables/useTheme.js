import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useTheme() {
    const isDarkTheme = ref(false);
    let themeObserver = null;

    function syncThemeState() {
        isDarkTheme.value = document.documentElement.classList.contains('dark');
    }

    onMounted(() => {
        syncThemeState();
        themeObserver = new MutationObserver(() => syncThemeState());
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });
    });

    onBeforeUnmount(() => {
        if (themeObserver) themeObserver.disconnect();
    });

    return {
        isDarkTheme,
    };
}
