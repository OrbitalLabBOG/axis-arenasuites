// Páginas legales: menú móvil, sombra del header y resaltado del índice
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    const tocLinks = Array.from(document.querySelectorAll('.legal-toc a[href^="#"]'));
    if (!tocLinks.length || !('IntersectionObserver' in window)) return;

    const byId = new Map(tocLinks.map(a => [a.getAttribute('href').slice(1), a]));
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            tocLinks.forEach(a => a.classList.remove('is-active'));
            const link = byId.get(entry.target.id);
            if (link) link.classList.add('is-active');
        });
    }, { rootMargin: '-120px 0px -65% 0px' });

    byId.forEach((_, id) => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
    });
});
