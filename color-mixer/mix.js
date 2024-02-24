function blendColors(colorA, colorB, percentage) {
  let ratio = percentage / 100;
  let hex = function(x) {
    x = x.toString(16);
    return (x.length === 1) ? '0' + x : x;
  };

  let r = Math.ceil(parseInt(colorA.substring(1, 3), 16) * ratio + parseInt(colorB.substring(1, 3), 16) * (1 - ratio));
  let g = Math.ceil(parseInt(colorA.substring(3, 5), 16) * ratio + parseInt(colorB.substring(3, 5), 16) * (1 - ratio));
  let b = Math.ceil(parseInt(colorA.substring(5, 7), 16) * ratio + parseInt(colorB.substring(5, 7), 16) * (1 - ratio));

  return {
    hex: '#' + hex(r) + hex(g) + hex(b),
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: rgbToHSL(r, g, b)
  };
}

function rgbToHSL(r, g, b){
  r /= 255, g /= 255, b /= 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if(max === min){
    h = s = 0;
  }else{
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  s = s*100;
  s = Math.round(s);
  l = l*100;
  l = Math.round(l);
  h = Math.round(360*h);

  return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
}

function createTable() {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const headerRow = document.createElement('tr');
  const headers = ['Color Cell', 'RGB', 'Hex', 'HSL'];

  headers.forEach(text => {
    let th = document.createElement('th');
    th.appendChild(document.createTextNode(text));
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
}

function displayMixedColors() {
  const color1 = document.getElementById('color1').value;
  const color2 = document.getElementById('color2').value;
  const mixContainer = document.getElementById('mix-container');
  mixContainer.innerHTML = '';

  let table = createTable();
  mixContainer.appendChild(table);

  for (let i = 0; i <= 100; i += (100 / 30)) {
    let row = table.insertRow();
    let mixedColor = blendColors(color1, color2, i);

    let colorCell = row.insertCell();
    colorCell.className = 'color-cell';
    colorCell.style.backgroundColor = mixedColor.hex;

    let rgbCell = row.insertCell();
    rgbCell.appendChild(document.createTextNode(mixedColor.rgb));

    let hexCell = row.insertCell();
    hexCell.appendChild(document.createTextNode(mixedColor.hex));

    let hslCell = row.insertCell();
    hslCell.appendChild(document.createTextNode(mixedColor.hsl));
  }
}

document.getElementById('color1').addEventListener('input', displayMixedColors);
document.getElementById('color2').addEventListener('input', displayMixedColors);

window.addEventListener('DOMContentLoaded', displayMixedColors);