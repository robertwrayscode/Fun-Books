/* ==========================================================================
   PRINTED BOOK LINKS  (the only part you need to edit)

   When a book is for sale, paste its store link between the quotes:
     amazon: the Amazon product page from KDP
     lulu:   the Lulu "buy" link (from Lulu Direct / your Lulu storefront)

   Leave a link empty ("") and its button stays hidden. While both are
   empty the site just says "Printed copy coming soon".
   ========================================================================== */
window.FUN_BOOKS_PRINT = {
  independent: { amazon: "", lulu: "" },  // The Independent Household
  dino:        { amazon: "", lulu: "" },  // There's a Dinosaur in the Backyard
  gop:         { amazon: "", lulu: "" },  // How to Survive a GOP Apocalypse
  alien:       { amazon: "", lulu: "" },  // The Housewife's Guide to Alien Invasions
  robot:       { amazon: "", lulu: "" },  // Etiquette for the Robot Uprising
  ai:          { amazon: "", lulu: "" },  // How to Survive the AI Apocalypse
  zombie:      { amazon: "", lulu: "" },  // The Gentleman's Guide to the Zombie Neighborhood
  asteroid:    { amazon: "", lulu: "" },  // Homemaking After the Asteroid
  bigfoot:     { amazon: "", lulu: "" },  // How to Raise a Well-Behaved Bigfoot
  time:        { amazon: "", lulu: "" }   // Good Manners for Time Travelers
};

/* --- Nothing below needs editing. ---------------------------------------
   Fills every <span class="buy-print" data-book="KEY"> with buttons.
   data-cls  = button classes to use (matches the page's own buttons)
   data-soon = "0" to show nothing (instead of "coming soon") when no links */
(function () {
  var style = document.createElement('style');
  style.textContent =
    '.buy-print{display:contents}' +
    '.buy-print .print-soon{display:inline-block;padding:10px 4px;font-style:italic;opacity:.85;font-size:.95rem}';
  document.head.appendChild(style);

  function render(root) {
    var spots = (root || document).querySelectorAll('.buy-print[data-book]');
    Array.prototype.forEach.call(spots, function (el) {
      var links = window.FUN_BOOKS_PRINT[el.getAttribute('data-book')] || {};
      var cls = el.getAttribute('data-cls') || 'btn';
      var html = '';
      if (links.amazon) html += '<a class="' + cls + '" href="' + links.amazon + '" target="_blank" rel="noopener">Buy the printed book on Amazon</a>';
      if (links.lulu) html += '<a class="' + cls + '" href="' + links.lulu + '" target="_blank" rel="noopener">Buy the printed book direct</a>';
      if (!html && el.getAttribute('data-soon') !== '0') html = '<span class="print-soon">Printed copy coming soon</span>';
      el.innerHTML = html;
    });
  }
  window.FunBooksPrint = { render: render };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { render(); });
  else render();
})();
