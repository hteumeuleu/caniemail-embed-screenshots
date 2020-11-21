const puppeteer = require('puppeteer');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

(async () => {

	const features = [];

	// Get Caniemail data
	const apiRequest = new XMLHttpRequest();
	let apiResponseData;
	apiRequest.open('GET', 'https://www.caniemail.com/api/data.json', true);
	apiRequest.onreadystatechange = function() {
		if (apiRequest.readyState == 4 && apiRequest.status == 200) {
			const apiResponse = apiRequest.responseText;
			apiResponseData = JSON.parse(apiResponse).data;

			// Build features array
			for(let i=0; i < apiResponseData.length; i++) {
				features.push(apiResponseData[i].slug);
			}
		}
	}
	await apiRequest.send();

	// Open a single page for all features
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setViewport({
		width: 640,
		height: 400,
		deviceScaleFactor: 1,
	});
	const screenshots = [];

	for (let i = 0; i < features.length; i++) {
		const feature = features[i];
	    await page.goto(`https://embed.caniemail.com/${feature}/?screenshot-view-enabled=true`);

	    screenshots.push({
	        feature: feature,
	        screenshot: await page.screenshot({path: `${feature}.png`})
	    });
	}

	await browser.close();
	return screenshots;
})();
