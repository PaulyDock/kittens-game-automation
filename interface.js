
$('#autoContainer').remove();
$('#autoStyle').remove();

cappedResourceMap = {
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

craftResourceMap = {
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

inputMap = {};


function makeAutoCapRow(resource) {
  let $autoCapRow = $(document.createElement('tr')).addClass('autoCapRow'),
      $capResName = $('<td style="width: 85px;"></td>').text(resource), //name
      $autoCapCheckbox = $('<td style="width: 17px"><input type="checkbox" style="display: block;"></td>');  //name? id?
  return $autoCapRow.append($capResName).append($autoCapCheckbox);
}

function makeAutoCraftRow(resource) {
  let $autoCraftRow = $(document.createElement('tr')).addClass('autoCraftRow'),
      $craftResName = $('<td style="width: 85px;"></td>').text(resource), //name
      $autoCraftCheckbox = $('<td style="width: 17px;"><input type="checkbox" style="display: block;"></td>'),  //name? id?
      $autoComponentRows = $('<td><table></table></td>');

  for (let component in craftResourceMap[resource]) {
    $autoComponentRows.append(makeComponentRow(resource, component));
  }

  return $autoCraftRow.append($craftResName).append($autoCraftCheckbox).append($autoComponentRows);
}

function makeComponentRow(resultResource, component) {
  let $componentRow = $(document.createElement('tr')).addClass('componentRow'),
      $componentName = $(document.createElement('td')).prop('style', 'width: 85px;').text(component),
      // $componentCheckbox = $(document.createElement('input')).prop('type', 'checkbox').prop('style', 'display: block;');
      $componentRatio = $(document.createElement('input'))
        .prop('type', 'number')
        .prop('style', 'width: 60px;')
        .prop('value', craftResourceMap[resultResource][component].toString());

  return $componentRow
    .append($componentName)
    // .append($(document.createElement('td')).append($componentCheckbox))
    .append($componentRatio);
}

//make buildings table

function makeAutoCapTable(resMap) {
  let $autoCapTable = $('<table id="autoCapTable" class="table"></table>').prop('style', 'padding: 10px 0px;');
  for (let resource in resMap) {
    $autoCapTable.append(makeAutoCapRow(resource));
  }
  return $autoCapTable;
}

function makeAutoCraftTable(resMap) {
  let $autoCraftTable = $('<table id="autoCrafTable" class="table"></table>').prop('style', 'padding: 10px 0px;');
  for (let resource in resMap) {
    $autoCraftTable.append(makeAutoCraftRow(resource));
  }
  return $autoCraftTable;
}


// add to DOM
function addAutoTable() {
  let $autoContainer = $('<div id="autoContainer"></div>');
  $autoContainer
    .append(makeAutoCapTable(cappedResourceMap))
    .append(makeAutoCraftTable(craftResourceMap));
  $('#leftColumn').append($autoContainer);  
}


function addAutoStyle() {
  let autoStyle = $(document.createElement('style')).attr('id', 'autoStyle').text(`
    .autoCraftRow > td {
      padding: 3px 0px
    }
  `);

  $('head').append(autoStyle);
}

addAutoTable();
addAutoStyle();

