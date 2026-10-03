/* shared/components/footer.js — kaki halaman. */
import { esc } from "../utils.js";

export function footerHTML({ brand, contact = {}, socials = [], note = "" }) {
  const socialHtml = socials
    .map(
      (s) =>
        `<li><a href="${esc(s.href)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a></li>`
    )
    .join("");
  return `
  <footer class="site-footer">
    <div class="wrap footer-grid">
      <div>
        <p class="footer-brand">${esc(brand.name)}</p>
        <p class="footer-tagline">${esc(brand.tagline || "")}</p>
        ${note ? `<p class="footer-note">${esc(note)}</p>` : ""}
      </div>
      <div>
        <p class="footer-heading">Kontak</p>
        <address class="footer-contact">
          ${contact.address ? `<span>${esc(contact.address)}</span>` : ""}
          ${contact.hours ? `<span>${esc(contact.hours)}</span>` : ""}
          ${contact.phone ? `<a href="tel:${esc(contact.phone.replace(/\D/g, ""))}">${esc(contact.phone)}</a>` : ""}
        </address>
      </div>
      ${socialHtml ? `<div><p class="footer-heading">Ikuti kami</p><ul class="footer-socials">${socialHtml}</ul></div>` : ""}
    </div>
    <div class="wrap footer-bottom">
      <span>© <span data-year>2026</span> ${esc(brand.name)}</span>
      <span>Dibuat dengan teliti untuk pengunjung.</span>
    </div>
  </footer>`;
}
