import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

export function useScrollSpy(sections) {
    const activeSection = ref('about');
    const navVisible = ref(false);
    const sceneIndex = ref(0);
    const sceneNextIndex = ref(0);
    const sceneT = ref(0);

    const sectionAnchors = ref([]);
    let scrollRaf = 0;
    let resizeRaf = 0;
    let activeObserver = null;

    function getSectionElements() {
        return sections.value.map((s) => ({
            id: s.id,
            el: s.ref.value,
        })).filter((s) => s.el);
    }

    function recalcAnchors() {
        const sectionEls = getSectionElements();
        sectionAnchors.value = sectionEls.map((s) => ({
            id: s.id,
            top: s.el.offsetTop,
        }));
    }

    function updateScrollEffects() {
        scrollRaf = 0;
        const y = window.scrollY || 0;
        navVisible.value = y > 40;

        const anchors = sectionAnchors.value;
        if (anchors.length < 2) return;

        const center = y + window.innerHeight * 0.55;
        let idx = 0;
        for (let i = 0; i < anchors.length - 1; i++) {
            if (center >= anchors[i].top && center < anchors[i + 1].top) {
                idx = i;
                break;
            }
            if (center >= anchors[anchors.length - 1].top) {
                idx = anchors.length - 1;
            }
        }

        const from = anchors[idx];
        const to = anchors[Math.min(idx + 1, anchors.length - 1)];
        const denom = Math.max(1, to.top - from.top);
        const t = idx === anchors.length - 1 ? 0 : Math.min(1, Math.max(0, (center - from.top) / denom));

        // Map section IDs to scene indices
        // Assuming the order in 'sections' matches the scene index order
        const map = sections.value.map(s => s.id);
        const currentScene = Math.max(0, Math.min(map.length - 1, map.indexOf(from.id)));
        const nextScene = Math.max(0, Math.min(map.length - 1, map.indexOf(to.id)));

        sceneIndex.value = currentScene === -1 ? 0 : currentScene;
        sceneNextIndex.value = nextScene === -1 ? 0 : nextScene;
        sceneT.value = t;
    }

    function onScroll() {
        if (scrollRaf) return;
        scrollRaf = window.requestAnimationFrame(updateScrollEffects);
    }

    function onResize() {
        if (resizeRaf) return;
        resizeRaf = window.requestAnimationFrame(() => {
            resizeRaf = 0;
            recalcAnchors();
            updateScrollEffects();
        });
    }

    function setupActiveSectionObserver() {
        if (activeObserver) activeObserver.disconnect();
        const sectionEls = getSectionElements().filter((s) => s.id !== 'hero');
        if (!sectionEls.length) return;

        activeObserver = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
                if (visible?.target?.id) activeSection.value = visible.target.id;
            },
            { root: null, threshold: [0.2, 0.35, 0.5], rootMargin: '-20% 0px -55% 0px' }
        );

        sectionEls.forEach((s) => activeObserver.observe(s.el));
    }

    onMounted(() => {
        recalcAnchors();
        setupActiveSectionObserver();
        updateScrollEffects();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });
    });

    onBeforeUnmount(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        if (scrollRaf) window.cancelAnimationFrame(scrollRaf);
        if (resizeRaf) window.cancelAnimationFrame(resizeRaf);
        if (activeObserver) activeObserver.disconnect();
    });

    return {
        activeSection,
        navVisible,
        sceneIndex,
        sceneNextIndex,
        sceneT,
        recalcAnchors,
        updateScrollEffects
    };
}
