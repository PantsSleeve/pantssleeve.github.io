import * as Wallets from './wallets.js';
import * as Ampd from './ampd.js';
import * as HighScores from './highScoreUtils.js';


const scriptsInEvents = {

	async Game_Event17(runtime, localVars)
	{
		await localStorage.setItem('score', runtime.globalVars.score || 0);
		await localStorage.setItem('goingBack', runtime.globalVars.goingBack);
		await localStorage.setItem('f', JSON.stringify(runtime.objects.froggie.getFirstInstance().instVars));
	},

	async Game_Event20(runtime, localVars)
	{
		if(localStorage.length !== 0) {
		let score = parseInt(await localStorage.getItem('score'));
		
			runtime.globalVars.score = parseInt(await localStorage.getItem('score'));
			runtime.globalVars.goingBack = await localStorage.getItem('goingBack');
			let froggie = JSON.parse(await localStorage.getItem('f'));
			let instance = runtime.objects.froggie.getFirstInstance();
			for(let f of Object.entries(froggie)){
			  instance.instVars[f[0]] = f[1];
			}
		} else {
			runtime.globalVars.goingBack = 'no';
		}
	},

	async Game_Event23(runtime, localVars)
	{
		localStorage.clear()
	},

	async Start_Event1_Act8(runtime, localVars)
	{
		Wallets.setupAmpd();
	},

	async Start_Event4_Act1(runtime, localVars)
	{
		if(ampdId && ampdId.isLoggedIn()) {
		    let layer = runtime.layout.getLayer("loggedOut");
		    layer.isVisible = false;
		} else {
		    let layer = runtime.layout.getLayer("loggedOut");
		    layer.isVisible = true;
		}
	},

	async Boss_Event30_Act1(runtime, localVars)
	{
		Wallets.setupAmpd();
	},

	async Boss_Event33_Act1(runtime, localVars)
	{
		try {
		    const wallet = await cardano[ampdId.getUser().primaryWallet].enable()
			let message = ampdId.getUser().userId;
			let address = await wallet.getChangeAddress();
		    let data = await wallet.signData(address, Wallets.strToHex(message));
		    data.message = message;
		    let response = await fetch('https://remec405ch.execute-api.us-east-2.amazonaws.com/high-score', {
		      method: 'POST',
		      headers: {
		        'Content-Type': 'application/json',
		      },
		      body: JSON.stringify({userId: data}),
		    });
			runtime.goToLayout("start");
			
		  } catch (error) {
		    console.error(error.message);
		  }
	},

	async Game2_Event2(runtime, localVars)
	{
		document.querySelector('ampd-id').style.display = "none";
	},

	async ["Overview-Map_Event2"](runtime, localVars)
	{
		document.querySelector('ampd-id').style.display = "none";
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

