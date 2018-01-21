//For use with Kittens Game:  http://bloodrizer.ru/games/kittens/#

const craftLogStyle = 'color: blue',
      buildLogStyle = 'color: green; font-weight: bold',
      quickEventStyle = '';

function autoCatnip(ms = 5) {
  if ($('.tabsContainer .activeTab')[0].innerText === 'Bonfire') {
    $('.bldGroupContainer .btn')[0].click();
    setTimeout(autoCatnip, ms, ms);
  }
}

function autoBuild(buildPriorities) {
  if ($('.tabsContainer .activeTab')[0].innerText !== 'Bonfire') {
    return;
  }

  buildPriorities = buildPriorities || [
    // 'Calciner',
    // 'Hut',
    // 'Log House',
    // 'Mansion',
    'Steamworks',
    // 'Mint',
    // 'Magneto',
    'Unic. Pasture',
//     'Amphitheatre',
//     'Temple',
    'Aqueduct',
    'Catnip field',
    'Pasture',
    'Quarry',
    'Lumber Mill',
    'Mine',
    'Oil Well',
    'Chapel',
    'Bio Lab',
    'Observatory',
//     'Academy',
//     'Library',
//     'Barn',
//     'Harbour',
//     'Warehouse',
    'Tradepost',
    'Workshop',
//     'Ziggurat',
    'Smelter'
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
      console.log('%cBuilt: ' + building, buildLogStyle);
      $clickableBtns[idx].click();
    }
  });

  setTimeout(autoBuild, 5000, buildPriorities);
}

function autoCraft() {
  //refactoring needed
  if ($('.tabsContainer .activeTab')[0].innerText !== 'Bonfire') {
    return;
  }

  let $observeBtn = $('#observeBtn')[0],
      $resCaps = $('#resContainer .resourceRow'),
      capped = [],
      $craftables = $('#craftContainer .resourceRow');
  let craftClickMap = $.map($craftables, craftable => {
    return $('td', craftable)[0].innerText;
  });

  if ($observeBtn) {
    $observeBtn.click();
    console.log('Observation made');
  }

  const resCraftKey = {
    'catnip:': 'wood:',
    'wood:': 'beam:',
    'minerals:': 'slab:',
    'coal:': 'steel:',
    'iron:': 'plate:',
//     'titanium:': 'TBD',
//     'gold:': 'TBD',
//     'oil:': 'TBD',
//     'catpower:': 'TBD',
    'science:': 'compendium:',
    'culture:': 'manuscript:'
//     'faith:': 'TBD'
//     'kittens:': 'TBD'
  };

  $.each($resCaps, (idx, elem) => {
    let max = $('.maxRes', elem)[0].innerText,
        current = $('.resAmount', elem)[0].innerText,
        name = $('.resource-name', elem)[0].innerText;
    if (max && max !== 0 && max !== '') {
      if (current === max.substring(1)) {
        if (name === 'catpower:') {
          $('#fastHuntContainer a')[0].click();
          console.log('%cHunted', quickEventStyle);
          let parchmentLoc = craftClickMap.indexOf('parchment:'),
              $parchmentAll = $('td a', $craftables[parchmentLoc])[3];
          setTimeout(() => {
            $parchmentAll.click();
          }, 1000);
        } else if (name === 'faith:') {
          $('#fastPraiseContainer a').click();
          console.log('Praised the sun', quickEventStyle);
        } else {
          capped.push(name);
        }
      }
    }
  });

  capped = capped
    .map(resource => resCraftKey[resource])
    .filter(craftable => craftable && craftable !== 'TBD');

    //TODO: Make this a function, DRY
  capped.forEach(resource => {
    let idx = craftClickMap.indexOf(resource);
    let $addBtn = $('td a', $craftables[idx])[0];
    if ($addBtn.style.display !== 'none') {
      $addBtn.click();
      if (resource === 'beam:') {
        let idx2 = craftClickMap.indexOf('scaffold:');
        let $addBtn2 = $('td a', $craftables[idx2])[0];
        if ($addBtn2.style.display !== 'none') {
          $addBtn2.click();
          console.log('%cCrafted: scaffold', craftLogStyle);
        }
      } else {
        console.log('%cCrafted: ' + resource.substr(0, resource.length - 1), craftLogStyle);
      }
    }
  });

  setTimeout(autoCraft, 1000);  
};

function manuscriptDebug() {
  let $craftables = $('#craftContainer .resourceRow'),
      craftClickMap = $.map($craftables, craftable => {
        return $('td', craftable)[0].innerText;
      });
  
  let manuscriptLoc = craftClickMap.indexOf('manuscript:'),
      $manuscriptMinor = $('td a', $craftables[manuscriptLoc])[0];

  if ($manuscriptMinor.style.display !== 'none') {
      $manuscriptMinor.click();
      console.log('%cCrafted: manuscript (debug)', craftLogStyle);
  }

  setTimeout(manuscriptDebug, 600000);
}

function autoAll() {
  // autoCatnip();
  autoBuild();
  autoCraft();
  // manuscriptDebug();
}