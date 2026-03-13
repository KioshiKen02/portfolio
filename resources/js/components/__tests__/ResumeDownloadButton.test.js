import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ResumeDownloadButton from '../ResumeDownloadButton.vue';

describe('ResumeDownloadButton', () => {
  it('renders a download button without showing the URL', () => {
    const url = '/resume/melvin-rey-c-tambis-resume.pdf';
    const wrapper = mount(ResumeDownloadButton, { props: { url } });
    expect(wrapper.text()).toContain('Download Resume');
    expect(wrapper.text()).not.toContain(url);
  });

  it('creates an anchor and triggers click on press', async () => {
    const url = '/resume/melvin-rey-c-tambis-resume.pdf';
    const clickSpy = vi.fn();
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const removeSpy = vi.spyOn(HTMLElement.prototype, 'remove');

    const originalCreate = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      const el = originalCreate(tag);
      if (tag === 'a') el.click = clickSpy;
      return el;
    });

    const wrapper = mount(ResumeDownloadButton, { props: { url, filename: 'x.pdf' } });
    await wrapper.find('button').trigger('click');

    expect(appendSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
  });
});

