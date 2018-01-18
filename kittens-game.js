
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

  let $resCaps = $('#resContainer .resourceRow'),
      capped = [];
      $craftables = $('#craftContainer .resourceRow'),
      craftClickMap,
      $singleResParams,
      allResParams = {};

  const resCraftKey = {
    catnip: 'wood',
    wood: 'beam',
    minerals: 'slab',
    coal: 'steel',
    iron: 'plate',
    gold: 'TBD',
    catpower: 'TBD',
    science: 'TBD',
    culture: 'TBD',
    faith: 'TBD'
  };

  $resCaps.forEach(row => {
    let $max = $('.maxRes', row)[0];
    if ($max) {
      if ($('.resAmount', row)[0].innerText === $max.innerText) {
        capped.push($('.resource-name', row)[0].innerText);
      }
    }
    // $('.maxRes', $res[0])[0].innerText
    // $('.resAmount', $res[0])[0].innerText
  });
  console.log('capped', capped);

  capped = capped
    .map(resource => resCraftKey[resource])
    .filter(craftable => craftable !== 'TBD');
  console.log('capped post-filter', capped);

  craftClickMap = $.map($craftables, (craftable, idx) => {
    return $('.resource-name', craftable)[0].innerText;
  });
  console.log('craftClickMap', craftClickMap);

  capped.forEach(resource => {
    let idx = craftClickMap.indexOf(resource);
    console.log(resource + ' crafted');
    $craftables[idx].click();
  });
  // $resCaps.forEach(row => {
  //   let $singleParams = $('td', row),
  //       singleParams = {};

  //   $singleParams.forEach(elem => {
  //     singleParams[elem.className] = elem.innerText;
  //   });

  //   allResParams[singleParams['resource-name']] = singleParams;
  // });
  // console.log('allResParams', allResParams);

  setTimeout(() => { autoCraft(); }, 5000);  
};

function autoAll() {
  autoCatnip();
  autoBuild();
}