import fetch from "node-fetch";
import { parse } from "node-html-parser";
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const xslx = require("xlsx");
const puppeteer = require('puppeteer-core');

const axios = require('axios');

const download_image = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
);

const getData = async () => {
	let cycletechCSV = "";
	const setting = fs.readFileSync("./urllist.json", "utf-8");
	const settingCYCLE = JSON.parse(setting);
	const browser = await puppeteer.launch({headless: true, args:['--no-sandbox']});
	const page = await browser.newPage();
	await page.setDefaultNavigationTimeout(0);
	await page.goto(settingCYCLE.MAINURLCYCLETECH , { waitUntil: 'domcontentloaded' }); // wait until page load
	await page.click(settingCYCLE.CYCLETECHSELECTORMAINLOGIN);
	await page.type(settingCYCLE.CYCLETECHSELECTORMAINLOGINUSERNAME, settingCYCLE.CYCLETECHUN);
	await page.type(settingCYCLE.CYCLETECHSELECTORMAINLOGINPASSWORD, settingCYCLE.CYCLETECHPW);
	// click and wait for navigation
	await Promise.all([
		page.click(settingCYCLE.CYCLETECHSELECTORMAINLOGINSUBMIT),
		page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
	]);
	const articlelistimg = [];
	const articlelist = [];
	const bicyclelist = [];
	const headlightlist = [];
	const headlightebikelist = [];
	await page.setRequestInterception(true);
	page.on('request', (request) => {
		if (['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
			request.abort();
		} else {
			request.continue();
		}
	});
	
	for (let i = 0; i < settingCYCLE.SUBURLBICYCLELIST.length; i++){
		await page.goto(settingCYCLE.SUBURLBICYCLELIST[i], { waitUntil: 'load' }); // wait until page load
		const products =  await page.$$('.artnumberlink');
		
		for (const productdetail of products){
			let value = await page.evaluate(el => el.textContent, productdetail);
			value = value.replace(/^\s+|\s+$/gm,'');
			value = value.replace(/(\r\n|\n|\r)/gm, "");
			let valuedetail = value.split('Urspr')
			valuedetail[0] = valuedetail[0].replace('Artikel:', '');
			bicyclelist.push(valuedetail[0]);
		}
	}
	
	for (let i = 0; i < settingCYCLE.SUBURLHEADLIGHT.length; i++){
		await page.goto(settingCYCLE.SUBURLHEADLIGHT[i], { waitUntil: 'load' }); // wait until page load
		const products =  await page.$$('.artnumberlink');
		
		for (const productdetail of products){
			let value = await page.evaluate(el => el.textContent, productdetail);
			value = value.replace(/^\s+|\s+$/gm,'');
			value = value.replace(/(\r\n|\n|\r)/gm, "");
			let valuedetail = value.split('Urspr')
			valuedetail[0] = valuedetail[0].replace('Artikel:', '');
			headlightlist.push(valuedetail[0]);
		}
	}
	
	for (let i = 0; i < settingCYCLE.SUBURLLISTCYCLETECH.length; i++){
		await page.goto(settingCYCLE.SUBURLLISTCYCLETECH[i], { waitUntil: 'load' }); // wait until page load
		const products =  await page.$$('.listart');
		
		for (const productdetail of products){
			let value = await productdetail.$eval('.artnumberlink', el => el.textContent);
			const imgs = await productdetail.$eval('img', img => img.src);
			value = value.replace(/^\s+|\s+$/gm,'');
			value = value.replace(/(\r\n|\n|\r)/gm, "");
			let valuedetail = value.split('Urspr')
			valuedetail[0] = valuedetail[0].replace('Artikel:', '');
			articlelist.push(valuedetail[0]);
			articlelistimg.push([valuedetail[0], imgs]);
		}
	}
	
	for (let i = 0; i < headlightlist.length; i++){
		await page.goto(`https://www.cycle-tech.de/webwinkel/produkte/details/?artdetail=${headlightlist[i]}&webgroupfilter=`, { waitUntil: 'domcontentloaded' });
		let STOCK = await page.$eval(settingCYCLE.CYCLETECHSELECTORSTOCK, (element) => {
									return element.innerText});
		STOCK = STOCK.replace(/^\s+|\s+$/gm,'');
		STOCK = STOCK.replace(/(\r\n|\n|\r)/gm, "");
		if (settingCYCLE.CYCLETECHINSTOCKTEXT.includes(STOCK)) {
		} else {
			continue;
		}
		let DESCRIPTION = await page.$eval(settingCYCLE.CYCLETECHSELECTORDESCRIPTION, (element) => {
								return element.innerText});
		DESCRIPTION = DESCRIPTION.replace(/(\r\n|\n|\r)/gm, "");
		for (let j = 0; j < settingCYCLE.HEADLIGHTINCLUDETEXT.length; j++){
			if (DESCRIPTION.search(settingCYCLE.HEADLIGHTINCLUDETEXT[j]) >= 0){
				headlightebikelist.push(headlightlist[i]);
				console.log(DESCRIPTION);
				continue;
			}
		}
		
	}
	for (let i = 0; i < articlelist.length; i++){
		
		if (headlightlist.includes(articlelist[i]) && (headlightebikelist.includes(articlelist[i]) == false)){
			console.log("headlights not included : " + articlelist[i]);
			continue;
		}
		console.log(`https://www.cycle-tech.de/webwinkel/produkte/details/?artdetail=${articlelist[i]}&webgroupfilter=`);
		await page.goto(`https://www.cycle-tech.de/webwinkel/produkte/details/?artdetail=${articlelist[i]}&webgroupfilter=`, { waitUntil: 'domcontentloaded' });
		
		let STOCK = await page.$eval(settingCYCLE.CYCLETECHSELECTORSTOCK, (element) => {
									return element.innerText});
		STOCK = STOCK.replace(/^\s+|\s+$/gm,'');
		STOCK = STOCK.replace(/(\r\n|\n|\r)/gm, "");
		if (settingCYCLE.CYCLETECHINSTOCKTEXT.includes(STOCK)) {
		} else {
			continue;
		}
		
		let EAN = await page.$eval(settingCYCLE.CYCLETECHSELECTOREAN, (element) => {
									return element.innerText});
		let EANTEXT = "";
		if (((" " + EAN).split("EAN: ").length) > 1){
			let EANSPLIT = (" " + EAN).split("EAN: ");
			EANTEXT = EANSPLIT[EANSPLIT.length - 1];
			let DESCRIPTION = await page.$eval(settingCYCLE.CYCLETECHSELECTORDESCRIPTION, (element) => {
									return element.innerText});
			DESCRIPTION = DESCRIPTION.replace(/(\r\n|\n|\r)/gm, "");
			DESCRIPTION = DESCRIPTION.replace(";", ",");
			let PRICE = await page.$eval(settingCYCLE.CYCLETECHSELECTORPRICE, (element) => {
										return element.innerText});
			let PRICETEXTSTR = PRICE.toString();
			PRICETEXTSTR = PRICETEXTSTR.replace(/(\r\n|\n|\r)/gm, "")
			console.log(PRICETEXTSTR);
			let PRICESPLIT = PRICETEXTSTR.split(/\u20ac/g);
			console.log(PRICESPLIT);
			let PRICETEXT = PRICESPLIT[PRICESPLIT.length - 1];
			console.log(PRICETEXT);
			PRICETEXT = parseFloat((PRICETEXT.replace(".","")).replace(",", ".")).toFixed(2);
			console.log(PRICETEXT);
			if (bicyclelist.includes(articlelist[i])){
				PRICETEXT = calculateCustomerPriceBIKE(parseFloat(PRICETEXT));
				console.log("bicycle : " + articlelist[i]);
			} else {
				PRICETEXT = calculateCustomerPrice(parseFloat(PRICETEXT));
			}
			let EXCLUDEDESCRIPTION = false;
			for (let h = 0; h < settingCYCLE.DESCRIPTIONEXCLUDETEXT.length; h++){
				
				if (DESCRIPTION.match(settingCYCLE.DESCRIPTIONEXCLUDETEXT[h]) !== null){
					EXCLUDEDESCRIPTION = true;
					for (let k = 0; k < settingCYCLE.HEADLIGHTINCLUDETEXT.length; k++){
						if (DESCRIPTION.match(settingCYCLE.HEADLIGHTINCLUDETEXT[k]) !== null){
							EXCLUDEDESCRIPTION = false;
							continue;
						}
					}
				}
			}
			if (EXCLUDEDESCRIPTION){
				continue;
			}
			let imgflg = false;
			console.log(articlelist[i]);
			let IMGURL = articlelistimg[i][1];
			
			let imgdownload = await download_image(IMGURL, "cycletechimg/Cycletech-" + articlelist[i] + ".jpg");
			console.log(articlelistimg[i][1]);
			cycletechCSV += `${articlelist[i]};${DESCRIPTION};${EANTEXT};${PRICETEXT};\n`;
		} else {
			continue;
		}	
	}
	browser.close();
	fs.writeFileSync("cycletech.csv", cycletechCSV);
	console.log("done");
	
	function calculateCustomerPriceBIKE(num) {
		let price = (num + ((num / 100) * 41) + 70).toFixed(2);
		return price;
	}
	
	function calculateCustomerPrice(num) {
		let price = (num + ((num / 100) * 41) + 10).toFixed(2);
		return price;
	}
}

getData();


setInterval(() => {
	getData();
}, 5 * 60 * 60 * 1000);
