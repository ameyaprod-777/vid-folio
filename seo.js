/* Référencement : <head> de chaque page, pages par projet et sitemap.
   Les projets sont lus directement dans index.html (DIRECTORS et WORKS) :
   ajouter un projet là-bas crée automatiquement sa page et son entrée
   dans le sitemap. */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const SITE = "https://ameya.tv";
const ROOT = __dirname;
const INDEX = path.join(ROOT, "index.html");

const TYPE_LABEL = {
  en: { clip: "Music Video", pub: "Commercial", show: "Show", contenu: "Broadcast" },
  fr: { clip: "Clip", pub: "Publicité", show: "Émission", contenu: "Contenu" }
};

const ORGANIZATION = {
  "@type": "Organization",
  "@id": SITE + "/#organization",
  name: "AMEYA",
  alternateName: ["AMEYA CORP", "AMEYA PROD", "Ameya Films"],
  url: SITE + "/",
  logo: SITE + "/assets/logo.png",
  image: SITE + "/public/og-ameya.jpg",
  email: "contact@ameya.tv",
  address: { "@type": "PostalAddress", addressLocality: "Paris", addressRegion: "Île-de-France", addressCountry: "FR" },
  sameAs: ["https://www.instagram.com/ameya.films/", "https://www.tiktok.com/@ameyaprod"]
};

const HOME = {
  en: {
    title: "AMEYA — Video Production Company in Paris | Music Videos, Commercials",
    description: "AMEYA is a Paris-based video production company. Music videos, commercials and shows: direction, filming, camera operating, editing and post-production for artists, labels and brands.",
    ogTitle: "AMEYA — Video Production Company in Paris",
    ogDescription: "Music videos, commercials and shows. Direction, filming, editing and post-production for artists, labels and brands.",
    h1: "AMEYA — Video production company in Paris: music videos, commercials, shows",
    orgDescription: "Paris-based video production company: music videos, commercials and shows. Direction, filming, camera operating, editing and post-production.",
    areaServed: ["Paris", "France", "Worldwide"],
    knowsAbout: ["Music video production", "Commercial production", "Film direction", "Camera operating", "Video editing", "Post-production", "Color grading"]
  },
  fr: {
    title: "AMEYA — Société de production audiovisuelle à Paris | Clips, Pub, Tournage",
    description: "AMEYA, boîte de production audiovisuelle à Paris. Clips, publicités et émissions : réalisation, tournage, cadrage caméra, montage et post-production pour artistes, labels et marques.",
    ogTitle: "AMEYA — Société de production audiovisuelle à Paris",
    ogDescription: "Clips, publicités et émissions. Réalisation, tournage, montage et post-production pour artistes, labels et marques.",
    h1: "AMEYA — Société de production audiovisuelle à Paris : clips, publicités, émissions",
    orgDescription: "Société de production audiovisuelle basée à Paris : clips, publicités et émissions. Réalisation, tournage, cadrage caméra, montage et post-production.",
    areaServed: ["Paris", "France", "Monde entier"],
    knowsAbout: ["Production de clips", "Production de publicités", "Réalisation", "Tournage", "Cadrage caméra", "Montage vidéo", "Post-production", "Étalonnage"]
  }
};

/* ---------- Projets, lus dans index.html ---------- */

// Même règle que slugify() dans index.html : les deux doivent rester identiques.
function slugify(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function workSlugs(works) {
  const seen = new Set();
  return works.map((work) => {
    const base = slugify([work.client, work.title].filter(Boolean).join(" ")) || "projet";
    let slug = base;
    let n = 2;
    while (seen.has(slug)) slug = base + "-" + n++;
    seen.add(slug);
    return slug;
  });
}

let cache = { mtime: 0, works: [], directors: [], slugs: [], updated: "" };

function loadWorks() {
  let stat;
  try {
    stat = fs.statSync(INDEX);
  } catch {
    return cache;
  }
  if (stat.mtimeMs === cache.mtime) return cache;
  try {
    const html = fs.readFileSync(INDEX, "utf8");
    const start = html.indexOf("const DIRECTORS");
    const end = html.indexOf("// Indices des projets", start);
    if (start < 0 || end < 0) throw new Error("data block not found");
    const data = vm.runInNewContext(html.slice(start, end) + "\n;({ DIRECTORS, WORKS })", {}, { timeout: 500 });
    cache = {
      mtime: stat.mtimeMs,
      works: data.WORKS,
      directors: data.DIRECTORS,
      slugs: workSlugs(data.WORKS),
      updated: stat.mtime.toISOString().slice(0, 10)
    };
  } catch (error) {
    console.error("SEO: impossible de lire les projets dans index.html", error.message);
    cache.mtime = stat.mtimeMs;
  }
  return cache;
}

function findWork(slug) {
  const data = loadWorks();
  const index = data.slugs.indexOf(slug);
  return index < 0 ? null : { work: data.works[index], index, slug };
}

/* ---------- Vignettes Vimeo (pour Google Vidéos et les aperçus de partage) ---------- */

const videoInfo = new Map();

function vimeoUrl(work) {
  const url = work.vimeo || work.vimeoMobile || "";
  const match = String(url).match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([A-Za-z0-9]+))?/);
  return match ? { id: match[1], hash: match[2] || "", page: "https://vimeo.com/" + match[1] + (match[2] ? "/" + match[2] : "") } : null;
}

async function fetchVideoInfo(work) {
  const vimeo = vimeoUrl(work);
  if (!vimeo) return;
  const known = videoInfo.get(vimeo.id);
  if (known && Date.now() - known.at < 12 * 3600 * 1000) return;
  try {
    const response = await fetch(
      "https://vimeo.com/api/oembed.json?width=1280&url=" + encodeURIComponent(vimeo.page),
      { signal: AbortSignal.timeout(5000) }
    );
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();
    videoInfo.set(vimeo.id, {
      at: Date.now(),
      thumbnail: data.thumbnail_url,
      width: data.thumbnail_width,
      height: data.thumbnail_height,
      uploadDate: data.upload_date ? String(data.upload_date).replace(" ", "T") + "+00:00" : "",
      duration: Number(data.duration) || 0,
      embed: "https://player.vimeo.com/video/" + vimeo.id + (vimeo.hash ? "?h=" + vimeo.hash : "")
    });
  } catch {
    if (!known) videoInfo.set(vimeo.id, { at: Date.now() - 11 * 3600 * 1000 });
  }
}

// Récupère les vignettes en arrière-plan, sans jamais ralentir une page.
async function refreshVideoInfo() {
  for (const work of loadWorks().works) {
    await fetchVideoInfo(work);
  }
}

function infoFor(work) {
  const vimeo = vimeoUrl(work);
  const info = vimeo ? videoInfo.get(vimeo.id) : null;
  return info && info.thumbnail ? info : null;
}

/* ---------- Génération du <head> ---------- */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonLd(data) {
  return '  <script type="application/ld+json">\n' +
    JSON.stringify(data, null, 2).replace(/</g, "\\u003c").replace(/^/gm, "  ") +
    "\n  </script>\n";
}

function isoDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return "PT" + (h ? h + "H" : "") + (m ? m + "M" : "") + s + "S";
}

function pageUrl(lang, slug) {
  return SITE + (lang === "fr" ? "/fr/" : "/") + (slug ? "work/" + slug : "");
}

function workTexts(lang, work) {
  const type = TYPE_LABEL[lang][work.type] || TYPE_LABEL[lang].clip;
  const name = work.title ? work.client + " — " + work.title : work.client;
  const credit = [work.creditName, work.madeFor].filter(Boolean).join(" · ");
  const quoted = work.title ? (lang === "fr" ? "« " + work.title + " »" : "“" + work.title + "”") : "";
  const intro = [work.client, quoted].filter(Boolean).join(" — ") + " (" + [type, work.year].filter(Boolean).join(", ") + ").";
  const description = lang === "fr"
    ? intro + (credit ? " Crédit : " + credit + "." : "") + " Au portfolio d'AMEYA, société de production audiovisuelle à Paris."
    : intro + (credit ? " Credit: " + credit + "." : "") + " Featured in the AMEYA portfolio, a Paris video production company.";
  return {
    name,
    title: name + " | " + [type, work.year].filter(Boolean).join(" ") + " | AMEYA",
    description,
    h1: name + " — " + type + (work.year ? " " + work.year : "")
  };
}

function headFor(lang, found) {
  const home = HOME[lang];
  const slug = found ? found.slug : "";
  const url = pageUrl(lang, slug);
  const texts = found ? workTexts(lang, found.work) : null;
  const info = found ? infoFor(found.work) : null;
  const title = texts ? texts.title : home.title;
  const description = texts ? texts.description : home.description;

  let head = "";
  head += "  <title>" + escapeHtml(title) + "</title>\n";
  head += '  <meta name="description" content="' + escapeHtml(description) + '">\n';
  head += '  <link rel="canonical" href="' + url + '">\n';
  head += '  <link rel="alternate" hreflang="en" href="' + pageUrl("en", slug) + '">\n';
  head += '  <link rel="alternate" hreflang="fr" href="' + pageUrl("fr", slug) + '">\n';
  head += '  <link rel="alternate" hreflang="x-default" href="' + pageUrl("en", slug) + '">\n';
  head += '  <meta property="og:locale" content="' + (lang === "fr" ? "fr_FR" : "en_US") + '">\n';
  head += '  <meta property="og:locale:alternate" content="' + (lang === "fr" ? "en_US" : "fr_FR") + '">\n';
  head += '  <meta property="og:type" content="' + (found ? "video.other" : "website") + '">\n';
  head += '  <meta property="og:title" content="' + escapeHtml(texts ? texts.name + " | AMEYA" : home.ogTitle) + '">\n';
  head += '  <meta property="og:description" content="' + escapeHtml(texts ? description : home.ogDescription) + '">\n';
  head += '  <meta property="og:url" content="' + url + '">\n';
  if (info) {
    head += '  <meta property="og:image" content="' + escapeHtml(info.thumbnail) + '">\n';
    if (info.width) head += '  <meta property="og:image:width" content="' + info.width + '">\n';
    if (info.height) head += '  <meta property="og:image:height" content="' + info.height + '">\n';
  } else {
    head += '  <meta property="og:image" content="' + SITE + '/public/og-ameya.jpg">\n';
    head += '  <meta property="og:image:width" content="1200">\n';
    head += '  <meta property="og:image:height" content="630">\n';
  }

  const graph = [Object.assign({}, ORGANIZATION, {
    description: home.orgDescription,
    areaServed: home.areaServed,
    knowsAbout: home.knowsAbout
  })];

  if (!found) {
    graph.push({
      "@type": "WebSite",
      "@id": pageUrl(lang) + "#website",
      name: "AMEYA",
      alternateName: "AMEYA CORP",
      url: pageUrl(lang),
      inLanguage: lang,
      publisher: { "@id": ORGANIZATION["@id"] }
    });
  } else {
    graph.push({
      "@type": "WebPage",
      "@id": url + "#webpage",
      url,
      name: title,
      description,
      inLanguage: lang,
      isPartOf: { "@id": pageUrl(lang) + "#website" },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "AMEYA", item: pageUrl(lang) },
          { "@type": "ListItem", position: 2, name: texts.name, item: url }
        ]
      }
    });
    if (info) {
      const video = {
        "@type": "VideoObject",
        "@id": url + "#video",
        name: texts.name,
        description,
        thumbnailUrl: [info.thumbnail],
        embedUrl: info.embed,
        inLanguage: lang,
        contributor: { "@id": ORGANIZATION["@id"] }
      };
      if (info.uploadDate) video.uploadDate = info.uploadDate;
      if (info.duration) video.duration = isoDuration(info.duration);
      graph.push(video);
    }
  }

  head += jsonLd({ "@context": "https://schema.org", "@graph": graph });
  return {
    head,
    h1: '<h1 class="sr-only">' + escapeHtml(texts ? texts.h1 : home.h1) + "</h1>" +
      (texts ? '<p class="sr-only">' + escapeHtml(description) + "</p>" : "")
  };
}

// Applique le <head> de la page (langue, projet) au modèle index.html.
function renderPage(html, lang, found) {
  const page = headFor(lang, found);
  return html
    .replace(/<html lang="[a-z]+">/, '<html lang="' + lang + '">')
    .replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, () => "<!--seo-->\n" + page.head + "  <!--/seo-->")
    .replace(/<!--h1-->[\s\S]*?<!--\/h1-->/, () => "<!--h1-->" + page.h1 + "<!--/h1-->");
}

/* ---------- Sitemap ---------- */

function sitemap() {
  const data = loadWorks();
  const entry = (slug) => ["en", "fr"].map((lang) =>
    "  <url>\n" +
    "    <loc>" + pageUrl(lang, slug) + "</loc>\n" +
    "    <lastmod>" + data.updated + "</lastmod>\n" +
    '    <xhtml:link rel="alternate" hreflang="en" href="' + pageUrl("en", slug) + '"/>\n' +
    '    <xhtml:link rel="alternate" hreflang="fr" href="' + pageUrl("fr", slug) + '"/>\n' +
    '    <xhtml:link rel="alternate" hreflang="x-default" href="' + pageUrl("en", slug) + '"/>\n' +
    "  </url>\n"
  ).join("");
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    entry("") +
    data.slugs.map(entry).join("") +
    "</urlset>\n";
}

module.exports = { loadWorks, findWork, renderPage, sitemap, refreshVideoInfo };
