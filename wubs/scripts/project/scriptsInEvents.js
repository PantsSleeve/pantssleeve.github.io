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

	async Start_Event1_Act7(runtime, localVars)
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
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

