(function() {
    'use strict';
    const logPrefix = "Chrome Extension: Search Engine Blocker: "
    console.debug(logPrefix + "script injected");
    
    // OpenSearch
    // see https://www.chromium.org/tab-to-search/
    [...document.querySelectorAll('link[rel="search"][type="application/opensearchdescription+xml" i]')]
        .forEach(e => {
            console.debug(logPrefix + "remove attribute rel", e);
            e.removeAttribute('rel');
        });
    [...document.querySelectorAll('url[rel="suggestions" i]')]
        .forEach(e => {
            console.debug(logPrefix + "remove attribute rel", e);
            e.removeAttribute('rel');
        });

    // Google Chrome Autodiscovery
    // see https://martin-thoma.com/search-engine-autodiscovery/#google-chrome-autodiscovery
    [...document.querySelectorAll('form')]
        .filter(form => form.method === 'get')
        .filter(form => {
            var actionProtcol = new URL(form.getAttribute('action') || '', location.href).protocol;
            return isAnyOf(actionProtcol, ['https:', 'http:']);
         })
        .filter(form => {
            const inputElements = [...form.querySelectorAll(':scope input')]
            if(inputElements
               .filter(input => !input.readOnly)
               .filter(input => isAnyOf(input.type, ['search', 'text']))
               .length !== 1) return false;
            if(inputElements
               .filter(input => isAnyOf(input.type, ['password', 'file', 'textarea']))
               .length > 0) return false;
            return true;
        })
        .forEach(form => {
            console.debug(logPrefix + "add spoiler", form);
            const spoiler = document.createElement('textarea');
            spoiler.style.display='none';
            form.appendChild(spoiler);
        });

     function isAnyOf(value, arr){ return arr.includes(value); };
})();