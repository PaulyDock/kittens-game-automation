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
    B: 1000000000,
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
    'Pasture', //catnip, wood
    'Aqueduct', //minerals
    'Hut', //wood
    'Log House', //wood, minerals
//     'Mansion', //slab, steel, titanium
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
    'Accelerator', //titanium, concrete, uranium
//     'Steamworks', //steel, gear, blueprint
//     'Magneto', //alloy, gear, blueprint
    'Smelter', //minerals
//     'Calciner', //steel, titanium, blueprint, oil
    "Factory", //titanium, plate, concrete
//     "Reactor", //titanium, plate, concrete, blueprint
//     'Amphitheatre', //wood, minerals, parchment
//     'Broadcast Tower', //iron, titanium
    'Chapel', //minerals, culture, parchment
    'Temple', //slab, plate, gold, manuscript
    'Workshop', //wood, minerals
    'Tradepost', //wood, minerals, gold
    'Mint', //minerals, plate, gold
    'Unic. Pasture', //unicorns
//     'Ziggurat', //megalith(slab, beam, plate), scaffold, blueprint
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
    'titanium': 'alloy',
    // 'gold': 'TBD',
    'oil': 'kerosene',
    // 'uranium': 'TBD',
    // 'catpower': 'TBD', //auto-hunts special case
    'science': 'compendium', //risky
    'culture': 'manuscript', //risky
    // 'faith': 'TBD', //auto-praise special case
    // 'kittens': 'TBD',
  };

  const ratioModifier = 6.00; //probably adjust to fit workshop bonus

  //adjust to activate/deactive resources to consider for autoCrafting
  //also can adjust which materials are considered
  // TODO: write function to handle mats not in #craftContainer
  const craftRecipes = {
    // wood: { catnip: 50 },
    // beam: { wood: 175 },
    // slab: { minerals: 250 },
    // plate: { iron: 125 },
    // steel: { iron: 100, coal: 100 },
    concrete: { slab: 2500, steel: 25 },
//     gear: { steel: 15 },
    gear: { steel: 120 }, //false
    // alloy: { steel: 75, titanium: 10 },
//     scaffold: { beam: 50 },
    scaffold: { beam: 1 }, //false, but faster buildings
//     ship: { scaffold: 100, plate: 150,
//             // starchart: 25
//           },
//     kerosene: { oil: 7500 },
    // parchment: { furs: 175 },
//     manuscript: { parchment: 125,
//                   // culture: 400
//                 },
//     compendium: { manuscript: 50,
//                   // science: 10000
//                 },
    blueprint: { compendium: 25,
                 // science: 25000
               },
//     megalith: { slab: 50, beam: 25, plate: 5 },
//     megalith: { slab: 150, beam: 75, plate: 15 },  //false
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


  function trade(toSell) {
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
            preCraft: 'TBD' //they give uranium
        },
    };

    let preCraft = tradeKey[toSell].preCraft,
        raceName = tradeKey[toSell].race,
        races = gamePage.diplomacy.races,
        race = races.filter(race => race.name === raceName)[0];

//     craft(preCraft);
    craft(preCraft);
    setTimeout(gamePage.diplomacy.tradeMultiple.bind(gamePage.diplomacy), 250, race, 1);
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
    
    if (max && current >= (max * .99)) {
      if (name === 'catpower') {
        $('#fastHuntContainer a')[0].click();
        console.log('%cHunted ' + new Date(Date.now()).toLocaleTimeString(), style.event);
        setTimeout(craft, 1000, 'parchment', 4);
      
      } else if (name === 'faith') {
        $('#fastPraiseContainer a').click();
        console.log('%cPraised the sun ' + new Date(Date.now()).toLocaleTimeString(), style.event);
      
      } else if (name === 'gold') {
        trade('ivory');
//         trade('slab');
//         trade('scaffold');

      } else { capped.push(name); }
    }
  });

  capped = capped
    .map(resource => cappedResourceKey[resource])
    .filter(craftable => craftable && craftable !== 'TBD');

  capped.forEach(resource => {
//     craft(resource);
    if (!craft(resource) && resource === 'compendium') { craft('blueprint'); }
  });

  for (let craftable in craftRecipes) {
    if (testRatios(craftable)) { craft(craftable); }
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
  auto(buildAll);
  auto(craftAll);
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


function aa() { autoAll(); }
function sa() { stopAll(); }
function ac() { auto(craftAll); }
function sc() { stopAuto(craftAll); }
function ab() { auto(buildAll); }
function sb() { stopAuto(buildAll); }
function cat() { auto(gatherCatnip); }
function scat() { stopAuto(gatherCatnip); }

