import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomeView from '../views/HomeView.vue';

// Mock the child components that are not the focus of this test
vi.mock('../components/ProfilePicture.vue', () => ({
  default: { template: '<div>ProfilePicture</div>' }
}));
vi.mock('../components/ProjectPhotoCarousel.vue', () => ({
  default: { template: '<div>ProjectPhotoCarousel</div>' }
}));
vi.mock('../components/PhotoLightbox.vue', () => ({
  default: { template: '<div>PhotoLightbox</div>' }
}));
vi.mock('../components/ExperienceTimeline.vue', () => ({
  default: { template: '<div>ExperienceTimeline</div>' }
}));
vi.mock('../components/ResumeDownloadButton.vue', () => ({
  default: { template: '<button>ResumeDownloadButton</button>' }
}));
vi.mock('../components/CodeTypewriter.vue', () => ({
  default: { template: '<div>CodeTypewriter</div>' }
}));
vi.mock('../components/RotatingTypewriter.vue', () => ({
  default: { template: '<div>RotatingTypewriter</div>' }
}));

// Mock the composables
vi.mock('../composables/useTheme', () => ({
  useTheme: () => ({ isDarkTheme: { value: false } })
}));

vi.mock('../composables/useScrollSpy', () => ({
  useScrollSpy: () => ({
    activeSection: { value: 'hero' },
    navVisible: { value: true },
    sceneIndex: { value: 4 }, // Ensure certificates section is visible
    sceneNextIndex: { value: 4 },
    sceneT: { value: 1 },
    recalcAnchors: vi.fn(),
    updateScrollEffects: vi.fn()
  })
}));

vi.mock('../composables/useContactForm', () => ({
  useContactForm: () => ({
    form: { name: '', email: '', message: '' },
    errors: { name: '', email: '', message: '' },
    submitState: { value: 'idle' },
    handleContactSubmit: vi.fn()
  })
}));

vi.mock('../composables/usePortfolioData', () => ({
  usePortfolioData: () => ({
    projects: { value: [] },
    skills: { value: [] },
    experienceItems: { value: [] },
    loadingProjects: { value: false },
    loadingSkills: { value: false },
    loadingTimeline: { value: false },
    loadAllData: vi.fn(),
    normalizeImageUrl: vi.fn(),
    projectPhotoUrls: vi.fn()
  })
}));

// Mock window.AppConfig
global.window.AppConfig = { settings: {} };

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

describe('Certificates Section in HomeView', () => {
  let wrapper;

  beforeEach(() => {
    // Mount the component
    wrapper = mount(HomeView, {
      global: {
        stubs: {
          RouterLink: true
        },
        directives: {
          motion: () => {} // Mock the v-motion directive
        }
      }
    });
  });

  it('renders the correct number of certification and seminar cards', () => {
    // 1 certification + 13 seminars = 14 cards
    const cards = wrapper.findAll('#certificates article');
    expect(cards.length).toBe(14);
  });

  it('conditionally renders the download button based on photo availability', () => {
    // We mocked the data with no photos, so no download buttons should exist
    const certs = wrapper.findAll('#certifications-list article');
    expect(certs[0].find('a').exists()).toBe(false);
  });

  it('conditionally renders the image or placeholder icon', () => {
    // We mocked the data with no photos, so only SVG placeholders should exist
    const firstCert = wrapper.findAll('#certifications-list article')[0];
    expect(firstCert.find('img').exists()).toBe(false);
    expect(firstCert.find('svg.text-slate-400').exists()).toBe(true);
  });

  it('toggles the certifications list when heading is clicked', async () => {
    const certList = wrapper.find('#certifications-list');
    const toggleButton = wrapper.find('button[aria-controls="certifications-list"]');
    
    // Initially expanded
    expect(certList.isVisible()).toBe(true);
    
    // Click to collapse
    await toggleButton.trigger('click');
    
    // Should be hidden
    expect(certList.isVisible()).toBe(false);
    
    // Click to expand
    await toggleButton.trigger('click');
    
    // Should be visible again
    expect(certList.isVisible()).toBe(true);
  });

  it('toggles the seminars list when heading is clicked', async () => {
    const semList = wrapper.find('#seminars-list');
    const toggleButton = wrapper.find('button[aria-controls="seminars-list"]');
    
    // Initially expanded
    expect(semList.isVisible()).toBe(true);
    
    // Click to collapse
    await toggleButton.trigger('click');
    
    // Should be hidden
    expect(semList.isVisible()).toBe(false);
  });
});
