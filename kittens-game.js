
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
    'Temple',
    'Aqueduct',
    'Catnip field',
    'Pasture',
    'Lumber Mill',
    'Mine',
    'Observatory',
    'Academy',
    'Library',
    'Barn',
    'Warehouse',
    'Tradepost',
    'Workshop',
    'Ziggurat'
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
  if ($('.tabsContainer .activeTab')[0].innerText !== 'Bonfire') {
    return;
  }

  let $observeBtn = $('#observeBtn')[0],
      $resCaps = $('#resContainer .resourceRow'),
      capped = [],
      $craftables = $('#craftContainer .resourceRow');

  if ($observeBtn) { $observeBtn.click(); }

  let craftClickMap = $.map($craftables, craftable => {
    return $('td', craftable)[0].innerText;
  });

  const resCraftKey = {
    'catnip:': 'wood:',
    'wood:': 'beam:',
    'minerals:': 'slab:',
    'coal:': 'steel:',
    'iron:': 'plate:',
    'gold:': 'TBD',
    'catpower:': 'TBD',
    'science:': 'TBD',
    'culture:': 'TBD',
    'faith:': 'TBD'
  };

  $.each($resCaps, (idx, elem) => {
    let max = $('.maxRes', elem)[0].innerText,
        current = $('.resAmount', elem)[0].innerText,
        name = $('.resource-name', elem)[0].innerText;
    if (max && max !== 0 && max !== '') {
      if (current === max.substring(1)) {
        if (name === 'catpower:') {
          $('#fastHuntContainer a')[0].click();
          let parchmentLoc = craftClickMap.indexOf('parchment:'),
              $parchmentAll = $('td a', $craftables[parchmentLoc])[3];
          setTimeout(() => {
            $parchmentAll.click();
          }, 1000);
        } else if (name === 'faith:') {
          $('#fastPraiseContainer a').click();
        } else {
          capped.push(name);
        }
      }
    }
  });

  capped = capped
    .map(resource => resCraftKey[resource])
    .filter(craftable => craftable && craftable !== 'TBD');

  capped.forEach(resource => {
    let idx = craftClickMap.indexOf(resource);
    $('td a', $craftables[idx])[0].click();
    console.log(resource + ' crafted');
  });

  setTimeout(() => { autoCraft(); }, 1000);  
};

function autoObserve() {
//$('input#observeBtn')  
}

function autoAll() {
  autoCatnip();
  autoBuild();
  autoCraft();
}