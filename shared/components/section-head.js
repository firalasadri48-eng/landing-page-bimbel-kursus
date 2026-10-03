/* shared/components/section-head.js — kepala seksi bernomor. */
import { esc } from "../utils.js";

export function sectionHeadHTML({ index, eyebrow, title, desc = "" }) {
  return `
  <div class="section-head">
    <p class="section-index">${esc(index)} / ${esc(eyebrow)}</p>
    <h2 class="section-title">${title}</h2>
    ${desc ? `<p class="section-desc">${desc}</p>` : ""}
  </div>`;
}
