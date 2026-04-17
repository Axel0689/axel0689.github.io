/* iconResolver.js — Gestione unificata delle icone per index.html
   Dipende da shared.js (LP.esc deve essere già caricato)
   Esposto su window.LP */

window.LP = window.LP || {};

// Mapping dominio root → icona FontAwesome
LP._DOMAIN_ICONS = {
    'github.com':    'fa-brands fa-github',
    'youtube.com':   'fa-brands fa-youtube',
    'twitter.com':   'fa-brands fa-twitter',
    'x.com':         'fa-brands fa-x-twitter',
    'linkedin.com':  'fa-brands fa-linkedin',
    'instagram.com': 'fa-brands fa-instagram',
    'tiktok.com':    'fa-brands fa-tiktok',
    'facebook.com':  'fa-brands fa-facebook',
    'discord.gg':    'fa-brands fa-discord',
    'twitch.tv':     'fa-brands fa-twitch'
};

// Estrae il dominio root da un URL (es. "github.com" da "https://www.github.com/...")
LP._extractDomain = function(url) {
    try {
        var hostname = new URL(url).hostname.replace(/^www\./, '');
        var parts = hostname.split('.');
        return parts.length >= 2 ? parts.slice(-2).join('.') : hostname;
    } catch(e) { return ''; }
};

// Risolve l'icona per un oggetto link.
// Priorità: logo (immagine) → icon (FA esplicita) → domain mapping → default FA
// Ritorna { type: 'logo'|'fa', value: string, fallbackFa: string }
LP.resolveIcon = function(link) {
    var defaultFa = 'fa-solid fa-link';

    if (link.logo && link.logo.trim()) {
        return { type: 'logo', value: link.logo.trim(), fallbackFa: link.icon || defaultFa };
    }

    if (link.icon && link.icon.trim()) {
        return { type: 'fa', value: link.icon.trim(), fallbackFa: defaultFa };
    }

    var domain = LP._extractDomain(link.url || '');
    if (domain && LP._DOMAIN_ICONS[domain]) {
        return { type: 'fa', value: LP._DOMAIN_ICONS[domain], fallbackFa: defaultFa };
    }

    return { type: 'fa', value: defaultFa, fallbackFa: defaultFa };
};

// Contatore globale per ID univoci nelle icone con fallback
LP._iconUid = 0;

// Genera l'HTML dell'icona per un link (sostituisce renderLinkIcon in index.html)
// - tipo 'logo': mostra img con <i> come fallback visivo
// - tipo 'fa': mostra solo <i>
LP.renderIconHtml = function(link) {
    var resolved = LP.resolveIcon(link);

    if (resolved.type === 'logo') {
        var uid = ++LP._iconUid;
        return '<i class="' + LP.esc(resolved.fallbackFa) + '" id="bi-' + uid + '"></i>' +
               '<img src="' + LP.esc(resolved.value) + '" class="brand-logo" alt="" ' +
               'onload="document.getElementById(\'bi-' + uid + '\').style.display=\'none\'" ' +
               'onerror="this.style.display=\'none\'">';
    }

    return '<i class="' + LP.esc(resolved.value) + '"></i>';
};
