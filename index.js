/*

Declare node modules

*/

const fs = require('fs'),
	path = require('path'),
	readline = require('readline'),
	captureHtml = require('./node_modules/anaplan_remote/captureHtml'),
	csvPrint = require('./node_modules/anaplan_remote/csvPrint'),
	csvObj = require('./node_modules/anaplan_remote/csvObj'),
	csv = require('csvtojson'),
	captureMetaContent = require('./node_modules/anaplan_remote/captureMetaContent'),
	htmlToJson = require('html-to-json');

const scrape = require('html-metadata');

/*

Declare user generated const

*/

const list = require("./input/URLS_with_images.json"),
	failedPath = path.join(__dirname, "output/failed/"),
	printPath = path.join(__dirname, "output/csv/"),
	altPrintPath = path.join(__dirname, "output/"),
	jsonPath = path.join(__dirname, "input/");

const csvPath = './support/';

const csvPathRoot = path.join(__dirname, '/support/');

var combinedCSVArr = ["title, url, taxonomy, publish_date, modified_date\n"];

let combineFiles = () => {
	fs.readdir( printPath, (err, files) => {
		if ( err ) {
			console.log(err);
		}
		let fileLoop = (num, flies) => {
			if ( num + 1 < flies.length ) {
				let currentFile = path.join(printPath, flies[num]);
				fs.readFile( currentFile, 'utf-8', (err, content) => {
					if ( err ) {
						console.log(err);
					}
					combinedCSVArr.push(content + "\n");
				});
				setTimeout(() => {
					num++;
					fileLoop(num, flies);
				}, 200);
				//console.log(combinedCSVs);
			} else {
				let currentFile = path.join(printPath, flies[num]);
				fs.readFile( currentFile, 'utf-8', (err, content) => {
					if ( err ) {
						console.log(err);
					}
					combinedCSVArr.push(content + "\n");
					fs.writeFile(altPrintPath + "combinedCSV.csv", combinedCSVArr.join(""), ( err ) => {
						if ( err ) {
							console.log(err);
						}
					});
				});

			}
		};
		fileLoop(1, files);
	});
};

//combineFiles();

let webScrape = () => {
	fs.readdir( csvPathRoot, (err, files) => {

		if ( err ) {
			console.log(err);
		}

		files.forEach( (filename) => {
			let currentFile = path.join(csvPathRoot, filename);
			if ( filename.indexOf('.DS') === -1 ) {
				csv().fromFile(currentFile).then((jsonObj)=>{
					let newObj = [];
					//console.log(newObj);
					let nums = 0;

					let fileLoopCSV = (contentObj, num) => {
						if ( currentFile.indexOf('ru.csv') !== -1 ) {	
							var modifier = 'ru';
						} else if ( currentFile.indexOf('de.csv') !== -1 ) {
							var modifier = 'de';
						} else if ( currentFile.indexOf('fr.csv') !== -1 ) {
							var modifier = 'fr';
						} else if ( currentFile.indexOf('jp.csv') !== -1 ) {
							var modifier = 'jp';
						}
						if ( num < contentObj.length ) {
							let obj = contentObj[num];
				    		captureMetaContent(obj.URLs.replace('anaplan.staging.wpengine', 'anaplan'), printPath, nums, failedPath, modifier, obj.Title);
				    		setTimeout(() => {
				    			num++;
				    			nums++;
				    			fileLoopCSV(contentObj, num);
				    		}, 500);
						}
					};

					fileLoopCSV(jsonObj, 0);

				});
			}
		});
	});
};

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Which function are you looking to run?\nOptions available:\nwebscrape\ncombinefiles\n\n\n\n", function(answer) {
	if ( answer === "webscrape" ) {
		webScrape();
	} else if ( answer === "combinefiles" ) {
		combineFiles();
	}
  	rl.close();
});

//webScrape();

let printRandomNumber = ( delay ) => {
	let random = Math.floor(Math.random() * 10000000);
	setTimeout( () => {
		console.log("Earth has");
		console.log("\x1b[92m", "\b\b" + random);
		console.log("\x1b[95m", "\b\byears left to exist.");
		console.log("\x1b[0m", "");
		printRandomNumber( delay );
	}, delay);
};	

//printRandomNumber( 500 );

