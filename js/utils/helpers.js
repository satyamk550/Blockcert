// js/utils/: Shared browser helpers for routing, layout wiring, and DOM effects.

export const APP_ROUTE_MAP = {
    '/institution': 'institution.html',
    '/institution/login': 'institution-login.html',
    '/institution/register': 'institution-register.html',
    '/institution/dashboard': 'institution-dashboard.html',
    '/institution/students': 'institution-students.html',
    '/institution/issue': 'institution-issue.html',
    '/institution/issue/result': 'institution-issue-result.html',
    '/institution/records': 'institution-records.html',
    '/institution/bulk': 'institution-dashboard.html?action=bulk',
    '/institution/history': 'institution-records.html',
    '/institution/users': 'institution-users.html',
    '/institution/settings': 'institution-dashboard.html?action=settings',
    '/student/login': 'student-login.html',
    '/student/dashboard': 'student-dashboard.html',
    '/verifier': 'verification.html',
    '/verification': 'verification.html'
};

const INSTITUTION_WORKSPACE_PAGES = new Set([
    'institution.html',
    'institution-dashboard.html',
    'institution-students.html',
    'institution-issue.html',
    'institution-issue-result.html',
    'institution-records.html',
    'institution-users.html'
]);

const DEDICATED_APPLICATION_PAGES = new Set([
    'institution.html',
    'institution-dashboard.html',
    'institution-login.html',
    'institution-register.html',
    'institution-students.html',
    'institution-issue.html',
    'institution-issue-result.html',
    'institution-records.html',
    'institution-users.html',
    'student-login.html',
    'student-dashboard.html',
    'verification.html'
]);

export function showSection(sectionName) {
    const sections = {
        home: document.getElementById('home-view'),
        student: document.getElementById('student-wallet'),
        verifier: document.getElementById('verification')
    };

    const targetSection = Object.prototype.hasOwnProperty.call(sections, sectionName) ? sectionName : 'home';

    Object.entries(sections).forEach(([key, section]) => {
        if (section) {
            section.classList.toggle('hidden', key !== targetSection);
        }
    });
}

export function normalizePath(pathname) {
    if (!pathname) return '/';
    if (pathname.length > 1 && pathname.endsWith('/')) {
        return pathname.slice(0, -1);
    }
    return pathname;
}

export function navigateToMappedRoute(pathname) {
    const normalized = normalizePath(pathname);
    const target = APP_ROUTE_MAP[normalized];

    if (!target) {
        return false;
    }

    if (window.location.pathname.endsWith(target)) {
        return true;
    }

    window.location.href = target;
    return true;
}

export function wireRouteLinks() {
    if (document.body.dataset.routeLinksBound === 'true') {
        return;
    }

    document.addEventListener('click', (event) => {
        const link = event.target.closest('[data-route]');
        if (!link) return;

        const targetPath = link.getAttribute('href');
        if (!targetPath) return;

        if (navigateToMappedRoute(targetPath)) {
            event.preventDefault();
        }
    });

    document.body.dataset.routeLinksBound = 'true';
}

export function getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
}

export function isDedicatedApplicationPage(currentPage = getCurrentPage()) {
    return DEDICATED_APPLICATION_PAGES.has(currentPage);
}

export function isInstitutionWorkspacePage(currentPage = getCurrentPage()) {
    return INSTITUTION_WORKSPACE_PAGES.has(currentPage);
}

export function setupInstitutionNavbarActions(currentPage = getCurrentPage()) {
    if (!isInstitutionWorkspacePage(currentPage)) {
        return;
    }

    const connectWalletBtn = document.getElementById('connectWalletBtn');
    if (!connectWalletBtn) {
        return;
    }

    let navActions = connectWalletBtn.parentElement;
    if (!navActions || !navActions.classList.contains('nav-actions')) {
        navActions = document.createElement('div');
        navActions.className = 'nav-actions';
        connectWalletBtn.parentNode.insertBefore(navActions, connectWalletBtn);
        navActions.appendChild(connectWalletBtn);
    }

    let logoutButton = document.getElementById('institutionLogoutBtn');
    if (!logoutButton) {
        logoutButton = document.createElement('button');
        logoutButton.id = 'institutionLogoutBtn';
        logoutButton.type = 'button';
        logoutButton.className = 'btn btn-outline nav-logout-btn';
        logoutButton.textContent = 'Log Out';
        navActions.appendChild(logoutButton);
    }

    logoutButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

export function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar || document.body.dataset.navbarScrollBound === 'true') {
        return;
    }

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    document.body.dataset.navbarScrollBound = 'true';
}

export function enableSmoothScrollForAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function handleAnchorClick(event) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                event.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

export function setupRevealAnimations() {
    const sections = document.querySelectorAll('.reveal-section:not([data-reveal-bound="true"])');
    if (!sections.length) {
        return;
    }

    if (!('IntersectionObserver' in window)) {
        sections.forEach((section) => {
            section.classList.add('visible');
            section.dataset.revealBound = 'true';
        });
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    sections.forEach((section) => {
        section.dataset.revealBound = 'true';
        section.classList.add('reveal-ready');
        observer.observe(section);
    });
}
