/**
 * MUHANNAD MAHMOUD — PORTFOLIO ENGINE
 * Features:
 * - Interactive Grid Mesh Spotlight (Cursor Tracking Element)
 * - Fluid Custom Magnetic Cursor
 * - Project Filter System
 * - High-Res Project Lightbox Modal
 * - Interactive Clipboard Email Copy
 * - Real-time Giza Egypt Clock
 * - Interactive Portrait 3D Parallax
 * - Mobile Navigation Toggle
 */

(function () {
    'use strict';

    /* ==========================================================================
       1. INTERACTIVE GRID SPOTLIGHT TRACKING
       ========================================================================== */
    function initSpotlightTracking() {
        const grid = document.getElementById('spotlightGrid');
        if (!grid) return;

        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2;
        let currentX = targetX;
        let currentY = targetY;

        window.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        });

        function updateSpotlight() {
            // Smooth lerp for the spotlight position
            currentX += (targetX - currentX) * 0.14;
            currentY += (targetY - currentY) * 0.14;

            grid.style.setProperty('--mouse-x', `${currentX}px`);
            grid.style.setProperty('--mouse-y', `${currentY}px`);

            requestAnimationFrame(updateSpotlight);
        }

        requestAnimationFrame(updateSpotlight);
    }

    /* ==========================================================================
       2. FLUID CUSTOM CURSOR
       ========================================================================== */
    function initCustomCursor() {
        const dot = document.getElementById('cursorDot');
        const outline = document.getElementById('cursorOutline');
        if (!dot || !outline) return;

        // Skip on coarse pointers (touch)
        if (window.matchMedia('(pointer: coarse)').matches) {
            dot.style.display = 'none';
            outline.style.display = 'none';
            return;
        }

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let outlineX = mouseX;
        let outlineY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = `${mouseX}px`;
            dot.style.top = `${mouseY}px`;
        });

        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.16;
            outlineY += (mouseY - outlineY) * 0.16;

            outline.style.left = `${outlineX}px`;
            outline.style.top = `${outlineY}px`;

            requestAnimationFrame(animateCursor);
        }
        requestAnimationFrame(animateCursor);

        // Hover expansions on clickable elements
        const interactives = document.querySelectorAll('a, button, .project-card, .tool-card, .filter-tab');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                outline.style.transform = 'translate(-50%, -50%) scale(1.6)';
                outline.style.borderColor = 'rgba(255, 77, 148, 0.85)';
                outline.style.backgroundColor = 'rgba(230, 43, 119, 0.08)';
            });
            el.addEventListener('mouseleave', () => {
                outline.style.transform = 'translate(-50%, -50%) scale(1)';
                outline.style.borderColor = 'rgba(230, 43, 119, 0.45)';
                outline.style.backgroundColor = 'transparent';
            });
        });
    }

    /* ==========================================================================
       3. PROJECT CATEGORY FILTER
       ========================================================================== */
    function initProjectFilters() {
        const tabs = document.querySelectorAll('.filter-tab');
        const cards = document.querySelectorAll('.project-card');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.getAttribute('data-filter');

                cards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 250);
                    }
                });
            });
        });
    }

    /* ==========================================================================
       4. PROJECT LIGHTBOX MODAL
       ========================================================================== */
    function initProjectModal() {
        const modal = document.getElementById('projectModal');
        const backdrop = document.getElementById('modalBackdrop');
        const closeBtn = document.getElementById('modalCloseBtn');
        const modalImg = document.getElementById('modalImg');
        const modalTitle = document.getElementById('modalTitle');
        const modalType = document.getElementById('modalType');
        const modalClient = document.getElementById('modalClient');
        const modalDesc = document.getElementById('modalDesc');

        if (!modal) return;

        function openModal(card) {
            const img = card.getAttribute('data-img');
            const title = card.getAttribute('data-title');
            const type = card.getAttribute('data-type');
            const client = card.getAttribute('data-client');
            const desc = card.getAttribute('data-desc');

            if (modalImg) modalImg.src = img || '';
            if (modalTitle) modalTitle.textContent = title || 'Project Showcase';
            if (modalType) modalType.textContent = type || 'Visual Identity';
            if (modalClient) modalClient.textContent = client || 'Confidential';
            if (modalDesc) modalDesc.textContent = desc || '';

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => openModal(card));
        });

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (backdrop) backdrop.addEventListener('click', closeModal);

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    /* ==========================================================================
       5. COPY TO CLIPBOARD EMAIL
       ========================================================================== */
    function initClipboardCopy() {
        const copyBar = document.getElementById('emailCopyBar');
        const copyBtn = document.getElementById('copyBtn');
        const toast = document.getElementById('toastNotice');
        const toastMsg = document.getElementById('toastMsg');

        function triggerCopy(textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                if (toast) {
                    if (toastMsg) toastMsg.textContent = `Email copied: ${textToCopy}`;
                    toast.classList.add('show');
                    setTimeout(() => {
                        toast.classList.remove('show');
                    }, 3000);
                }
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }

        if (copyBar) {
            const email = copyBar.getAttribute('data-email') || 'mohned.mahmoud772@gmail.com';
            copyBar.addEventListener('click', () => triggerCopy(email));
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                triggerCopy('mohned.mahmoud772@gmail.com');
            });
        }
    }

    /* ==========================================================================
       6. REAL-TIME LOCAL CLOCK (Giza, Egypt)
       ========================================================================== */
    function initGizaClock() {
        const clockEl = document.getElementById('localTimeDisplay');
        if (!clockEl) return;

        function updateTime() {
            try {
                const now = new Date();
                const options = {
                    timeZone: 'Africa/Cairo',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                };
                const timeStr = new Intl.DateTimeFormat('en-US', options).format(now);
                clockEl.textContent = `GIZA, EGYPT • ${timeStr} (EET)`;
            } catch (e) {
                clockEl.textContent = 'GIZA, EGYPT • LIVE';
            }
        }

        updateTime();
        setInterval(updateTime, 1000);
    }

    /* ==========================================================================
       7. ENLARGED PORTRAIT 3D MOUSE PARALLAX
       ========================================================================== */
    function initPortraitParallax() {
        const stage = document.querySelector('.portrait-stage');
        const card = document.querySelector('.portrait-card');
        const chips = document.querySelectorAll('.floating-chip');

        if (!stage || !card) return;

        stage.addEventListener('mousemove', (e) => {
            const rect = stage.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = (y / (rect.height / 2)) * -9;
            const rotateY = (x / (rect.width / 2)) * 9;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            chips.forEach((chip, idx) => {
                const factor = (idx + 1) * 7;
                chip.style.transform = `translate(${x / factor}px, ${y / factor}px)`;
            });
        });

        stage.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            chips.forEach(chip => {
                chip.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    /* ==========================================================================
       8. MOBILE NAVIGATION TOGGLE
       ========================================================================== */
    function initMobileNav() {
        const toggle = document.getElementById('mobileToggle');
        const menu = document.getElementById('navMenu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            const isOpen = menu.style.display === 'flex';
            if (isOpen) {
                menu.style.display = 'none';
            } else {
                menu.style.display = 'flex';
                menu.style.flexDirection = 'column';
                menu.style.position = 'absolute';
                menu.style.top = '100%';
                menu.style.left = '0';
                menu.style.width = '100%';
                menu.style.background = '#110d17';
                menu.style.padding = '1.5rem';
                menu.style.borderRadius = '20px';
                menu.style.marginTop = '0.5rem';
                menu.style.border = '1px solid rgba(255,255,255,0.1)';
                menu.style.boxShadow = '0 20px 40px rgba(0,0,0,0.8)';
            }
        });

        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    menu.style.display = 'none';
                }
            });
        });
    }

    /* ==========================================================================
       9. BOOTSTRAP INITIALIZATION
       ========================================================================== */
    window.addEventListener('DOMContentLoaded', () => {
        initSpotlightTracking();
        initCustomCursor();
        initProjectFilters();
        initProjectModal();
        initClipboardCopy();
        initGizaClock();
        initPortraitParallax();
        initMobileNav();
    });

})();
