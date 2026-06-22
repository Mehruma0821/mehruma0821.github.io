// Loads each [data-include] element's partial HTML file, then fires
// 'includes:loaded' so other scripts can safely query the injected DOM.
(function () {
  const targets = Array.from(document.querySelectorAll('[data-include]'));

  Promise.all(
    targets.map((el) =>
      fetch(el.getAttribute('data-include'))
        .then((res) => res.text())
        .then((html) => { el.innerHTML = html; })
    )
  ).then(() => {
    document.dispatchEvent(new Event('includes:loaded'));
  });
})();
