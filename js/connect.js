const params = window.location.search;
window.opener.postMessage(params);
window.close();
