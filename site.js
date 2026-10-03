/* ============================================================
   site.js — Bimbel Pelita (Bimbel / Kursus)
   Memuat content.json, merender navbar/seksi/footer,
   lalu memasang interaksi dari shared/utils.js.
   ============================================================ */
import {
  waLink,
  loadContent,
  initFaq,
  initMobileNav,
  initCopyButtons,
  setYear,
  esc,
} from "./shared/utils.js";
import { navbarHTML } from "./shared/components/navbar.js";
import { footerHTML } from "./shared/components/footer.js";
import { sectionHeadHTML } from "./shared/components/section-head.js";

/* Cadangan bila content.json tidak bisa dimuat (fetch gagal). */
const FALLBACK = {
  brand: { name: "Bimbel Pelita", mark: "☀", tagline: "Belajar seru, nilai pasti naik." },
  nav: {
    links: [
      { href: "#program", label: "Program" },
      { href: "#keunggulan", label: "Keunggulan" },
      { href: "#jadwal", label: "Jadwal" },
      { href: "#testimoni", label: "Testimoni" },
      { href: "#faq", label: "FAQ" },
      { href: "#kontak", label: "Kontak" },
    ],
    cta: { label: "Daftar Kelas", text: "Halo Bimbel Pelita! Saya mau tanya tentang pendaftaran kelas." },
  },
  hero: {
    badge: "Bimbel untuk SD · SMP · SMA",
    title: "Belajar seru, <mark>nilai pasti naik.</mark>",
    desc: "Kelas kecil berisi maksimal 8 siswa, pengajar yang sabar, dan try out rutin tiap bulan.",
    ctaPrimary: { label: "Daftar Kelas", text: "Halo Bimbel Pelita! Saya mau tanya tentang pendaftaran kelas." },
    ctaSecondary: { href: "#program", label: "Lihat Program" },
    stats: [
      { value: "12+", label: "tahun pengalaman" },
      { value: "850+", label: "siswa aktif" },
      { value: "96%", label: "orang tua puas" },
    ],
    report: {
      title: "Hasil belajar nyata",
      sub: "Contoh rapor siswa kelas 8 — Semester 1",
      rows: [
        { mapel: "Matematika", nilai: "92", grade: "A" },
        { mapel: "IPA", nilai: "90", grade: "A" },
        { mapel: "Bahasa Inggris", nilai: "87", grade: "B+" },
      ],
      foot: "Rata-rata nilai siswa naik 15 poin dalam 3 bulan.",
    },
  },
  sections: {
    program: { index: "01", eyebrow: "Program", title: "Pilih kelas sesuai <mark>jenjang</mark>", desc: "" },
    keunggulan: { index: "02", eyebrow: "Keunggulan", title: "Kenapa orang tua <mark>percaya</mark> kami", desc: "" },
    jadwal: { index: "03", eyebrow: "Jadwal", title: "Jadwal kelas <mark>mingguan</mark>", desc: "", note: "" },
    testimoni: { index: "04", eyebrow: "Testimoni", title: "Kata <mark>orang tua</mark> siswa", desc: "" },
    faq: { index: "05", eyebrow: "FAQ", title: "Pertanyaan yang <mark>sering</mark> ditanyakan", desc: "" },
    kontak: { index: "06", eyebrow: "Kontak", title: "Kunjungi atau <mark>hubungi</mark> kami", desc: "" },
  },
  programs: [
    {
      jenjang: "SD", icon: "🎒",
      mapel: ["Matematika", "Bahasa Indonesia", "IPA", "Bahasa Inggris"],
      fitur: ["3× pertemuan per minggu", "Maks. 8 siswa per kelas"],
      harga: "Rp275.000", periode: "/bulan", ctaLabel: "Daftar Kelas SD",
      waText: "Halo Bimbel Pelita! Saya tertarik mendaftar kelas SD.",
    },
    {
      jenjang: "SMP", icon: "📐",
      mapel: ["Matematika", "IPA", "Bahasa Inggris", "IPS"],
      fitur: ["4× pertemuan per minggu", "Maks. 8 siswa per kelas"],
      harga: "Rp325.000", periode: "/bulan", ctaLabel: "Daftar Kelas SMP", unggulan: true,
      waText: "Halo Bimbel Pelita! Saya tertarik mendaftar kelas SMP.",
    },
    {
      jenjang: "SMA", icon: "🎓",
      mapel: ["Matematika", "Fisika", "Kimia", "Biologi"],
      fitur: ["4× pertemuan per minggu", "Maks. 8 siswa per kelas"],
      harga: "Rp375.000", periode: "/bulan", ctaLabel: "Daftar Kelas SMA",
      waText: "Halo Bimbel Pelita! Saya tertarik mendaftar kelas SMA.",
    },
  ],
  advantages: [
    { icon: "👩‍🏫", title: "Pengajar berpengalaman", desc: "Tutor pilihan yang sabar dan mudah dipahami." },
    { icon: "👥", title: "Kelas kecil", desc: "Maksimal 8 siswa per kelas." },
    { icon: "📝", title: "Try out rutin", desc: "Simulasi ujian tiap bulan." },
    { icon: "📊", title: "Laporan ke orang tua", desc: "Perkembangan dilaporkan via WhatsApp." },
  ],
  schedule: {
    columns: ["Hari", "SD", "SMP", "SMA"],
    rows: [["Senin", "Matematika", "IPA", "Fisika"]],
  },
  testimonials: [
    { quote: "Anak saya jadi semangat belajar dan nilainya naik.", name: "Ibu Ratna", role: "Orang tua siswa SD" },
  ],
  faq: [{ q: "Berapa maksimal siswa per kelas?", a: "Maksimal 8 siswa per kelas." }],
  contact: {
    address: "Jl. Pendidikan No. 123, Jakarta Selatan 12430",
    hours: "Senin–Jumat 13.00–20.00 · Sabtu 08.00–14.00",
    phoneDisplay: "+62 812-3456-7890",
    whatsapp: "6281234567890",
    whatsappTodo: "TODO: ganti nomor WA asli",
    mapsQuery: "Bimbel Pelita Jakarta Selatan",
    waText: "Halo Bimbel Pelita! Saya mau bertanya tentang bimbingan belajar.",
  },
  footer: { note: "", socials: [] },
};

function rich(str) {
  /* Judul boleh memuat <mark> dari content.json (data milik sendiri). */
  return String(str ?? "");
}

function renderNav(c) {
  const wa = c.nav?.cta || {};
  document.getElementById("site-nav").innerHTML = navbarHTML({
    brand: c.brand,
    links: c.nav?.links || [],
    cta: wa.label
      ? { href: waLink(c.contact?.whatsapp, wa.text), label: wa.label }
      : null,
  });
}

function renderHero(c) {
  const h = c.hero || {};
  const stats = (h.stats || [])
    .map((s) => `<li><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></li>`)
    .join("");
  const rows = (h.report?.rows || [])
    .map(
      (r) =>
        `<div class="report-row"><span>${esc(r.mapel)} <strong>${esc(r.nilai)}</strong></span><span class="report-grade">${esc(r.grade)}</span></div>`
    )
    .join("");
  document.getElementById("hero-body").innerHTML = `
    <div>
      ${h.badge ? `<p class="hero-badge">${esc(h.badge)}</p>` : ""}
      <h1 class="hero-title">${rich(h.title)}</h1>
      <p class="hero-desc">${esc(h.desc)}</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${waLink(c.contact?.whatsapp, h.ctaPrimary?.text)}">${esc(h.ctaPrimary?.label || "Daftar Kelas")}</a>
        ${h.ctaSecondary ? `<a class="btn btn-outline" href="${esc(h.ctaSecondary.href)}">${esc(h.ctaSecondary.label)}</a>` : ""}
      </div>
      ${stats ? `<ul class="hero-stats">${stats}</ul>` : ""}
    </div>
    <div class="hero-visual" aria-hidden="true">
      <div class="report-card">
        <h3>${esc(h.report?.title || "")}</h3>
        <p class="report-sub">${esc(h.report?.sub || "")}</p>
        ${rows}
        <p class="report-foot">${esc(h.report?.foot || "")}</p>
      </div>
    </div>`;
}

function renderSectionHead(key, c) {
  const s = c.sections?.[key];
  if (!s) return;
  document.getElementById(`head-${key}`).innerHTML = sectionHeadHTML({
    index: s.index,
    eyebrow: s.eyebrow,
    title: rich(s.title),
    desc: esc(s.desc || ""),
  });
}

function renderPrograms(c) {
  renderSectionHead("program", c);
  const cards = (c.programs || [])
    .map(
      (p) => `
      <article class="program-card">
        ${p.unggulan ? `<span class="program-ribbon">Paling diminati</span>` : ""}
        <div class="program-icon" aria-hidden="true">${esc(p.icon || "📚")}</div>
        <h3>Kelas ${esc(p.jenjang)}</h3>
        <ul class="program-mapel" aria-label="Mata pelajaran kelas ${esc(p.jenjang)}">
          ${(p.mapel || []).map((m) => `<li>${esc(m)}</li>`).join("")}
        </ul>
        <ul class="program-fitur">
          ${(p.fitur || []).map((f) => `<li>${esc(f)}</li>`).join("")}
        </ul>
        <p class="program-price"><strong>${esc(p.harga)}</strong> <span>${esc(p.periode || "")}</span></p>
        <a class="btn btn-primary" href="${waLink(c.contact?.whatsapp, p.waText)}" target="_blank" rel="noopener noreferrer">${esc(p.ctaLabel || "Daftar")}</a>
      </article>`
    )
    .join("");
  document.getElementById("body-program").innerHTML = cards;
}

function renderAdvantages(c) {
  renderSectionHead("keunggulan", c);
  document.getElementById("body-keunggulan").innerHTML = (c.advantages || [])
    .map(
      (a) => `
      <article class="feature-card">
        <div class="feature-icon" aria-hidden="true">${esc(a.icon || "⭐")}</div>
        <h3>${esc(a.title)}</h3>
        <p>${esc(a.desc)}</p>
      </article>`
    )
    .join("");
}

function renderSchedule(c) {
  renderSectionHead("jadwal", c);
  const sch = c.schedule || {};
  const head = (sch.columns || [])
    .map((col, i) =>
      i === 0 ? `<th scope="col">${esc(col)}</th>` : `<th scope="col">${esc(col)}</th>`
    )
    .join("");
  const body = (sch.rows || [])
    .map(
      (row) =>
        `<tr><th scope="row">${esc(row[0])}</th>${row
          .slice(1)
          .map((cell) => `<td>${esc(cell)}</td>`)
          .join("")}</tr>`
    )
    .join("");
  const note = c.sections?.jadwal?.note ? `<p class="schedule-note">${esc(c.sections.jadwal.note)}</p>` : "";
  document.getElementById("body-jadwal").innerHTML = `
    <div class="table-scroll">
      <table class="schedule-table">
        <caption>Jadwal reguler kelas sore</caption>
        <thead><tr>${head}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>
    ${note}`;
}

function renderTestimonials(c) {
  renderSectionHead("testimoni", c);
  document.getElementById("body-testimoni").innerHTML = (c.testimonials || [])
    .map(
      (t) => `
      <article class="testi-card">
        <blockquote>${esc(t.quote)}</blockquote>
        <footer><cite>${esc(t.name)}</cite><span class="testi-role">${esc(t.role)}</span></footer>
      </article>`
    )
    .join("");
}

function renderFaq(c) {
  renderSectionHead("faq", c);
  document.getElementById("body-faq").innerHTML = (c.faq || [])
    .map(
      (f, i) => `
      <div data-faq-item>
        <button data-faq-q id="faq-q-${i}" aria-controls="faq-a-${i}">${esc(f.q)}</button>
        <div data-faq-a id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}">${esc(f.a)}</div>
      </div>`
    )
    .join("");
}

function renderContact(c) {
  renderSectionHead("kontak", c);
  const k = c.contact || {};
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(k.mapsQuery || "")}`;
  const waUrl = waLink(k.whatsapp, k.waText);
  document.getElementById("body-kontak").innerHTML = `
    <div class="kontak-grid">
      <div class="kontak-card">
        <ul class="kontak-list">
          <li>
            <span class="kontak-icon" aria-hidden="true">📍</span>
            <div><strong>Alamat</strong><address style="font-style:normal">${esc(k.address)}</address></div>
          </li>
          <li>
            <span class="kontak-icon" aria-hidden="true">🕐</span>
            <div><strong>Jam buka</strong><span>${esc(k.hours)}</span></div>
          </li>
          <li>
            <span class="kontak-icon" aria-hidden="true">📞</span>
            <div><strong>Telepon / WhatsApp</strong><a href="tel:${esc(String(k.whatsapp || "").replace(/\D/g, ""))}">${esc(k.phoneDisplay)}</a></div>
          </li>
        </ul>
        ${k.whatsappTodo ? `<p class="kontak-todo">${esc(k.whatsappTodo)}</p>` : ""}
      </div>
      <div class="kontak-card">
        <h3 style="margin-bottom:.75rem">Siap mendaftar?</h3>
        <p style="color:var(--color-muted);margin-bottom:1.25rem">Chat kami sekarang — konsultasi gratis, tanpa komitmen.</p>
        <div class="kontak-actions">
          <a class="btn btn-primary" href="${waUrl}" target="_blank" rel="noopener noreferrer">Chat WhatsApp</a>
          <button class="btn btn-outline" type="button" data-copy="${esc(k.whatsapp || "")}">Salin nomor WA</button>
          <a class="btn btn-outline" href="${mapsUrl}" target="_blank" rel="noopener noreferrer">Buka di Google Maps</a>
        </div>
      </div>
    </div>`;
}

function renderFooter(c) {
  document.getElementById("site-footer").innerHTML = footerHTML({
    brand: c.brand,
    contact: {
      address: c.contact?.address,
      hours: c.contact?.hours,
      phone: c.contact?.phoneDisplay,
    },
    socials: c.footer?.socials || [],
    note: c.footer?.note,
  });
}

function injectJsonLd(c) {
  const k = c.contact || {};
  const data = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: c.brand?.name,
    description: c.seo?.description,
    telephone: k.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: k.address,
      addressLocality: "Jakarta Selatan",
      addressCountry: "ID",
    },
    openingHours: k.hours,
    url: "https://wa.me/" + String(k.whatsapp || "").replace(/\D/g, ""),
  };
  const el = document.createElement("script");
  el.type = "application/ld+json";
  el.textContent = JSON.stringify(data);
  document.head.appendChild(el);
}

async function main() {
  const notice = document.getElementById("content-notice");
  const content = await loadContent("content.json", FALLBACK, notice);

  renderNav(content);
  renderHero(content);
  renderPrograms(content);
  renderAdvantages(content);
  renderSchedule(content);
  renderTestimonials(content);
  renderFaq(content);
  renderContact(content);
  renderFooter(content);
  injectJsonLd(content);

  initMobileNav();
  initFaq();
  initCopyButtons();
  setYear();
}

main();
