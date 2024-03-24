import Splitting from 'splitting';
import { gsap } from 'gsap';

const nav = document.querySelector('.nav');
const section = {
    title: Splitting({
        target: '.section_title',
        by: 'chars',
    }),
    paragraphs: Splitting({
        target: '.section_col',
        by: 'words',
    }),
    image: document.querySelector('.section_col_image'),
    overlay: document.querySelector('.section_col_overlay'),
};

const animateSection = () => {
    const titleChars = section.title[0].chars;
    const paragraphsWords = section.paragraphs[0].words;

    gsap.set(titleChars, { autoAlpha: 0, yPercent: -100, rotate: '-15deg' });
    gsap.set(paragraphsWords, { autoAlpha: 0, display: 'inline-flex' });
    gsap.set(section.image, { autoAlpha: 0, scale: 1.5 });

    const t1 = gsap.timeline({ defaults: { duration: 1.64, ease: 'power4.inOut' } });

    t1.addLabel('start')
        .from(nav, { yPercent: -100 })
        .addLabel('section')
        .to(titleChars, {
            autoAlpha: 1,
            yPercent: 0,
            rotate: '0deg',
            stagger: 0.024,
        }, 'start+=0.6')
        .to(paragraphsWords, {
            autoAlpha: 1,
            stagger: 0.024,
        }, 'start+=0.6')
        .addLabel('image')
        .to(section.overlay, { yPercent: 101 }, 'start+=0.6')
        .to(section.image, { autoAlpha: 1, scale: 1 }, 'start+=0.6');
};

export default animateSection;
