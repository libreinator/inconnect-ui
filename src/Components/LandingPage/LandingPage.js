import React, { useEffect, useRef } from 'react';
import img from './IMG-KONVERT.jpg';
import './Landing.css';
import Splitting from 'splitting';
import { gsap } from 'gsap';
import { Link } from "react-router-dom";
const LandingPage = () => {
    const navRef = useRef(null);
    const sectionTitleRef = useRef(null);
    const sectionColRef = useRef(null);
    const sectionImageRef = useRef(null);
    const sectionOverlayRef = useRef(null);

    useEffect(() => {
        const nav = navRef.current;
        const sectionTitle = sectionTitleRef.current;
        const sectionCol = sectionColRef.current;
        const sectionImage = sectionImageRef.current;
        const sectionOverlay = sectionOverlayRef.current;

        const section = {
            title: Splitting({
                target: sectionTitle,
                by: 'chars',
            }),
            paragraphs: Splitting({
                target: sectionCol,
                by: 'words',
            }),
            image: sectionImage,
            overlay: sectionOverlay,
        };

        const titleChars = section.title[0].chars;
        const paragraphsWords = section.paragraphs[0].words;

        gsap.set(titleChars, { autoAlpha: 0, yPercent: -100, rotate: '-15deg' });
        gsap.set(paragraphsWords, { autoAlpha: 0, display: 'inline-flex' });
        gsap.set(section.image, { autoAlpha: 0, scale: 1.5 });

        const t1 = gsap.timeline({ defaults: { duration: 1.64, ease: 'power4.inOut' } });

        t1.addLabel('section')
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
            .to(section.overlay, { yPercent: 101 })
            .to(section.image, { autoAlpha: 1, scale: 1 }, '-=2');
    }, []);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
    };

    return (
        <body>
            <main className="Lander">
                <div className="nav" ref={navRef}>
                    <div className="nav_wrapper grid">
                        <div className="nav_logo">
                            <span>INCONNECT</span>
                        </div>
                        <div className="nav_pages">
                            <span>Home</span>
                            <span><Link to="/login">Login</Link></span>
                            <span><Link to="/Register">SignUp</Link></span>
                        </div>
                        <div className='nav_menu'>
                            <div className="nav_menu_button menu-open">
                                <span className='nav_menu_line'></span>
                                <span className='nav_menu_line'></span>
                            </div>
                        </div>
                    </div>
                </div>
                <section className='section'>
                    <div className="section_wrapper">
                        <div className="section_title" ref={sectionTitleRef}>
                            <h2>Inconnect</h2>
                        </div>
                        <div className="section_col" ref={sectionColRef}>
                            <div className="section_col_left">
                                <h4 className='section_col_left_text'>
                                    Next-Gen Speech to Sign Language Technology. Introducing our revolutionary Intelligent Sign Language Technology,Powered by cutting-edge AI technology.
                                </h4>
                                <div className="setion_col_left_cta">
                                    <span>&rarr;</span>
                                    <span>Powered By Neural Harbour AI</span>
                                </div>
                            </div>
                            <div className="section_col_right">
                                <p className="section_col_right_text">
                                    Our sophisticated algorithms delve into the speech's intricate details,enabling anyone to perform quick,accurate and comprehensive conversions.
                                </p>
                            </div>
                        </div>
                        <div className='section_col'>
                            <div className="section_col_overlay" ref={sectionOverlayRef}></div>
                            <img src={img} alt="dummy" className='section_col_image' ref={sectionImageRef} />
                        </div>
                    </div>
                </section>
            </main>
        </body >
    );
};

export default LandingPage;
