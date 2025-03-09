import { c as create_ssr_component, b as subscribe, d as each, e as escape } from "../../chunks/ssr.js";
import { e as evidence } from "../../chunks/evidence.js";
import { b as base } from "../../chunks/paths.js";
function getUniqueEvidence(items) {
  const uniqueMap = /* @__PURE__ */ new Map();
  items.forEach((item) => {
    uniqueMap.set(item.id, item);
  });
  return Array.from(uniqueMap.values());
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let uniqueEvidence;
  let $evidence, $$unsubscribe_evidence;
  $$unsubscribe_evidence = subscribe(evidence, (value) => $evidence = value);
  uniqueEvidence = getUniqueEvidence($evidence);
  $$unsubscribe_evidence();
  return `<div class="p-8 pt-16 animate-fade-in font-burton text-parchment flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-black via-obsidian to-gray-900 relative"><div class="mist"></div> <div class="max-w-xl w-full mx-auto text-center z-10"> <h1 class="text-3xl md:text-4xl lg:text-5xl mb-12 text-parchment animate-fade-in transform scale-95 hover:scale-100 transition-all duration-500 tracking-wide glow-title dripping-title" data-svelte-h="svelte-ch3fct">The Haunted Library
      <span class="drip"></span></h1>  <div class="mb-12" data-svelte-h="svelte-12htbf"><a href="${escape(base, true) + "/library"}" class="w-40 h-40 mx-auto p-4 border border-accent rounded-full hover:bg-accent/10 transition-all duration-300 transform hover:scale-110 hover:rotate-3 shadow-[0_0_15px_#00ff00] text-parchment flex items-center justify-center text-center"><p class="text-sm md:text-base leading-snug">Uncover secrets hidden among ancient tomes...</p></a></div>  <div class="mb-12" data-svelte-h="svelte-oeumsq"><a href="${escape(base, true) + "/game"}" class="w-40 h-40 mx-auto p-4 border border-accent rounded-full hover:bg-accent/10 transition-all duration-300 transform hover:scale-110 hover:rotate-3 shadow-[0_0_15px_#00ff00] text-parchment flex items-center justify-center text-center"><p class="text-sm md:text-base leading-snug">Go to Game</p></a></div>  <div class="w-full"><h3 class="text-2xl md:text-3xl mb-6 text-parchment" data-svelte-h="svelte-h7wnxu">Evidence Board</h3> ${uniqueEvidence.length === 0 ? `<p class="text-accent animate-flicker text-xl shadow-[0_0_20px_#ff0000]" data-svelte-h="svelte-126n527">No evidence collected yet...</p>` : `<ul class="space-y-4">${each(uniqueEvidence, (item) => {
    return `<li class="evidence-card p-4 border border-accent/50 rounded bg-parchment text-black shadow-lg hover:shadow-[0_0_25px_#ff0000] transform hover:-rotate-1 transition-all duration-300"><p class="mb-2">${escape(item.description)}</p> ${item.image ? `<img src="${escape(base, true) + escape(item.image, true)}" alt="Evidence photo" class="w-full max-w-md mx-auto rounded-lg border border-primary/30 mt-4" loading="lazy">` : ``} <div class="text-sm text-accent/60 mt-2">${escape(new Date(item.discovered_at || "").toLocaleString())}</div> </li>`;
  })}</ul>`}</div></div></div>`;
});
export {
  Page as default
};
