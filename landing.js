/* landing.js — Interazioni della landing page (index.html)
   Plain script, compatibile con file://. Nessuna dipendenza. */
(function () {
    'use strict';

    var LANG_KEY = 'landing-lang';
    var root = document.getElementById('html-root');
    var translatable = document.querySelectorAll('[data-en]');

    // ===== LINGUA IT / EN =====
    // Il contenuto italiano resta nell'HTML (SEO, no-JS); l'inglese vive in data-en.
    translatable.forEach(function (el) { el.dataset.it = el.innerHTML; });

    function setLang(lang) {
        root.lang = lang;
        translatable.forEach(function (el) {
            el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.it;
        });
        document.querySelectorAll('.lang-switch button').forEach(function (btn) {
            var active = btn.dataset.lang === lang;
            btn.classList.toggle('active', active);
            btn.setAttribute('aria-pressed', String(active));
        });
        try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* storage non disponibile */ }
    }

    document.querySelectorAll('.lang-switch button').forEach(function (btn) {
        btn.addEventListener('click', function () { setLang(btn.dataset.lang); });
    });

    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) { /* ignora */ }
    var initial = saved || ((navigator.language || 'it').toLowerCase().indexOf('it') === 0 ? 'it' : 'en');
    if (initial === 'en') setLang('en');

    // ===== NAV: sfondo dopo lo scroll =====
    var nav = document.getElementById('nav');
    function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 24); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ===== SCROLL REVEAL =====
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('in'); });
    }

    // ===== SPOTLIGHT: glow che segue il cursore =====
    document.querySelectorAll('[data-spot]').forEach(function (el) {
        el.addEventListener('pointermove', function (e) {
            var r = el.getBoundingClientRect();
            el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            el.style.setProperty('--my', (e.clientY - r.top) + 'px');
        });
    });

    // ===== VIDEO: pausa con reduced-motion =====
    var video = document.querySelector('.hero-video');
    if (video && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        video.removeAttribute('autoplay');
        video.pause();
    }

    document.getElementById('year').textContent = new Date().getFullYear();
})();
