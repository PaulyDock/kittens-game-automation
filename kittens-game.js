//For use with Kittens Game:  http://bloodrizer.ru/games/kittens/#

// temporary undeclared variables during development.
style = {
  craft: 'color: blue',
  build: 'color: green; font-weight: bold',
  event: ''
};

intervalIDs = {
  gatherCatnip: null,
  buildAll: null,
  craftAll: null
};


function getActiveTab() {
  return $('.tabsContainer .activeTab')[0].innerText;
}


function convertQuant(str) {
  const conversion = {
    K: 1000,
    M: 1000000,
    G: 1000000000,
    T: 1000000000000
  };

  if (isNaN(str)) {
    let place = str[str.length - 1];
    str = Number(str.substring(0, str.length - 1)) * conversion[place];
  }
  
  return Number(str);
}


function gatherCatnip() {
  if (getActiveTab() !== 'Bonfire') {
    // stopAuto(gatherCatnip);
    return;
  }

  $('.bldGroupContainer .btn')[0].click();
}


function buildAll() {
  if (getActiveTab() !== 'Bonfire') {
    // stopAuto(buildAll);
    return;
  }

  //adjust to determine which buildings are checked for buildAll
  const buildPriorities = [
    'Catnip field', //catnip
//     'Pasture', //catnip, wood
    'Solar Farm', //titanium
//     'Aqueduct', //minerals
    'Hydro Plant', //concrete, titanium
    'Hut', //wood
    'Log House', //wood, minerals
    'Mansion', //slab, steel, titanium
    'Library', //wood
    'Academy', //wood, minerals, science
    'Observatory', //scaffold, slab, iron, science
    'Bio Lab', //slab, alloy, science
    'Barn', //wood
//     'Warehouse', //beam, slab
//     'Harbour', //scaffold, slab, plate
    'Mine', //wood
//     'Quarry', //scaffold, steel, slab
    'Lumber Mill', //wood, minerals, iron
//     'Oil Well', //steel, gear, scaffold
    'Accelerator', //titanium, concrete, uranium
//     'Steamworks', //steel, gear, blueprint
//     'Magneto', //alloy, gear, blueprint
    'Smelter', //minerals
    'Calciner', //steel, titanium, blueprint, oil
    "Factory", //titanium, plate, concrete
    "Reactor", //titanium, plate, concrete, blueprint
//     'Amphitheatre', //wood, minerals, parchment
    'Broadcast Tower', //iron, titanium
    'Chapel', //minerals, culture, parchment
    'Temple', //slab, plate, gold, manuscript
    'Workshop', //wood, minerals
    'Tradepost', //wood, minerals, gold
    'Mint', //minerals, plate, gold
    'Unic. Pasture', //unicorns
    'Ziggurat', //megalith(slab, beam, plate), scaffold, blueprint
  ];

  let $clickableBldgs = $('.bldGroupContainer .btn').not('.disabled'),
      bldgNameBtnKey = {},
      $rdyBldg;

  $.each($clickableBldgs, (idx, elem) => {
    let bldgName = $('.btnContent span', elem)[0].innerText,
        parenLoc = bldgName.indexOf('(');
    bldgName = parenLoc > -1 ? bldgName.substr(0, parenLoc - 1) : bldgName;
    bldgNameBtnKey[bldgName] = elem;
  });

//   buildPriorities.forEach(building => {
  for (let building of buildPriorities) {
    $rdyBldg = bldgNameBtnKey[building];
    if ($rdyBldg) {
      $rdyBldg.click();
      console.log('%cBuilt: ' + building + ' ' + new Date(Date.now()).toLocaleTimeString(), style.build);
      if (building === 'Mint') {
        let $mintSubtract = $('.bldGroupContainer .btn > :contains("Mint") > :contains("-") a')[1];
        setTimeout($mintSubtract.click.bind($mintSubtract), 333);
      }
      break;
    }
  };

}


function craftAll() {

  let $observeBtn = $('#observeBtn')[0];
  if ($observeBtn) {
    $observeBtn.click();
    // console.log('Observation made');
  }

  //adjust to activate which capped resources craftAll when complete
  const cappedResourceKey = {
    'catnip': 'wood',
    'wood': 'beam',
    'minerals': 'slab',
    'coal': 'steel',
    'iron': 'plate',
//     'titanium': 'alloy',
    // 'gold': 'TBD',
    'oil': 'kerosene',
    'uranium': 'thorium',
    'unobtainium': 'eludium',
    // 'catpower': 'TBD', //auto-hunts special case
//     'science': 'compendium', //risky
//     'culture': 'manuscript', //risky
//     'faith': 'TBD', //auto-praise special case
    // 'kittens': 'TBD',
  };

  const ratioModifier = 1; //probably adjust to fit workshop bonus

  //adjust to activate/deactive resources to consider for autoCrafting
  //also can adjust which materials are considered
  // TODO: write function to handle mats not in #craftContainer
  const craftRecipes = {
    // wood: { catnip: 50 },
    // beam: { wood: 175 },
    // slab: { minerals: 250 },
    // plate: { iron: 125 },
    // steel: { iron: 100, coal: 100 },
//     concrete: { slab: 2500, steel: 25 },
//     concrete: { slab: 1500, steel: 15 }, //false
//     gear: { steel: 15 },
//     gear: { steel: 3 }, //false
//     alloy: { steel: 75, titanium: 10 },
    alloy: { steel: 3, /* titanium: 10 */ }, //false
//     scaffold: { beam: 50 },
    scaffold: { beam: 1 }, //false, but faster buildings
//     ship: { scaffold: 100, plate: 150,
//     ship: { scaffold: 1, plate: 1, //false
//             // starchart: 25
//           },
//     tanker: {
//         ship: 200,
//         alloy: 1250,
//         blueprint: 5
//     },
//     kerosene: { oil: 7500 },
//     parchment: { furs: 175 },
//     manuscript: { parchment: 25,
    manuscript: { parchment: 1,
                  // culture: 400
                },
//     compendium: { manuscript: 50,
    compendium: { manuscript: 1, //false
                  // science: 10000
                },
//     blueprint: { compendium: 25,
    blueprint: { compendium: 1, //false
                 // science: 25000
               },
//     megalith: { slab: 50, beam: 25, plate: 5 },
    megalith: { slab: 1, beam: 1, plate: .2 },  //false
  };


  function getAmount(resource) {
    let $craftableRow = craftablesKey[resource];
    let amountStr = $('td', $craftableRow)[1].innerText;
    return convertQuant(amountStr);
  }


  function craft(resource, convertCol = 1) {
    //convertCol from 1-4, not 0-3
    let $resourceRow = craftablesKey[resource],
        $craftBtn = $('td a', $resourceRow)[convertCol - 1];

    if ($craftBtn.style.display !== 'none') {
      $craftBtn.click();
      // console.log('%cCrafted: ' + resource, style.craft);
      return true;
    }
    return false;
  }


  function testRatios(resource) {
    let ratios = craftRecipes[resource];
    for (let component in ratios) {
      if (getAmount(component) * ratioModifier < getAmount(resource) * ratios[component]) { return false; }
    }
    return true;
  }


  function trade(toSell, numTrades) {
    const tradeKey = {
        minerals: {
            race: 'lizards',
            preCraft: 'beam'
        },
        iron: {
            race: 'sharks',
            preCraft: 'wood',
        },
        wood: {
            race: 'griffins',
            preCraft: 'plate',
        },
        ivory: {
            race: 'nagas',
            preCraft: 'slab',
        },
        slab: {
            race: 'zebras',
            preCraft: 'plate'
        },
        scaffold: {
            race: 'spiders',
            preCraft: 'steel'
        },
        titanium: {
            race: 'dragons',
            preCraft: 'thorium' //they give uranium
        },
    };

    let preCraft = tradeKey[toSell].preCraft,
        raceName = tradeKey[toSell].race,
        races = gamePage.diplomacy.races,
        race = races.filter(race => race.name === raceName)[0];

    craft(preCraft);
//     craft(preCraft, 2);
    setTimeout(gamePage.diplomacy.tradeMultiple.bind(gamePage.diplomacy), 250, race, numTrades);
  }

  let $resCaps = $('#resContainer .resourceRow'),
      capped = [],
      $craftables = $('#craftContainer .resourceRow'),
      craftablesKey = {};


  //build reference for DOM element by resource name
  $.each($craftables, (idx, craftable) => {
    let name = $('td', craftable)[0].innerText;
    name = name.substr(0, name.length - 1);
    craftablesKey[name] = craftable;
  });

  //Build array of capped resources
  $.each($resCaps, (idx, elem) => {
    let max = $('.maxRes', elem)[0].innerText,
        current = convertQuant($('.resAmount', elem)[0].innerText),
        name = $('.resource-name', elem)[0].innerText;
    
    max = convertQuant(max.substring(1, max.length));
    name = name.substr(0, name.length - 1);
    
//     if (max && current >= (max * .99)) {
//     if (max && current >= (max * .95)) {
    if (max && current >= (max * .90)) {
      if (name === 'catpower') {
        $('#fastHuntContainer a')[0].click();
//         console.log('%cHunted ' + new Date(Date.now()).toLocaleTimeString(), style.event);
        setTimeout(craft, 1000, 'parchment', 4);
      
      } else if (name === 'faith') {
        $('#fastPraiseContainer a').click();
        console.log('%cPraised the sun ' + new Date(Date.now()).toLocaleTimeString(), style.event);
      
      } else if (name === 'gold') {
        let seasonTradeKey = {
            Spring: 'wood',  //best ivory
            Summer: 'slab', //best minerals
            Autumn: 'wood', //best scaffold, wood
            Winter: 'slab' //best slab
        };

        let curDate = $('#calendarDiv')[0].innerText,
            start,
            end,
            curSeason;

        start = curDate.indexOf('- ') + 2;
        end = curDate.indexOf(' (');
        end = end > -1 ? end : curDate.indexOf(', ');
        curSeason = curDate.substring(start, end);

        trade(seasonTradeKey[curSeason], 10);

      } else { capped.push(name); }
    }
  });

  capped = capped
    .map(resource => cappedResourceKey[resource])
    .filter(craftable => craftable && craftable !== 'TBD');

  capped.forEach(resource => {
//     craft(resource);
    // if (resource === 'compendium' || resource === 'manuscript') {
    //   craft(resource, 3);
    // } else {
//       if (!craft(resource, 2)) { craft(resource, 1); }
      for (let i = 3; i >= 1; i--) { if (craft(resource, i)) { break; } }
    // }
//     if (resource === 'compendium') { craft('blueprint'); }
//     if (resource === 'compendium') { craft('blueprint', 4); }
  });

  for (let craftable in craftRecipes) {
    if (testRatios(craftable)) {
      // if (craftable === 'blueprint') {
      //   if (!craft('blueprint', 2)) { craft('blueprint'); }
      // }
      if (craftable === 'manuscript') {
        if (!craft('manuscript', 3)) {
          if (!craft('manuscript', 2)) {
            craft('manuscript');
          }
        }
      } else {
//       craft(craftable);
        if (!craft(craftable, 2)) { craft(craftable); }
      }
    }
  }

};


function auto(Fn, ms) {
  if (intervalIDs[Fn.name]) { clearInterval(intervalIDs[Fn.name]); }

  const defaults = {
    gatherCatnip: 20,
    buildAll: 10000,
    craftAll: 500
  };
  ms = ms || defaults[Fn.name];

  intervalIDs[Fn.name] = setInterval(Fn, ms);
  console.log('Auto ' + Fn.name + ' started');
}


function autoAll(ms) {
//   auto(gatherCatnip, ms);
  auto(buildAll, ms);
  auto(craftAll, ms);
}


function stopAuto(Fn) {
  if (intervalIDs[Fn.name]) {
    clearInterval(intervalIDs[Fn.name]);
    console.log('Auto ' + Fn.name + ' stopped');   
  } else {
    console.error('no ID for setInterval ' + Fn.name);
  }
}


function stopAll() {
//   stopAuto(gatherCatnip);
  stopAuto(buildAll);
  stopAuto(craftAll);
}


function aa(interval) { autoAll(interval); }
function sa() { stopAll(); }
function ac(interval) { auto(craftAll, interval); }
function sc() { stopAuto(craftAll); }
function ab(interval) { auto(buildAll, interval); }
function sb() { stopAuto(buildAll); }
function cat(interval) { auto(gatherCatnip, interval); }
function scat() { stopAuto(gatherCatnip); }

