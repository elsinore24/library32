export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "library/_app",
	assets: new Set(["_redirects","default-clue.png","favicon.png","images/clues/poisoned-page.png","sounds/.gitkeep","sounds/library-ambience.mp3"]),
	mimeTypes: {".png":"image/png",".mp3":"audio/mpeg"},
	_: {
		client: {start:"_app/immutable/entry/start.D2o1fOUU.js",app:"_app/immutable/entry/app.3VyksX2h.js",imports:["_app/immutable/entry/start.D2o1fOUU.js","_app/immutable/chunks/V6jZy6t-.js","_app/immutable/chunks/CzRFqhbG.js","_app/immutable/chunks/7sAS6QVD.js","_app/immutable/chunks/OuAugre_.js","_app/immutable/entry/app.3VyksX2h.js","_app/immutable/chunks/ByEG_e9Y.js","_app/immutable/chunks/CzRFqhbG.js","_app/immutable/chunks/CPVu1_AZ.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/library",
				pattern: /^\/library\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/rooms/library",
				pattern: /^\/rooms\/library\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
