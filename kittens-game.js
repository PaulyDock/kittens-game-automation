//For use with Kittens Game:  http://bloodrizer.ru/games/kittens/#

// const craftLogStyle = 'color: blue',
//       buildLogStyle = 'color: green; font-weight: bold',
//       quickEventStyle = '';

function getActiveTab() {
  return $('.tabsContainer .activeTab')[0].innerText;
}

function autoCatnip(ms = 20) {
  if (getActiveTab() === 'Bonfire') {
    $('.bldGroupContainer .btn')[0].click();
    setTimeout(autoCatnip, ms, ms);
  }
}

function autoBuild(buildPriorities) {
  if (getActiveTab() !== 'Bonfire') {
    return;
  }

  buildPriorities = buildPriorities || [
    'Catnip field', //catnip
    'Pasture', //catnip, wood
    'Aqueduct', //minerals
    // 'Hut', //wood
    // 'Log House', //wood, minerals
    // 'Mansion', //slab, steel, titanium
    'Library', //wood
    'Academy', //wood, minerals, science
    'Observatory', //scaffold, slab, iron, science
    'Bio Lab', //slab, alloy, science
    'Barn', //wood
    'Warehouse', //beam, slab
    'Harbour', //scaffold, slab, plate
    'Mine', //minerals, plate, gold
    'Quarry', //scaffold, steel, slab
    'Lumber Mill', //wood, minerals, iron
    'Oil Well', //steel, gear, scaffold
    'Steamworks', //steel, gear, blueprint
    // 'Magneto', //alloy, gear, blueprint
    'Smelter', //minerals
    // 'Calciner', //steel, titanium, blueprint, oil
    // 'Amphitheatre', //wood, minerals, parchment
    'Chapel', //minerals, culture, parchment
    'Temple', //slab, plate, gold, manuscript
    'Workshop', //wood, minerals
    'Tradepost', //wood, minerals, gold
    'Mint', //minerals, plate, gold
    'Unic. Pasture', //unicorns
    'Ziggurat', //megalith(slab, beam, plate), scaffold, blueprint
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

  const cappedResourceKey = {
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
//     'culture:': 'manuscript:',
//     'faith:': 'TBD',
//     'kittens:': 'TBD',
  };

  const craftRecipes = {
    wood: {
      catnip: 50
    },
    beam: {
      wood: 175
    },
    slab: {
      minerals: 250
    },
    plate: {
      iron: 125
    },
    steel: {
      iron: 100,
      coal: 100
    },
    gear: {
      steel: 15
    },
    alloy: {
      steel: 75,
      titanium: 10
    },
    scaffold: {
      beam: 50
    },
    ship: {
      scaffold: 100,
      plate: 150,
      starchart: 25
    },
    parchment: {
      furs: 175
    },
    manuscript: {
      parchment: 125,
      culture: 400
    },
    compendium: {
      manuscript: 50,
      science: 10000
    },
    blueprint: {
      compendium: 25,
      science: 25000
    },
    megalith: {
      slab: 50,
      beam: 25,
      plate: 5
    }
  }



  $.each($resCaps, (idx, elem) => {
    let max = convertQuant($('.maxRes', elem)[0].innerText),
        current = convertQuant($('.resAmount', elem)[0].innerText),
        name = $('.resource-name', elem)[0].innerText;
    if (max && max !== 0 && max !== '') {
      if (current >= max) {
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
    .map(resource => cappedResourceKey[resource])
    .filter(craftable => craftable && craftable !== 'TBD');

    //TODO: Make this a function, DRY
  capped.forEach(resource => {
    let idx = craftClickMap.indexOf(resource),
        $addBtn = $('td a', $craftables[idx])[0];

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

// function manuscriptDebug() {
//   let $craftables = $('#craftContainer .resourceRow'),
//       craftClickMap = $.map($craftables, craftable => {
//         return $('td', craftable)[0].innerText;
//       });
  
//   let manuscriptLoc = craftClickMap.indexOf('manuscript:'),
//       $manuscriptMinor = $('td a', $craftables[manuscriptLoc])[0];

//   if ($manuscriptMinor.style.display !== 'none') {
//     $manuscriptMinor.click();
//     console.log('%cCrafted: manuscript (debug)', craftLogStyle);
//   }

//   setTimeout(manuscriptDebug, 600000);
// }


function autoAll() {
  // autoCatnip();
  autoBuild();
  autoCraft();
  // manuscriptDebug();
}


function convertQuant(str) {
  const conversion = {
    K: 1000,
    M: 1000000,
    B: 1000000000,
    T: 1000000000000
  };

  if (isNaN(str)) {
    let place = str[str.length - 1];
    str = Number(str.substring(0, str.length - 1)) * conversion[place];
  }
  
  return Number(str);
}