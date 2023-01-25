import fetch from "node-fetch";
import { parse } from "node-html-parser";
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const xslx = require("xlsx");

// function to get the raw data
const getRawData = (URL) => {
	return fetch(URL)
		.then((response) => response.text())
		.then((data) => {
			return data;
		});
};

// URL for data
const URL =
	"https://laniustoys.com/our_offer.php?offer_id=566E212D70DFA5EB2AAB5ACE9984790E&page_id=offer";

// start of the program
const getData = async () => {
	const settingsFile = fs.readFileSync("./settings.json", "utf-8");
	const settings = JSON.parse(settingsFile);
	const data = await getRawData(URL);
	const html = parse(data);
	const table = html.querySelectorAll("table td");
	const quantity = html.querySelectorAll("table td input.qty_input");
	let counter = 0;
	const products = [];
	let csv = "Image;Part Number;EAN;Description;Price\n";
	let obj = {};
	let globalCsv =
		"Number;Brand;Description;EAN;Price;Quantity;Delivery Time;Delivery Cost\n";

	for (let i = 8; i < table.length; i++) {
		if (counter != 7) {
			obj = {
				...obj,
				[getContentName(counter)]: table[i].innerHTML,
			};
		} else {
			obj = {
				...obj,
				qty: quantity[products.length]?.attributes?.value,
			};
			counter = 0;
			products.push(obj);
			obj = {};
			continue;
		}

		counter++;
	}

	for (const product of products) {
		if (
			product.contition === "A" ||
			product.contition === "B" ||
			product.contition === "A+"
		) {
			product.img = product.img.replace(/.+?(?=<img)/gms, "");
			product.img = product.img.replace(/"/gms, "'");
			product.desc = product.desc.replace(/,/gms, " ");

			const price = product.price.split("&euro; ");
			let priceInNumber = calculatePrice(parseInt(price[1]), 3);
			let pn = product.desc.split("- ");
			let name = pn[0].split("");
			let desc;
			if (pn[1] === undefined) {
				pn = product.desc.split(" ");
				pn.unshift();
				desc = pn.join("").toString();
			} else {
				desc = pn[1];
			}

			desc = desc.split("");

			if (name[name.length - 1] === " ") {
				name.pop();
			}

			if (desc[desc.length - 1] === " ") {
				desc.pop();
			}

			name = name.join("");
			desc = desc.join("");

			product.price = `&euro; ${price[0]} ${priceInNumber}}`;

			csv += `${product.img};"${product.partNumber};"${product.ean}";"${product.desc}";${product.price}\n`;
			if (product.partNumber === undefined) {
				continue;
			}

			if (settings.PRODUCT_PRICE[product.ean]) {
				priceInNumber = settings.PRODUCT_PRICE[product.ean];
			}

			if (
				settings.DELETED_PRODUCTS.includes(product.ean) ||
				settings.DELETED_PRODUCTS.includes(parseInt(product.ean))
			) {
				continue;
			}

			globalCsv += `${product.partNumber};"${name}";"${desc}";"${product.ean}";${priceInNumber};${product.qty};3Tage;Versandkosten Frei;\n`;
		}
	}

	const table3 = xslx.readFile("./pc_notebook_preisliste.xlsx");
	xslx.writeFile(table3, "pc_notebook_preisliste.csv", { bookType: "csv" });
	const csvTable3 = fs
		.readFileSync("./pc_notebook_preisliste.csv", "utf-8")
		.split("\n");
	for (let i = 1; i < csvTable3.length; i++) {
		const product = csvTable3[i];
		let productColumns = product.replace(/(?!(([^"]*"){2})*[^"]*$),/gm, " ");
		productColumns = productColumns.replace(/,/gm, ";");
		let productDetails = productColumns.split(";");

		if (productDetails[0] === "Art.-Nr. " || productDetails[0] === "0") {
			continue;
		}

		const name = productDetails[5].split(" ");
		const brand = name[0];
		const desc = productDetails.splice(3, 14).join(" ");
		let price = productDetails[4]
			.replaceAll(" ", "")
			.replaceAll('"', "")
			.replace(",", "")
			.replace("€", "");

		price = price.replace(/ /gm, "");
		price = ecomCalc(parseFloat(price), 0);

		if (
			settings.DELETED_PRODUCTS.includes(productDetails[1]) ||
			settings.DELETED_PRODUCTS.includes(parseInt(productDetails[1]))
		) {
			continue;
		}

		globalCsv += `${productDetails[0]};${brand};${desc};${productDetails[1]};${price};${productDetails[3]};3Tage;Versandkosten Frei;\n`;
	}
	let table4 = fs.readFileSync("./Tomspielzeug.csv", "utf-8").split("\n");

	for (let i = 1; i < table4.length; i++) {
		let product = table4[i];
		product = product
			.replace(/(?!(([^"]*"){2})*[^"]*$),/gm, " ")
			.replace(/,/gm, ";");
		let productDetails = product.split(";").slice(0, 20);
		const price = calculateCustomerPrice(parseFloat(productDetails[5]));

		if (
			settings.DELETED_PRODUCTS.includes(productDetails[3]) ||
			settings.DELETED_PRODUCTS.includes(parseInt(productDetails[3]))
		) {
			continue;
		}

		globalCsv += `${productDetails[0]};${productDetails[2]};${productDetails[8]};${productDetails[3]};${price};${productDetails[17]};3Tage;Versandkosten Frei;\n`;
	}

	const table5 = fs.readFileSync("./Kosatec.csv", "utf-8").split("\n");
	for (let i = 1; i < table5.length; i++) {
		let product = table5[i];
		product = product
			.replace(/(?!(([^"]*"){2})*[^"]*$),/gm, " ")
			.replace(/(?<=\d),(?=\d)/gm, ".");
		let productDetails = product.split(";");
		const price = calculatePrice(parseFloat(productDetails[7]), 0);

		if (
			settings.DELETED_PRODUCTS.includes(productDetails[5]) ||
			settings.DELETED_PRODUCTS.includes(parseInt(productDetails[5]))
		) {
			continue;
		}

		globalCsv += `${productDetails[0]};${productDetails[3]};${productDetails[2]};${productDetails[5]};${price};${productDetails[9]};3Tage;Versandkosten Frei;\n`;
	}

	const table6 = fs.readFileSync("./volare.csv", "utf-8").split("\n");

	for (let i = 1; i < table6.length; i++) {
		let product = table6[i];
		let productDetails = product.split(";");
		if (productDetails[4] === undefined) {
			continue;
		}
		const price = addNineEuros(parseFloat(productDetails[4].replace('"', "")));

		if (
			settings.DELETED_PRODUCTS.includes(productDetails[1]) ||
			settings.DELETED_PRODUCTS.includes(parseInt(productDetails[1]))
		) {
			continue;
		}

		globalCsv += `${productDetails[0]};${productDetails[11]};${productDetails[2]};${productDetails[1]};${price};${productDetails[5]};3Tage;Versandkosten Frei;\n`;
	}

	settings.CUSTOM_PRODUCTS.forEach((p) => {
		const price = doDiscount(p.Price);
		globalCsv += `${p.Number};${p.Brand};${p.Description};${p.EAN};${price};${p.Quantity}`;
	});

	fs.writeFileSync("Lainustoys.csv", csv);

	fs.writeFileSync("g.csv", globalCsv);

	console.log("doneee");

	function calculatePrice(num, increse) {
		let price = parseFloat(
			(num + (5.49 + increse) + (num / 100) * 27).toFixed(2)
		);
		if (price <= 10) {
			price += 5;
		}
		price = price.toFixed(2);
		return doDiscount(price);
	}

	function ecomCalc(num, increse) {
		let price = parseFloat(
			(num + (5.49 + increse) + (num / 100) * 26).toFixed(2)
		);
		if (price <= 10) {
			price += 5;
		}
		price = price.toFixed(2);
		return doDiscount(price);
	}

	function calculateCustomerPrice(num) {
		let price = parseFloat((num + (num / 100) * 15 + 6.99).toFixed(2));
		if (price <= 10) {
			price += 5;
		}
		price = price.toFixed(2);
		return doDiscount(price);
	}

	function addNineEuros(num) {
		let price = (num + 9).toFixed(2);
		return doDiscount(price);
	}

	function doDiscount(num) {
		let price = num + (num / 100) * settings.DISCOUNT_ON_ALL_ARTICLES;
		return price;
	}
};

function getContentName(id) {
	let str = "";
	switch (id) {
		case 0:
			str = "img";
			break;
		case 1:
			str = "partNumber";
			break;
		case 2:
			str = "ean";
			break;
		case 3:
			str = "desc";
			break;
		case 4:
			str = "contition";
			break;
		case 5:
			str = "qty";
			break;
		case 6:
			str = "price";
			break;
		case 7:
			str = "select";
			break;
	}

	return str;
}

// invoking the main function
getData();

setInterval(() => {
	getData();
}, 15 * 60 * 1000);
