document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.coming-soon-link').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
    });
  });

  var bibtexCopyBtn = document.getElementById('bibtex-copy-btn');
  var bibtexCode = document.getElementById('bibtex-code');

  if (bibtexCopyBtn && bibtexCode) {
    bibtexCopyBtn.addEventListener('click', function () {
      var label = bibtexCopyBtn.querySelector('.bibtex-copy-label');
      var text = bibtexCode.textContent.trim();

      function showCopied() {
        if (label) {
          label.textContent = 'Copied!';
        }
        setTimeout(function () {
          if (label) {
            label.textContent = 'Copy';
          }
        }, 2000);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(showCopied).catch(function () {
          window.prompt('Copy BibTeX:', text);
        });
      } else {
        window.prompt('Copy BibTeX:', text);
      }
    });
  }
});
