const fs = require('fs');
const XLSX = require('xlsx');
const XLSXStyle = require('xlsx-style');
const esbuild = require('esbuild');
const path = require('path');

/**
 * Function to extract the `routes` variable from a TypeScript file.
 */
function extractRoutesFromTS(tsFile) {
  const tempFile = path.join(__dirname, 'temp.js');
  esbuild.buildSync({
    entryPoints: [tsFile],
    outfile: tempFile,
    bundle: true,
    platform: 'node',
    format: 'cjs',
  });

  const module = require(tempFile);
  fs.unlinkSync(tempFile);

  return module.routes || [];
}

/**
 * Function to flatten a nested route structure and extract additional tracking data.
 */
function flattenRoutes(routes, parentPath = '') {
  let flattened = [];

  routes.forEach((route) => {
    let fullPath = parentPath + route.path;

    if (route.tracking && route.tracking.length > 0) {
      route.tracking.forEach((track) => {
        flattened.push({
          ID: track.id || 'N/A',
          'Tracking Description': track.description || 'N/A',
          'Tracking Type': track.type || 'N/A',
          'Page Name':
            track.type === 'page.display' ? track.pageName || 'N/A' : 'N/A',
          'Page Type':
            track.type === 'page.display' ? track.pageType || 'N/A' : 'N/A',
          'Button Type':
            track.type === 'page.click' ? track.buttonType || 'N/A' : 'N/A',
          'Action Type':
            track.type === 'page.click' ? track.actionType || 'N/A' : 'N/A',
          Actions:
            track.type === 'page.click' && track.actions
              ? track.actions.join(', ')
              : 'N/A',
        });
      });
    } else {
      flattened.push({
        ID: 'N/A',
        'Tracking Description': route.description || 'N/A',
        'Tracking Type': 'N/A',
        'Page Name': 'N/A',
        'Page Type': 'N/A',
        'Button Type': 'N/A',
        'Action Type': 'N/A',
        Actions: 'N/A',
      });
    }

    if (route.children) {
      flattened = flattened.concat(flattenRoutes(route.children, fullPath));
    }
  });

  return flattened;
}

function applyCellStyle(worksheet, cell, style) {
  if (worksheet[cell]) {
    worksheet[cell].s = style;
  }
}

function convertTsToExcel(tsFile, excelFile) {
  const routes = extractRoutesFromTS(tsFile);
  if (!routes.length) {
    console.error(
      "Error: Unable to extract routes. Ensure that 'routes' is correctly exported in the TypeScript file.",
    );
    process.exit(1);
  }

  const flattenedData = flattenRoutes(routes);

  const worksheet = XLSX.utils.json_to_sheet(flattenedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Routes');

  const headerStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 14 },
    fill: { fgColor: { rgb: '1F497D' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } },
    },
  };

  const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
  for (let C = headerRange.s.c; C <= headerRange.e.c; C++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
    applyCellStyle(worksheet, cellAddress, headerStyle);
  }

  for (let R = 1; R <= headerRange.e.r; R++) {
    const trackingTypeCell = XLSX.utils.encode_cell({ r: R, c: 2 }); // Tracking Type column index (after removing Path)
    const typeValue = worksheet[trackingTypeCell]?.v;

    if (typeValue === 'page.display') {
      let fillColor = 'E2EFDA'; // Light green for page.display rows
      for (let C = headerRange.s.c; C <= headerRange.e.c; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        applyCellStyle(worksheet, cellAddress, {
          fill: { fgColor: { rgb: fillColor } },
          font: { sz: 12 },
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } },
          },
        });
      }
    }
  }

  worksheet['!cols'] = [
    { wch: 40 }, // ID (increased width)
    { wch: 50 }, // Tracking Description
    { wch: 20 }, // Tracking Type
    { wch: 25 }, // Page Name
    { wch: 25 }, // Page Type
    { wch: 20 }, // Button Type
    { wch: 20 }, // Action Type
    { wch: 50 }, // Actions
  ];

  worksheet['!rows'] = new Array(headerRange.e.r + 1).fill({ hpt: 24 });

  XLSXStyle.writeFile(workbook, excelFile);
  console.log(
    `Excel file generated with tracking descriptions included and enhanced styling: ${excelFile}`,
  );
}

if (process.argv.length < 4) {
  console.log('Usage: node tsToExcel.js <tsFile> <excelFile>');
  process.exit(1);
}

const tsFile = process.argv[2];
const excelFile = process.argv[3];

convertTsToExcel(tsFile, excelFile);
