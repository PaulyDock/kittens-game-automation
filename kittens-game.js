//requires JQuery on page
function getBtnWSpan(btnSpan) {
  $('.btn .btnContent span')
}


function autoCatnip(ms = 5) {
  // ms = ms || 5;
  if ($('.tabsContainer .activeTab')[0].innerText === 'Bonfire') {
    $('.bldGroupContainer .btn')[0].click();
    setTimeout(() => { autoCatnip(ms); }, ms);
  }
}

function autoBuild(buildPriorities) {
  if ($('.tabsContainer .activeTab')[0].innerText !== 'Bonfire') {
    return;
  }

  buildPriorities = buildPriorities || [
    'Unic. Pasture',
    'Amphitheatre',
    'Catnip field',
    'Pasture',
    'Aqueduct',
    'Pasture',
    'Lumber Mill',
    'Mine',
    'Temple',
    'Academy',
    'Library',
    'Barn',
    'Warehouse',
    'Tradepost',
    'Workshop'
  ];

  let $clickableBtns = $('.bldGroupContainer .btn').not('.disabled');
  let clickableBldgNames = $.map($clickableBtns, (elem, idx) => {
    let text = $('.btnContent span', elem)[0].innerText;
    let parenLoc = text.indexOf('(');
    return parenLoc > -1 ? text.substr(0, parenLoc - 1) : text;
  });

  buildPriorities.forEach(building => {
    let idx = clickableBldgNames.indexOf(building);
    if (idx > -1) {
      console.log(building + ' built');
      $clickableBtns[idx].click();
    }
  });

  setTimeout(() => { autoBuild(); }, 5000);
}

function autoCraft() {
  let $res = $('#resContainer .resourceRow');
  let $crafts = $('#craftContainer .resourceRow');
};

function autoAll() {
  autoCatnip();
  autoBuild();
}