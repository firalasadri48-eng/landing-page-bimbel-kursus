/* shared/components/navbar.js — bilah navigasi atas.
   Dipakai: navbarHTML({ brand, links, cta }) lalu initMobileNav(). */
import { esc } from "../utils.js";

export function navbarHTML({ brand, links = [], cta = null }) {
  const items = links
    .map(
      (l) =>
        `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`
    )
    .join("");
  const ctaHtml = cta
    ? `<a class="btn btn-primary nav-cta" href="${esc(cta.href)}">${esc(cta.label)}</a>`
    : "";
  return `
  <a class="skip-link" href="#konten">Lewati ke konten</a>
  <header class="site-header">
    <nav class="wrap nav" aria-label="Navigasi utama">
      <a class="brand" href="#beranda" aria-label="${esc(brand.name)} — beranda">
        <span class="brand-mark" aria-hidden="true">${esc(brand.mark || brand.name.charAt(0))}</span>
        <span class="brand-name">${esc(brand.name)}</span>
      </a>
      <button id="nav-toggle" class="nav-toggle" aria-label="Buka menu navigasi" aria-controls="nav-menu">
        <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>
      </button>
      <div id="nav-menu" class="nav-menu">
        <ul class="nav-links">${items}</ul>
        ${ctaHtml}
      </div>
    </nav>
  </header>`;
}
