//For use with Kittens Game:  http://bloodrizer.ru/games/kittens/#

const style = {
  craft: 'color: blue',
  build: 'color: green; font-weight: bold',
  event: ''
};


function getActiveTab() {
  return $('.tabsContainer .activeTab')[0].innerText;
}


function autoCatnip(ms = 20) {
  if (getActiveTab() === 'Bonfire') {
    $('.bldGroupContainer .btn')[0].click();
    setTimeout(autoCatnip, ms, ms);
  }
}


function autoBuild() {
  if (getActiveTab() !== 'Bonfire') { return; }

  //adjust to determine which buildings are checked for autoBuild
  const buildPriorities = [
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
    // 'Quarry', //scaffold, steel, slab
    'Lumber Mill', //wood, minerals, iron
    // 'Oil Well', //steel, gear, scaffold
    // 'Steamworks', //steel, gear, blueprint
    // 'Magneto', //alloy, gear, blueprint
    'Smelter', //minerals
    // 'Calciner', //steel, titanium, blueprint, oil
    // "Factory", //titanium, plate, concrete
    // 'Amphitheatre', //wood, minerals, parchment
    'Chapel', //minerals, culture, parchment
    'Temple', //slab, plate, gold, manuscript
    'Workshop', //wood, minerals
    'Tradepost', //wood, minerals, gold
    'Mint', //minerals, plate, gold
    'Unic. Pasture', //unicorns
    'Ziggurat', //megalith(slab, beam, plate), scaffold, blueprint
  ];

  let $clickableBldgs = $('.bldGroupContainer .btn').not('.disabled'),
      bldgNameBtnKey = {};

  $.each($clickableBldgs, (idx, elem) => {
    let bldgName = $('.btnContent span', elem)[0].innerText,
        parenLoc = bldgName.indexOf('(');
    bldgName = parenLoc > -1 ? bldgName.substr(0, parenLoc - 1) : bldgName;
    bldgNameBtnKey[bldgName] = elem;
  });

  buildPriorities.forEach(building => {
    let $rdyBldg = bldgNameBtnKey[building];
    if ($rdyBldg) {
      $rdyBldg.click();
      console.log('%cBuilt: ' + building, style.build);
    }
  });

  setTimeout(autoBuild, 5000);
}


function autoCraft() {
  if (getActiveTab() !== 'Bonfire') { return; }

  let $observeBtn = $('#observeBtn')[0];
  if ($observeBtn) {
    $observeBtn.click();
    console.log('Observation made');
  }

  //adjust to activate which capped resources autoCraft when complete
  const cappedResourceKey = {
    'catnip': 'wood',
    'wood': 'beam',
    'minerals': 'slab',
    'coal': 'steel',
    'iron': 'plate',
    'titanium': 'alloy',
    // 'gold': 'TBD',
    // 'oil': 'TBD',
    // 'catpower': 'TBD', //auto-hunts special case
    'science': 'compendium', //risky
    // 'culture': 'manuscript', //risky
    // 'faith': 'TBD', //auto-praise special case
    // 'kittens': 'TBD',
  };

  const ratioModifier = 4.05; //probably adjust to fit workshop bonus

  //adjust to activate/deactive resources to consider for autoCrafting
  //also can adjust which materials are considered
  // TODO: write function to handle mats not in #craftContainer
  const craftRecipes = {
    // wood: { catnip: 50 },
    // beam: { wood: 175 },
    // slab: { minerals: 250 },
    // plate: { iron: 125 },
    // steel: { iron: 100, coal: 100 },
    // concrete: { slab: 2500, steel: 25 },
    // gear: { steel: 15 },
    // alloy: { steel: 75, titanium: 10 },
    scaffold: { beam: 50 },
    ship: { scaffold: 100, plate: 150,
            // starchart: 25
          },
    // parchment: { furs: 175 },
    manuscript: { parchment: 125,
                  // culture: 400
                },
    // compendium: { manuscript: 50,
    //               // science: 10000
    //             },
    blueprint: { compendium: 25,
                 // science: 25000
               },
    megalith: { slab: 50, beam: 25, plate: 5 }
  };


  function getAmount(resource) {
    let $craftableRow = craftablesKey[resource];
    let amountStr = $('td', $craftableRow)[1].innerText;
    return convertQuant(amountStr);
  }


  function craft(resource, convertCol) {
    //convertCol from 1-4, not 0-3
    let $resourceRow = craftablesKey[resource],
        $craftBtn = $('td a', $resourceRow)[convertCol - 1];
    
    if ($craftBtn.style.display !== 'none') {
      $craftBtn.click();
      // console.log('%cCrafted: ' + resource, style.craft);
    }
  }


  function testRatios(resource) {
    let ratios = craftRecipes[resource];
    for (let component in ratios) {
      if (getAmount(component) * ratioModifier < getAmount(resource) * ratios[component]) { return false; }
    }
    return true;
  }


  let $resCaps = $('#resContainer .resourceRow'),
      capped = [],
      $craftables = $('#craftContainer .resourceRow'),
      craftablesKey = {};

  //Remove after refactor
  let craftClickMap = $.map($craftables, craftable => {
    let name = $('td', craftable)[0].innerText;
    return name.substr(0, name.length - 1);
  });

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
    
    if (max && max !== 0 && max !== '' && current >= max) {
      if (name === 'catpower') {
        $('#fastHuntContainer a')[0].click();
        console.log('%cHunted', style.event);
        setTimeout(craft, 1000, 'parchment', 4);
      
      } else if (name === 'faith') {
        $('#fastPraiseContainer a').click();
        console.log('%cPraised the sun', quickEventStyle);
      
      } else { capped.push(name); }
    }
  });

  capped = capped
    .map(resource => cappedResourceKey[resource])
    .filter(craftable => craftable && craftable !== 'TBD');

  capped.forEach(resource => craft(resource, 1));

  for (let craftable in craftRecipes) {
    if (testRatios(craftable)) { craft(craftable, 1); }
  }

  setTimeout(autoCraft, 1000);  
};

function autoAll() {
  // autoCatnip();
  autoBuild();
  autoCraft();
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
