// polyfills required by exceljs
require('core-js/modules/es.promise');
// require('core-js/modules/es.string.includes');
// require('core-js/modules/es.object.assign');
// require('core-js/modules/es.object.keys');
// require('core-js/modules/es.symbol');
// require('core-js/modules/es.symbol.async-iterator');
require('regenerator-runtime/runtime');

var ExcelJS = require('exceljs/dist/es5/exceljs.bare');


exports.mergeExcel = function (files) {
	const workbook = new ExcelJS.Workbook();
	const date = new Date();
	workbook.creator = 'excel-file-merger';
	workbook.lastModifiedBy = 'excel-file-merger';
	workbook.created = date;
	workbook.modified = date;
	workbook.lastPrinted = date;


	const sheet = workbook.addWorksheet('sheet merge');

	sheet.columns = [
		{ header: 'Id', key: 'id', width: 10 },
		{ header: 'Name', key: 'name', width: 32 },
		{ header: 'D.O.B.', key: 'dob', width: 15, }
	];

	sheet.addRow({ id: 1, name: 'John Doe', dob: new Date(1970, 1, 1) });
	sheet.addRow({ id: 2, name: 'Jane Doe', dob: new Date(1965, 1, 7) });

	workbook.xlsx.writeFile('filename.xlsx');
};