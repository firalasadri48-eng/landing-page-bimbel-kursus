/* ============================================================
   shared/utils.js — fungsi bantu dipakai semua website.
   ES module: <script type="module">.
   Tidak ada console.* tersisa; kegagalan selalu punya
   tampilan cadangan (fallback) di halaman.
   ============================================================ */

/**
 * Bangun tautan WhatsApp wa.me dengan teks ter-encode.
 * @param {string} number  format internasional, mis. "6281234567890"
 * @param {string} text    pesan terisi otomatis (boleh kosong)
 * @returns {string} URL https://wa.me/...
 */
export function waLink(number, text = "") {
  const digits = String(number || "").replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/**
 * Muat content.json dengan cadangan bila fetch gagal.
 * @param {string} url
 * @param {object} fallback  dipakai bila fetch gagal
 * @param {HTMLElement|null} noticeEl  elemen untuk pesan cadangan
 */
export async function loadContent(url, fallback = {}, noticeEl = null) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    if (noticeEl) {
      noticeEl.hidden = false;
      noticeEl.textContent =
        "Konten tidak dapat dimuat. Periksa koneksi lalu muat ulang halaman.";
    }
    return fallback;
  }
}

/**
 * Salin teks (mis. nomor rekening) ke clipboard.
 * Kembalikan true bila berhasil.
 */
export async function copyText(text) {
  const value = String(text);
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      return true;
    } catch {
      return false;
    }
  }
}

/** Isi <span data-year> dengan tahun berjalan. */
export function setYear(root = document) {
  const now = String(new Date().getFullYear());
  root.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = now;
  });
}

/**
 * Accordion FAQ yang bisa dipakai keyboard penuh.
 * Struktur: <div data-faq><div data-faq-item><button data-faq-q>…</button><div data-faq-a>…</div></div></div>
 */
export function initFaq(root = document) {
  root.querySelectorAll("[data-faq]").forEach((wrap) => {
    const items = wrap.querySelectorAll("[data-faq-item]");
    items.forEach((item) => {
      const btn = item.querySelector("[data-faq-q]");
      const panel = item.querySelector("[data-faq-a]");
      if (!btn || !panel) return;
      panel.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") === "true";
        // tutup yang lain (satu terbuka dalam satu waktu)
        items.forEach((other) => {
          const b = other.querySelector("[data-faq-q]");
          const p = other.querySelector("[data-faq-a]");
          if (b && p && other !== item) {
            b.setAttribute("aria-expanded", "false");
            p.hidden = true;
          }
        });
        btn.setAttribute("aria-expanded", String(!open));
        panel.hidden = open;
      });
    });
  });
}

/**
 * Navigasi HP: tombol hamburger membuka/menutup menu.
 * @param {string} btnSel   selector tombol, mis. "#nav-toggle"
 * @param {string} menuSel  selector menu, mis. "#nav-menu"
 */
export function initMobileNav(btnSel = "#nav-toggle", menuSel = "#nav-menu") {
  const btn = document.querySelector(btnSel);
  const menu = document.querySelector(menuSel);
  if (!btn || !menu) return;
  btn.setAttribute("aria-expanded", "false");
  btn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
  });
  // tutup menu saat tautan di dalamnya diklik
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    })
  );
}

/**
 * Tombol "salin" generik: <button data-copy="teksnya">.
 * Teks tombol berubah sesaat menjadi konfirmasi.
 */
export function initCopyButtons(root = document) {
  root.querySelectorAll("[data-copy]").forEach((btn) => {
    const original = btn.innerHTML;
    btn.addEventListener("click", async () => {
      const ok = await copyText(btn.getAttribute("data-copy") || "");
      btn.innerHTML = ok ? "Tersalin ✓" : "Gagal menyalin";
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
      }, 1600);
    });
  });
}

/** Escape HTML untuk teks dari content.json sebelum disisipkan. */
export function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
