// polyfills required by exceljs
require('core-js/modules/es.promise');
// require('core-js/modules/es.string.includes');
// require('core-js/modules/es.object.assign');
// require('core-js/modules/es.object.keys');
// require('core-js/modules/es.symbol');
// require('core-js/modules/es.symbol.async-iterator');
require('regenerator-runtime/runtime');

var { columns, positions } = require('../constants/index');
var ExcelJS = require('exceljs/dist/es5/exceljs.bare');

function createExcelWorkbook() {
	const workbook = new ExcelJS.Workbook();
	const date = new Date();
	workbook.creator = 'excel-file-merger';
	workbook.lastModifiedBy = 'excel-file-merger';
	workbook.created = date;
	workbook.modified = date;
	workbook.lastPrinted = date;
	return workbook;
};

function addSheetToWorkbook(workbook, sheetName = 'Sheet1') {
	return workbook.addWorksheet(sheetName);
}

function writeExcelToDisk(workbook, name) {
	workbook.xlsx.writeFile(name);
}

function getExcelData(path) {
	return new Promise(function (resolve, reject) {
		createExcelWorkbook()
			.xlsx
			.readFile(path)
			.then(function (workbook) {
				const worksheet = workbook.getWorksheet('data');
				resolve(
					positions.map(function ([row, col]) {
						return worksheet
							.getRow(row)
							.getCell(col)
							.value
							.result;
					})
				)
			})
	})
}

exports.mergeExcel = function (files, directoryPath) {
	const workbook = createExcelWorkbook();
	const sheet = addSheetToWorkbook(workbook);
	sheet.columns = [
		{
			header: 'path',
			key: 'path',
			width: 35,
		},
		...columns.map(function (column) {
			return {
				header: column,
				key: column,
				width: 18,
			}
		})
	];

	return Promise
		.all(files.map(file => getExcelData(file.path)))
		.then(function (filesData) {
			filesData.forEach(function (fileData, index) {
				const row = {
					path: files[index].path,
				};
				columns.forEach(function (column, index) {
					row[column] = fileData[index];
				})
				sheet.addRow(row);
			});
			const pathArray = directoryPath.split('/');
			const name = pathArray.pop();
			writeExcelToDisk(
				workbook,
				pathArray.join('/') + '/' + name + '_' + Date.now() + '.xlsx',
			)
		});

};