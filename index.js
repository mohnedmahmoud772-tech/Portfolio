/**
 * MUHANNAD MAHMOUD — PORTFOLIO ENGINE (PRODUCTION SUITE)
 * Roles: Graphic Designer & UI/UX Designer | Creative Front-End Specialist
 * Standards: WCAG 2.2 AA Accessibility, GPU-Accelerated Fluid Physics, Mobile-First
 *
 * Core Modules:
 * 1. Cursor Spotlight Mesh & Purple Ambient Tracking
 * 2. Fluid Magnetic Custom Cursor (Fine pointer only)
 * 3. Accessible Project Filter Tablist (Branding & Social Media Campaigns)
 * 4. High-Fidelity Accessible Lightbox Modal (Focus Trap & Restoration)
 * 5. Direct Contact Form System (FormSubmit AJAX + Mailto Fallback, Zero Fake States)
 * 6. Accessible Clipboard Copy with Screen-Reader Feedback
 * 7. Real-Time Giza Cairo Live Clock
 * 8. 3D Card Tilt with Dynamic Glare System
 * 9. 3D Hero Portrait Parallax
 * 10. Resilient Mobile Navigation Drawer (ARIA Compliant)
 * 11. Replayable Scroll-Driven Reveal Animations (IntersectionObserver)
 */

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    /* ==========================================================================
       1. INTERACTIVE GRID SPOTLIGHT & PURPLE AMBIENT TRACKING
       ========================================================================== */
    function initSpotlightTracking() {
        const grid = document.getElementById('spotlightGrid');
        const purpleSpotlight = document.getElementById('purpleSpotlight');
        if (!grid && !purpleSpotlight) return;

        if (prefersReducedMotion) {
            const defaultX = '50vw';
            const defaultY = '30vh';
            if (grid) {
                grid.style.setProperty('--mouse-x', defaultX);
                grid.style.setProperty('--mouse-y', defaultY);
            }
            if (purpleSpotlight) {
                purpleSpotlight.style.setProperty('--mouse-x', defaultX);
                purpleSpotlight.style.setProperty('--mouse-y', defaultY);
            }
            return;
        }

        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2;
        let currentX = targetX;
        let currentY = targetY;
        let isMoving = false;

        window.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
            if (!isMoving) {
                isMoving = true;
                requestAnimationFrame(updateSpotlight);
            }
        }, { passive: true });

        function updateSpotlight() {
            currentX += (targetX - currentX) * 0.12;
            currentY += (targetY - currentY) * 0.12;

            const xStr = `${currentX.toFixed(1)}px`;
            const yStr = `${currentY.toFixed(1)}px`;

            if (grid) {
                grid.style.setProperty('--mouse-x', xStr);
                grid.style.setProperty('--mouse-y', yStr);
            }
            if (purpleSpotlight) {
                purpleSpotlight.style.setProperty('--mouse-x', xStr);
                purpleSpotlight.style.setProperty('--mouse-y', yStr);
            }

            if (Math.abs(targetX - currentX) > 0.4 || Math.abs(targetY - currentY) > 0.4) {
                requestAnimationFrame(updateSpotlight);
            } else {
                isMoving = false;
            }
        }
    }

    /* ==========================================================================
       2. FLUID CUSTOM MAGNETIC CURSOR
       ========================================================================== */
    function initCustomCursor() {
        const dot = document.getElementById('cursorDot');
        const outline = document.getElementById('cursorOutline');
        if (!dot || !outline) return;

        // Disable on touch devices or reduced motion
        if (isTouchDevice || prefersReducedMotion) {
            dot.style.display = 'none';
            outline.style.display = 'none';
            return;
        }

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let outlineX = mouseX;
        let outlineY = mouseY;
        let isCursorActive = false;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = `${mouseX}px`;
            dot.style.top = `${mouseY}px`;

            if (!isCursorActive) {
                isCursorActive = true;
                requestAnimationFrame(animateCursor);
            }
        }, { passive: true });

        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.16;
            outlineY += (mouseY - outlineY) * 0.16;

            outline.style.left = `${outlineX.toFixed(1)}px`;
            outline.style.top = `${outlineY.toFixed(1)}px`;

            if (Math.abs(mouseX - outlineX) > 0.2 || Math.abs(mouseY - outlineY) > 0.2) {
                requestAnimationFrame(animateCursor);
            } else {
                isCursorActive = false;
            }
        }

        // Magnetic expansion on interactive elements
        const interactives = document.querySelectorAll(
            'a, button, .project-card, .tool-card, .bento-box, .filter-tab, .form-control, .email-copy-bar'
        );

        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                outline.style.transform = 'translate(-50%, -50%) scale(1.65)';
                outline.style.borderColor = 'rgba(255, 77, 148, 0.9)';
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
       3. ACCESSIBLE PROJECT CATEGORY FILTER (WCAG 2.2 AA Tablist)
       ========================================================================== */
    function initProjectFilters() {
        const tabsWrapper = document.getElementById('filterTabs');
        if (!tabsWrapper) return;

        const tabs = Array.from(tabsWrapper.querySelectorAll('.filter-tab'));
        const cards = Array.from(document.querySelectorAll('.project-card'));

        function applyFilter(activeTab) {
            tabs.forEach(t => {
                const isActive = t === activeTab;
                t.classList.toggle('active', isActive);
                t.setAttribute('aria-selected', isActive ? 'true' : 'false');
                t.tabIndex = isActive ? 0 : -1;
            });

            const filter = activeTab.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                const shouldShow = filter === 'all' || category === filter;

                if (shouldShow) {
                    card.style.display = 'flex';
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                        card.removeAttribute('aria-hidden');
                        card.tabIndex = 0;
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(12px) scale(0.96)';
                    card.setAttribute('aria-hidden', 'true');
                    card.tabIndex = -1;
                    setTimeout(() => {
                        if (card.getAttribute('aria-hidden') === 'true') {
                            card.style.display = 'none';
                        }
                    }, 240);
                }
            });
        }

        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => applyFilter(tab));

            // Keyboard navigation (Arrow Left / Right, Home, End)
            tab.addEventListener('keydown', (e) => {
                let targetIndex = null;
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    targetIndex = (index + 1) % tabs.length;
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    targetIndex = (index - 1 + tabs.length) % tabs.length;
                } else if (e.key === 'Home') {
                    targetIndex = 0;
                } else if (e.key === 'End') {
                    targetIndex = tabs.length - 1;
                }

                if (targetIndex !== null) {
                    e.preventDefault();
                    tabs[targetIndex].focus();
                    applyFilter(tabs[targetIndex]);
                }
            });
        });
    }

    /* ==========================================================================
       4. ACCESSIBLE PROJECT LIGHTBOX MODAL (Focus Trap & Restoration)
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
        const modalLink = document.getElementById('modalCaseLink');

        if (!modal) return;

        let lastFocusedElement = null;

        function openModal(card) {
            lastFocusedElement = document.activeElement;

            const img = card.getAttribute('data-img');
            const title = card.getAttribute('data-title');
            const type = card.getAttribute('data-type');
            const client = card.getAttribute('data-client');
            const desc = card.getAttribute('data-desc');

            if (modalImg) {
                modalImg.src = img || '';
                modalImg.alt = title ? `${title} High-Resolution Showcase` : 'Project Showcase Image';
            }
            if (modalTitle) modalTitle.textContent = title || 'Project Showcase';
            if (modalType) modalType.textContent = type || 'Visual Identity';
            if (modalClient) modalClient.textContent = client || 'Confidential Client';
            if (modalDesc) modalDesc.textContent = desc || '';
            // Each project opens its own Behance case study
            const link = card.getAttribute('data-link');
            if (modalLink && link) modalLink.setAttribute('href', link);

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            setTimeout(() => {
                if (closeBtn) closeBtn.focus();
            }, 80);
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';

            if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                lastFocusedElement.focus();
            }
        }

        // Project cards click & keyboard triggers (Enter / Space)
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => openModal(card));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(card);
                }
            });
        });

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (backdrop) backdrop.addEventListener('click', closeModal);

        // Escape key & accessible focus trap
        window.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;

            if (e.key === 'Escape') {
                closeModal();
                return;
            }

            if (e.key === 'Tab') {
                const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const focusableArr = Array.from(focusables).filter(el => !el.disabled && el.offsetParent !== null);
                if (focusableArr.length === 0) return;

                const firstEl = focusableArr[0];
                const lastEl = focusableArr[focusableArr.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstEl) {
                        e.preventDefault();
                        lastEl.focus();
                    }
                } else {
                    if (document.activeElement === lastEl) {
                        e.preventDefault();
                        firstEl.focus();
                    }
                }
            }
        });
    }

    /* ==========================================================================
       5. DIRECT CONTACT FORM SYSTEM (Real Validation, AJAX & Mailto Fallback)
       ========================================================================== */
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const nameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('contactEmail');
        const subjectInput = document.getElementById('contactSubject');
        const messageInput = document.getElementById('contactMessage');
        const submitBtn = document.getElementById('contactSubmitBtn');
        const statusEl = document.getElementById('contactFormStatus');

        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const subjectError = document.getElementById('subjectError');
        const messageError = document.getElementById('messageError');

        function clearErrors() {
            [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
                if (input) input.classList.remove('is-invalid');
            });
            [nameError, emailError, subjectError, messageError].forEach(el => {
                if (el) el.textContent = '';
            });
            if (statusEl) {
                statusEl.className = 'form-status-msg';
                statusEl.textContent = '';
            }
        }

        // Live error clearing as user types
        [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
            if (!input) return;
            input.addEventListener('input', () => {
                input.classList.remove('is-invalid');
                const errorSpan = input.parentElement ? input.parentElement.querySelector('.form-error-hint') : null;
                if (errorSpan) errorSpan.textContent = '';
            });
        });

        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors();

            const name = (nameInput?.value || '').trim();
            const email = (emailInput?.value || '').trim();
            const subject = (subjectInput?.value || '').trim();
            const message = (messageInput?.value || '').trim();

            let hasError = false;
            let firstInvalidEl = null;

            if (!name || name.length < 2) {
                hasError = true;
                if (nameInput) nameInput.classList.add('is-invalid');
                if (nameError) nameError.textContent = 'Please enter your full name (at least 2 characters).';
                if (!firstInvalidEl) firstInvalidEl = nameInput;
            }

            if (!email || !validateEmail(email)) {
                hasError = true;
                if (emailInput) emailInput.classList.add('is-invalid');
                if (emailError) emailError.textContent = 'Please provide a valid email address.';
                if (!firstInvalidEl) firstInvalidEl = emailInput;
            }

            if (!subject || subject.length < 3) {
                hasError = true;
                if (subjectInput) subjectInput.classList.add('is-invalid');
                if (subjectError) subjectError.textContent = 'Please specify the project subject or inquiry.';
                if (!firstInvalidEl) firstInvalidEl = subjectInput;
            }

            if (!message || message.length < 10) {
                hasError = true;
                if (messageInput) messageInput.classList.add('is-invalid');
                if (messageError) messageError.textContent = 'Please provide a brief message description (at least 10 characters).';
                if (!firstInvalidEl) firstInvalidEl = messageInput;
            }

            if (hasError) {
                if (firstInvalidEl) firstInvalidEl.focus();
                return;
            }

            // Set loading state
            const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Sending message...</span> <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>';
            }
            if (statusEl) {
                statusEl.className = 'form-status-msg';
                statusEl.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Transmitting your message securely...';
            }

            const targetEmail = 'mohned.mahmoud772@gmail.com';

            try {
                // Real submission to FormSubmit AJAX endpoint
                const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        _subject: `Portfolio Inquiry: ${subject} (${name})`,
                        message: message,
                        _template: 'table'
                    })
                });

                if (response.ok) {
                    if (statusEl) {
                        statusEl.className = 'form-status-msg success';
                        statusEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message sent successfully! Muhannad will get back to you promptly.';
                    }
                    form.reset();
                } else {
                    throw new Error('Service responded with non-200 status');
                }
            } catch (err) {
                // If network is offline, CORS-restricted, or blocked: fallback to prefilled mailto
                // NON-DECEPTIVE: Explicitly tell user their email client was triggered
                if (statusEl) {
                    statusEl.className = 'form-status-msg';
                    statusEl.innerHTML = '<i class="fa-solid fa-envelope-open-text"></i> Network transmission restricted. Launching your email client...';
                }

                const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
                    `From: ${name} (${email})\n\nMessage:\n${message}`
                )}`;

                setTimeout(() => {
                    window.location.href = mailtoUrl;
                }, 400);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                }
            }
        });
    }

    /* ==========================================================================
       6. ACCESSIBLE CLIPBOARD COPY WITH FEEDBACK
       ========================================================================== */
    function initClipboardCopy() {
        const copyBar = document.getElementById('emailCopyBar');
        const copyBtn = document.getElementById('copyBtn');
        const toast = document.getElementById('toastNotice');
        const toastMsg = document.getElementById('toastMsg');
        let toastTimeout = null;

        function triggerCopy(textToCopy) {
            function showToast(msg) {
                if (toastMsg) toastMsg.textContent = msg;
                if (toast) {
                    toast.classList.add('show');
                    clearTimeout(toastTimeout);
                    toastTimeout = setTimeout(() => {
                        toast.classList.remove('show');
                    }, 3200);
                }
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => showToast(`Copied to clipboard: ${textToCopy}`))
                    .catch(() => fallbackCopy(textToCopy));
            } else {
                fallbackCopy(textToCopy);
            }

            function fallbackCopy(text) {
                try {
                    const tempInput = document.createElement('input');
                    tempInput.value = text;
                    tempInput.setAttribute('readonly', '');
                    tempInput.style.position = 'absolute';
                    tempInput.style.left = '-9999px';
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                    showToast(`Copied to clipboard: ${text}`);
                } catch (e) {
                    showToast(`Email: ${text}`);
                }
            }
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
       7. REAL-TIME LOCAL CLOCK (Giza, Egypt)
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
       8. 3D CARD TILT WITH DYNAMIC GLARE SYSTEM
       ========================================================================== */
    function initCardTilt() {
        if (prefersReducedMotion || isTouchDevice) return;

        const tiltCards = document.querySelectorAll('.project-card, .bento-box, .tool-card');

        tiltCards.forEach(card => {
            // Create dynamic glare element if not already present
            let glare = card.querySelector('.card-glare');
            if (!glare) {
                glare = document.createElement('div');
                glare.className = 'card-glare';
                glare.setAttribute('aria-hidden', 'true');
                card.appendChild(glare);
            }

            let ticking = false;

            // Tilt must answer instantly: drop any leftover reveal stagger delay
            card.addEventListener('mouseenter', () => {
                card.style.transitionDelay = '';
            });

            card.addEventListener('mousemove', (e) => {
                if (ticking) return;
                ticking = true;

                requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    // Subtle tilt angles (max ~6 to 7 degrees for elegance)
                    const rotX = ((y - centerY) / centerY) * -6;
                    const rotY = ((x - centerX) / centerX) * 6;

                    card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;

                    // Glare spotlight position
                    const glareX = ((x / rect.width) * 100).toFixed(1);
                    const glareY = ((y / rect.height) * 100).toFixed(1);

                    glare.style.setProperty('--glare-x', `${glareX}%`);
                    glare.style.setProperty('--glare-y', `${glareY}%`);
                    glare.style.opacity = '1';

                    ticking = false;
                });
            }, { passive: true });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                if (glare) glare.style.opacity = '0';
            });
        });
    }

    /* ==========================================================================
       9. 3D PORTRAIT MOUSE PARALLAX (Performance Guarded)
       ========================================================================== */
    function initPortraitParallax() {
        if (prefersReducedMotion || isTouchDevice) return;

        const stage = document.querySelector('.portrait-stage');
        const card = document.querySelector('.portrait-card');
        const chips = document.querySelectorAll('.floating-chip');

        if (!stage || !card) return;

        let ticking = false;

        stage.addEventListener('mousemove', (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const rect = stage.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;

                    const rotateX = (y / (rect.height / 2)) * -8;
                    const rotateY = (x / (rect.width / 2)) * 8;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

                    chips.forEach((chip, idx) => {
                        const factor = (idx + 1) * 8;
                        chip.style.transform = `translate(${(x / factor).toFixed(1)}px, ${(y / factor).toFixed(1)}px)`;
                    });

                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        stage.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            chips.forEach(chip => {
                chip.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    /* ==========================================================================
       10. RESILIENT MOBILE NAVIGATION DRAWER (Class-based, No Inline Styles)
       ========================================================================== */
    function initMobileNav() {
        const toggle = document.getElementById('mobileToggle');
        const header = document.querySelector('.site-header');
        const navContainer = document.querySelector('.nav-container');
        const menu = document.getElementById('navMenu');
        if (!toggle || !menu || !navContainer) return;

        function toggleMenu() {
            const isCurrentlyOpen = navContainer.classList.contains('nav-open');
            const willOpen = !isCurrentlyOpen;

            navContainer.classList.toggle('nav-open', willOpen);
            toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
            toggle.setAttribute('aria-label', willOpen ? 'Close Navigation Menu' : 'Open Navigation Menu');
        }

        function closeMenu() {
            if (navContainer.classList.contains('nav-open')) {
                navContainer.classList.remove('nav-open');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-label', 'Open Navigation Menu');
            }
        }

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close on nav link click
        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => closeMenu());
        });

        // Close when clicking outside header
        document.addEventListener('click', (e) => {
            if (header && !header.contains(e.target)) {
                closeMenu();
            }
        });

        // Close on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });

        // Close on resize across mobile breakpoint
        window.addEventListener('resize', () => {
            if (window.innerWidth > 960) {
                closeMenu();
            }
        }, { passive: true });
    }

    /* ==========================================================================
       11. REPLAYABLE SCROLL-DRIVEN REVEAL ANIMATIONS (IntersectionObserver)
       ========================================================================== */
    function initScrollReveal() {
        const targets = document.querySelectorAll(
            '.hero-headline, .hero-description, .hero-actions-group, .hero-metrics-strip, ' +
            '.portrait-stage, .services-marquee-section, .section-header-row, .project-card, ' +
            '.works-cta-banner, .bento-box, .timeline-row, .tool-card, .competencies-block, ' +
            '.contact-form-glass, .contact-card-glass'
        );

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            targets.forEach(el => el.classList.add('is-revealed'));
            return;
        }

        targets.forEach(el => {
            if (!el.classList.contains('reveal-on-scroll')) {
                el.classList.add('reveal-on-scroll');
            }
        });

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.1
        };

        // Replayable observer: adds is-revealed when entering, removes when completely out
        // allowing smooth, enjoyable replay when scrolling back up and down
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const el = entry.target;
                if (entry.isIntersecting) {
                    if (el.dataset.revealDelay) {
                        el.style.transitionDelay = el.dataset.revealDelay;
                        clearTimeout(el._revealDelayTimer);
                        // Clear the stagger once the reveal is done so hover/tilt has zero delay
                        el._revealDelayTimer = setTimeout(() => {
                            el.style.transitionDelay = '';
                        }, 600);
                    }
                    el.classList.add('is-revealed');
                } else {
                    // Only un-reveal if scrolled past or out of view to enable replay
                    el.style.transitionDelay = '';
                    el.classList.remove('is-revealed');
                }
            });
        }, observerOptions);

        targets.forEach((el) => {
            // Apply slight staggered delay for grid children
            const parent = el.parentElement;
            if (parent && (parent.classList.contains('projects-grid') || parent.classList.contains('skills-grid'))) {
                const childIndex = Array.from(parent.children).indexOf(el);
                el.dataset.revealDelay = `${(childIndex % 3) * 0.08}s`;
            }
            observer.observe(el);
        });
    }

    /* ==========================================================================
       12. BOOTSTRAP INITIALIZATION
       ========================================================================== */
    window.addEventListener('DOMContentLoaded', () => {
        initSpotlightTracking();
        initCustomCursor();
        initProjectFilters();
        initProjectModal();
        initContactForm();
        initClipboardCopy();
        initGizaClock();
        initCardTilt();
        initPortraitParallax();
        initMobileNav();
        initScrollReveal();
    });

})();
