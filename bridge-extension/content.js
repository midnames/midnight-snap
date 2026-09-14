// Isolated-world content script: injects the connector package into the page
// world as an ES module. Not `world: "MAIN"` in the manifest, because a MAIN
// content script has no `chrome.runtime` and so cannot resolve the extension
// URL that the module's relative import of ./index.js needs.
const script = document.createElement('script');
script.type = 'module';
script.src = chrome.runtime.getURL('auto.js');
script.onload = () => script.remove();
(document.head ?? document.documentElement).append(script);
