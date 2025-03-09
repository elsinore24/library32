import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.quMwX41d.js","_app/immutable/chunks/CzRFqhbG.js","_app/immutable/chunks/CPVu1_AZ.js","_app/immutable/chunks/BLNg_MBi.js","_app/immutable/chunks/2gw5FMqC.js","_app/immutable/chunks/7sAS6QVD.js","_app/immutable/chunks/ByEG_e9Y.js"];
export const stylesheets = ["_app/immutable/assets/0.Bemves4v.css"];
export const fonts = [];
