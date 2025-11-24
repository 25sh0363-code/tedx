// Main site JS: preloader, page transitions, interactions
(function(){
    'use strict';

    // Preloader: hide after full load
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        if (!preloader) return;
        preloader.classList.add('hidden');
        // remove from DOM after animation
        setTimeout(() => { preloader.style.display = 'none'; }, 700);
    });

    // Page transition overlay when navigating between pages
    const pageTransition = document.getElementById('page-transition');
    function showTransition() {
        if (!pageTransition) return;
        pageTransition.classList.add('visible');
    }
    function hideTransition() {
        if (!pageTransition) return;
        pageTransition.classList.remove('visible');
    }

    // Intercept clicks on same-origin links to show transition overlay
    document.addEventListener('click', function(e){
        const a = e.target.closest('a');
        if (!a) return;
        // allow external links and anchors (hashes) to behave normally
        const href = a.getAttribute('href');
        if (!href) return;
        if (href.startsWith('#') || a.target === '_blank' || href.startsWith('mailto:') || href.startsWith('http')) return;

        // same-site navigation -> show overlay first
        e.preventDefault();
        showTransition();
        setTimeout(() => { window.location.href = href; }, 420);
    });

    // Smooth scrolling for intra-page anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return; // let default for non-elements
            e.preventDefault();
            // update active nav links
            document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
            const inNav = this.closest('nav');
            if (inNav) this.classList.add('active');

            window.scrollTo({ top: targetElement.offsetTop - 100, behavior: 'smooth' });
        });
    });

    // Header scroll effect
    const header = document.getElementById('header');
    const onScroll = () => {
        if (!header) return;
        if (window.scrollY > 100) header.classList.add('scrolled'); else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll);
    onScroll();

    // Intersection Observer for reveal animations
    (function() {
        const revealElements = document.querySelectorAll('.reveal');
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        obs.unobserve(entry.target);
                    }
                });
            }, {threshold: 0.08, rootMargin: '0px 0px -6% 0px'});

            revealElements.forEach((el, i) => {
                el.style.transitionDelay = (i * 50) + 'ms';
                io.observe(el);
            });
        } else {
            revealElements.forEach(el => el.classList.add('revealed'));
        }
    })();

    // Hero pointer parallax
    (function(){
        const hero = document.querySelector('.hero');
        if(!hero) return;
        let rAF = null;
        hero.addEventListener('mousemove', function(e){
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            if(rAF) cancelAnimationFrame(rAF);
            rAF = requestAnimationFrame(() => {
                hero.style.transform = `translateZ(0) perspective(800px) rotateY(${x * 0.6}deg) rotateX(${y * -0.4}deg)`;
            });
        });
        hero.addEventListener('mouseleave', () => { hero.style.transform = 'none'; });
    })();

    // keyboard accessibility: mission cards
    (function(){
        document.querySelectorAll('.mission-card').forEach(card => {
            if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex','0');
            card.addEventListener('focus', ()=> card.classList.add('revealed'));
        });
    })();

    // Hide transition after navigation in case user loaded page with transition visible
    window.addEventListener('pageshow', () => { setTimeout(hideTransition, 120); });

})();
