const colorPicker = document.getElementById('colorPicker');
const colorDetails = document.getElementById('colorDetails');
const textSamples = document.querySelectorAll('.text-example');

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function rgbToHex(r, g, b) {
  const toHex = c => ('0' + Math.round(c).toString(16)).slice(-2);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function createCell(text) {
  const cell = document.createElement('td');
  cell.textContent = text;
  return cell;
}

function createColorCell(hex) {
  const cell = document.createElement('td');
  cell.style.backgroundColor = hex;
  return cell;
}

function getContrastYIQ(hexColor) {
  const r = parseInt(hexColor.substr(1,2), 16);
  const g = parseInt(hexColor.substr(3,2), 16);
  const b = parseInt(hexColor.substr(5,2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? 'black' : 'white';
}

function updateTextColorSamples(color) {
  textSamples.forEach(sample => {
    sample.style.backgroundColor = color;
  });
}

function updateOpacityVariants(hexColor) {
  const opacityVariants = document.getElementById('opacityVariants');
  opacityVariants.innerHTML = '';
  for (let opacity = 1; opacity >= 0; opacity -= 0.1) {
    const opacityHex = Math.floor(opacity * 255).toString(16).padStart(2, '0').toUpperCase();
    const colorWithOpacity = `${hexColor}${opacityHex}`;
    const variantElement = document.createElement('div');
    variantElement.style.backgroundColor = colorWithOpacity;
    variantElement.style.color = getContrastYIQ(hexColor);
    variantElement.style.margin = '10px 0';
    variantElement.style.padding = '10px';
    variantElement.textContent = `Opacity: ${opacity.toFixed(1)} - ${colorWithOpacity}`;
    opacityVariants.appendChild(variantElement);
  }
}

function generateHueChart(originalColor) {
  const [r, g, b] = hexToRgb(originalColor);
  const [originalHue, saturation, lightness] = rgbToHsl(r, g, b);
  const hueChartTable = document.getElementById('hueChart');
  hueChartTable.innerHTML = '';

  const table = document.createElement('table');
  hueChartTable.appendChild(table);
  const thead = document.createElement('thead');
  table.appendChild(thead);
  const headerRow = document.createElement('tr');
  thead.appendChild(headerRow);
  const headers = ['Hue', 'Color', 'RGB Value', 'Hex Value', 'HSL Value'];
  headers.forEach(headerText => {
    const header = document.createElement('th');
    header.textContent = headerText;
    headerRow.appendChild(header);
  });

  const tbody = document.createElement('tbody');
  table.appendChild(tbody);

  for (let i = 0; i < 360; i += 5) {
    const [hueR, hueG, hueB] = hslToRgb(i, saturation, lightness);
    const hex = rgbToHex(hueR, hueG, hueB);
    const rgbValue = `RGB(${hueR}, ${hueG}, ${hueB})`;
    const hslValue = `HSL(${i}, ${saturation}%, ${lightness}%)`;

    const row = document.createElement('tr');
    row.appendChild(createCell(`${i}°`));
    row.appendChild(createColorCell(hex));
    row.appendChild(createCell(rgbValue));
    row.appendChild(createCell(hex));
    row.appendChild(createCell(hslValue));

    tbody.appendChild(row);
  }
}


function updateSaturationChart(hexColor) {
    const [r, g, b] = hexToRgb(hexColor);
    const [h, s, l] = rgbToHsl(r, g, b);
    const saturationChart = document.getElementById('saturationChart');
    saturationChart.innerHTML = '';

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Saturation %', 'Color', 'HSL Value', 'RGB Value', 'Hex Value'];

    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    for (let newSaturation = 0; newSaturation <= 100; newSaturation += 10) {
        const [newR, newG, newB] = hslToRgb(h, newSaturation, l);
        const newHex = rgbToHex(newR, newG, newB);
        const hslValue = `HSL(${h}, ${newSaturation}%, ${l}%)`;
        const rgbValue = `RGB(${newR}, ${newG}, ${newB})`;

        const row = document.createElement('tr');
        row.appendChild(createCell(`${newSaturation}%`));
        row.appendChild(createColorCell(newHex));
        row.appendChild(createCell(hslValue));
        row.appendChild(createCell(rgbValue));
        row.appendChild(createCell(newHex));

        tbody.appendChild(row);
    }

    table.appendChild(tbody);

    saturationChart.appendChild(table);
}


function updateLightnessChart(hexColor) {
  const [r, g, b] = hexToRgb(hexColor);
  const [h, s] = rgbToHsl(r, g, b);
  const lightnessChart = document.getElementById('lightnessChart');
  lightnessChart.innerHTML = '';

  const table = document.createElement('table');
  lightnessChart.appendChild(table);

  const thead = document.createElement('thead');
  table.appendChild(thead);
  const headerRow = document.createElement('tr');
  thead.appendChild(headerRow);
  const headers = ['Lightness %', 'Color', 'HSL Value', 'RGB Value', 'Hex Value'];
  headers.forEach(headerText => {
    const header = document.createElement('th');
    header.textContent = headerText;
    headerRow.appendChild(header);
  });

  const tbody = document.createElement('tbody');
  table.appendChild(tbody);

  for (let l = 0; l <= 100; l += 10) {
    const [r, g, b] = hslToRgb(h, s, l);
    const hex = rgbToHex(r, g, b);
    const hslValue = `HSL(${h}, ${s}%, ${l}%)`;
    const rgbValue = `RGB(${r}, ${g}, ${b})`;

    const row = document.createElement('tr');
    row.appendChild(createCell(`${l}%`));
    row.appendChild(createColorCell(hex));
    row.appendChild(createCell(hslValue));
    row.appendChild(createCell(rgbValue));
    row.appendChild(createCell(hex));

    tbody.appendChild(row);
  }
}

function updateColorDetails() {
  const color = colorPicker.value;
  colorDetails.innerHTML = `
    <h3>Selected Color: ${color.toUpperCase()}</h3>
    <p>Hex: ${color.toUpperCase()}</p>
    <p>RGB: ${hexToRgb(color).join(', ')}</p>
  `;

  updateTextColorSamples(color);
  updateOpacityVariants(color);
  generateHueChart(color);
  updateLightnessChart(color);
  updateSaturationChart(color);
}


colorPicker.addEventListener('input', updateColorDetails);

updateColorDetails();
