var walker = require('walker');
var extensionList = ['xlsx'];

exports.directoryWalk = function (path, callback, progressStep = 100) {
	let entries = [];

	let callbackValid = typeof callback === 'function';

	return new Promise((resolve, reject) => {
		walker(path)
			.on('file', (entry, stat) => {
				let isExcle = false;
				const messArr = entry.split('.');
				const extension = messArr[messArr.length - 1];
				if (stat.size > 1024 && extensionList.includes(extension)) {
					entries.push({
						path: entry,
						size: stat.size,
						dir: false
					});

					if (callbackValid) {
						if (entries.length % progressStep === 0) {
							callback(entries.length);
						}
					}
				}
			})
			.on('error', (error, entry, stat) => {
				reject(error, entry, stat);
			})
			.on('end', () => {
				resolve(entries);
			}
			);
	});
};
