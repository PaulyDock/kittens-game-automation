$autoContainer = $('<div id="autoContainer"></div>');

//make capped resources table
$autoCapTable = $('<table id="autoCapTable" class="table"></table>');
// $autoCapRow = $('<tr class="autoCapRow"></tr>');
// $capResName = $('<td style="width: 75px; color: white;">cap</td>'); //name
// $autoCapCheckbox = $('<td style="width: 17px"><input type="checkbox" style="display: block;"></td>')  //name? id?

// $autoCapRow.append($capResName).append($autoCapCheckbox);
// $autoCapTable.append($autoCapRow);


//make craft resources table
$autoCraftTable = $('<table id="autoCrafTable" class="table"></table>');

// $autoCraftRow = $('<tr class="autoCraftRow"></tr>');
// $craftResName = $('<td style="width: 75px; color: white;">craft</td>'); //name
// $autoCraftCheckbox = $('<td style="width: 17px"><input type="checkbox" style="display: block;"></td>')  //name? id?

// $autoCraftRow.append($craftResName).append($autoCraftCheckbox);
// $autoCraftTable.append($autoCraftRow);
cappedResourcesMap = {
  'catnip': 'wood',
  'wood': 'beam',
  'minerals': 'slab',
  'coal': 'steel',
  'iron': 'plate',
  'titanium': 'alloy',
  'gold': 'TBD',
  'oil': 'kerosene',
  'uranium': 'thorium',
  'unobtainium': 'eludium',
  'catpower': 'TBD', //auto-hunts special case
  'science': 'compendium', //risky
  'culture': 'manuscript', //risky
  'faith': 'TBD', //auto-praise special case
  'kittens': 'TBD',
};

craftResourcesMap = {
  wood: {
    catnip: 50 //100 or 50
  },
  beam: {
    wood: 175 //175
  },
  slab: {
    minerals: 250 //250
  },
  plate: {
    iron: 125 //125
  },
  steel: {
    iron: 100, //100
    coal: 100 //100
  },
  concrete: { 
    slab: 1500, //2500
    steel: 15 //25
  },
  gear: {
    steel: 3 //15
  },
  alloy: {
    steel: 3, //75
    titanium: 10 //10
  },
  scaffold: {
    beam: 1 //50
  },
  ship: {
    scaffold: 1, //100
    plate: 1, //150
    starchart: 25 //25
  },
  tanker: {
    ship: 200, //200
    alloy: 1250, //1250
    blueprint: 5 //5
  },
  kerosene: {
    oil: 7500 //7500
  },
  eludium: {
    alloy: 2500, //2500
    unobtainium: 1000 //1000
  },
  parchment: {
    furs: 175 //175
  },
  manuscript: {
    parchment: 1, //25
    culture: 400 //400
  },
  compendium: {
    manuscript: 1, //50
    science: 10000 //10000
  },
  blueprint: {
    compendium: 1, //25
    science: 25000
  },
  megalith: {
    slab: 1, //50
    beam: 1, //25
    plate: .2 //5
  }
};



function makeAutoCapRow(resource) {
  let $autoCapRow = $('<tr class="autoCapRow"></tr>');
  let $capResName = $('<td style="width: 75px; color: white;"></td>').text(resource); //name
  let $autoCapCheckbox = $('<td style="width: 17px"><input type="checkbox" style="display: block;"></td>')  //name? id?

  //set parameters
  //append elements
  return $autoCapRow.append($capResName).append($autoCapCheckbox);
}

function makeAutoCraftRow(resource) {
  let $autoCraftRow = $('<tr class="autoCraftRow"></tr>');
  let $craftResName = $('<td style="width: 75px; color: white;"></td>').text(resource); //name
  let $autoCraftCheckbox = $('<td style="width: 17px"><input type="checkbox" style="display: block;"></td>')  //name? id?

  //set parameters
  //append elements
  return $autoCraftRow.append($craftResName).append($autoCraftCheckbox);
}
//make buildings table

function makeAutoCapTable(resMap) {
  for (resource in resMap) {
    $autoCapTable.append(makeAutoCapRow(resource));
  }
  return $autoCapTable;
}

function makeAutoCraftTable(resMap) {
  for (resource in resMap) {
    $autoCraftTable.append(makeAutoCraftRow(resource));
  }
  return $autoCraftTable;
}

$autoCraftTable.append(makeAutoCraftRow('craftRes'));

// add to DOM
$autoContainer
  .append(makeAutoCapTable(cappedResourcesMap))
  .append(makeAutoCraftTable(craftResourcesMap));
$('#leftColumn').append($autoContainer);
