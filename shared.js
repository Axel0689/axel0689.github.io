/* shared.js — Configurazioni e helper condivisi tra index.html ed editor.html
   Esposto su window.LP (plain script, compatibile con file://) */

window.LP = window.LP || {};

// ===== HTML ESCAPE =====
LP.esc = function(s) {
    return String(s ?? '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
};

// ===== URL HELPER =====
LP.isExternal = function(url) {
    return typeof url === 'string' && url.startsWith('http');
};

// ===== BACKGROUND PRESETS =====
// Formato canonico: { id, label, body, swatchFrom, swatchTo, g1, g2, g3 }
// swatchFrom/swatchTo sono usati solo dall'editor per l'anteprima swatch.
LP.BG_PRESETS = [
    {
        id: 'dark-purple',
        label: 'Dark Purple',
        body: 'linear-gradient(135deg,#0a0a0f 0%,#11112a 40%,#18183e 70%,#0e1628 100%)',
        swatchFrom: '#11112a', swatchTo: '#18183e',
        g1: 'rgba(108,99,255,0.08)', g2: 'rgba(78,205,196,0.06)', g3: 'rgba(247,151,30,0.05)'
    },
    {
        id: 'midnight-blue',
        label: 'Midnight Blue',
        body: 'linear-gradient(135deg,#080818 0%,#0d1530 40%,#102040 70%,#08122a 100%)',
        swatchFrom: '#0d1530', swatchTo: '#102040',
        g1: 'rgba(69,183,209,0.09)', g2: 'rgba(108,99,255,0.06)', g3: 'rgba(78,205,196,0.05)'
    },
    {
        id: 'dark-teal',
        label: 'Dark Teal',
        body: 'linear-gradient(135deg,#060f0f 0%,#0a2020 40%,#0f2a28 70%,#081a18 100%)',
        swatchFrom: '#0a2020', swatchTo: '#0f2a28',
        g1: 'rgba(78,205,196,0.10)', g2: 'rgba(46,204,113,0.06)', g3: 'rgba(108,99,255,0.04)'
    },
    {
        id: 'dark-rose',
        label: 'Dark Rose',
        body: 'linear-gradient(135deg,#0f080f 0%,#201018 40%,#2a0f1e 70%,#18080f 100%)',
        swatchFrom: '#201018', swatchTo: '#2a0f1e',
        g1: 'rgba(255,107,157,0.08)', g2: 'rgba(231,76,60,0.06)', g3: 'rgba(247,151,30,0.05)'
    },
    {
        id: 'pure-black',
        label: 'Pure Black',
        body: 'linear-gradient(135deg,#080808 0%,#101010 40%,#181818 70%,#0c0c0c 100%)',
        swatchFrom: '#101010', swatchTo: '#181818',
        g1: 'rgba(108,99,255,0.05)', g2: 'rgba(78,205,196,0.04)', g3: 'rgba(255,255,255,0.02)'
    }
];

// Restituisce il preset per id, oppure il primo come default
LP.getPreset = function(id) {
    return LP.BG_PRESETS.find(function(p) { return p.id === id; }) || LP.BG_PRESETS[0];
};

// Applica il gradiente di sfondo alla pagina (usato da index.html)
LP.applyBackground = function(data) {
    var key    = (data.background && data.background.preset) || 'dark-purple';
    var preset = LP.getPreset(key);
    var styleEl = document.getElementById('bg-dynamic');
    if (styleEl) {
        styleEl.textContent =
            'body{background:' + preset.body + ';background-attachment:fixed;}' +
            'body::before{background:' +
            'radial-gradient(ellipse 600px 500px at 15% 25%,' + preset.g1 + ' 0%,transparent 100%),' +
            'radial-gradient(ellipse 500px 400px at 85% 65%,' + preset.g2 + ' 0%,transparent 100%),' +
            'radial-gradient(ellipse 400px 350px at 55% 10%,' + preset.g3 + ' 0%,transparent 100%);}';
    }
};

// ===== ACCENT COLORS =====
LP.ACCENT_COLORS = {
    purple: '#6c63ff', teal: '#4ecdc4', blue: '#45b7d1',
    amber: '#f7971e', pink: '#ff6b9d', green: '#2ecc71', red: '#e74c3c'
};

// ===== DATA MODEL NORMALIZATION =====
// Garantisce che ogni link abbia tutti i campi opzionali (icon, logo, brand)
LP.normalizeLink = function(link) {
    return {
        label:         link.label         || '',
        labelEn:       link.labelEn       || '',
        title:         link.title         || '',
        titleEn:       link.titleEn       || '',
        description:   link.description   || '',
        descriptionEn: link.descriptionEn || '',
        url:           link.url           || '',
        icon:          link.icon          || '',
        logo:          link.logo          || '',
        logoPosition:  link.logoPosition  || '',
        logoSize:      link.logoSize      || '',
        brand:         link.brand         || ''
    };
};

LP.normalizeSiteData = function(data) {
    if (data && data.sections) {
        data.sections.forEach(function(sec) {
            sec.links = (sec.links || []).map(LP.normalizeLink);
        });
    }
    if (data && data.profile) {
        var ps = data.profile.photoStyle || {};
        data.profile.photoStyle = {
            size:     ps.size     || 'medium',
            shape:    ps.shape    || 'circle',
            ring:     ps.ring     || 'animated',
            position: ps.position || 'top'
        };
    }
    return data;
};
