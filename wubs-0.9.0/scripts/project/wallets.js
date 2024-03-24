import * as wasm from './cardano_serialization_lib.js';

window.duckPlayer = 0;
const WUBS_POLICY = "932bf12cefb8fb0ee56304720a9bb7791257c21d94162d940fd96757";
export let cardanoApi = {};

const fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

export const setupAmpd = () => {
	if(!document.querySelector('ampd-id')) {
	  let ampdIdTag = document.createElement("ampd-id");
	  ampdIdTag.setAttribute("theme","dark");
	  document.body.appendChild(ampdIdTag);
	}
}

document.addEventListener('ampd-id-initialize-success', () => {
  console.log('ampd-id-initialize-success');
  // ⚡️ These are all the events that can be dispatched by the AMPDid component
  [
    'wallet-authorization-success',
    'wallet-authorization-error',
    'signin-success',
    'signin-error',
    'wallet-connection-success',
    'wallet-connection-error',
    'wallet-disconnect-success',
    'wallet-disconnect-error',
    'profile-picture-updated',
    'account-handle-updated',
    'sign-out',
  ].forEach((eventType) => {
    // 👂 Here we setup event listeners for the events
    window.ampdId.events.addEventListener(eventType, (data) => {
      console.log(eventType);
      console.log(data);
    });
  });
});

// ⚠️ This is if the component had an error when initialized
document.addEventListener('ampd-id-initialize-error', (data) => {
  console.log('ampd-id-initialize-error');
  console.log(data);
});

export const hexToStr = (hex) => {
  let _hex = hex.toString();//force conversion
  let str = '';
  for (let i = 0; i < _hex.length; i += 2)
    str += String.fromCharCode(parseInt(_hex.substr(i, 2), 16));
  return str;
}

export const strToHex = (str) => {
  var hex, i;

  var result = "";
  for (i = 0; i < str.length; i++) {
    hex = str.charCodeAt(i).toString(16);
    result += ("000" + hex).slice(-4);
  }

  return result
}

export const getWallets = async () => {
	let wallets = new Map();
    const cardano = await window.cardano;
    if (!cardano) {
      return;
    }

    Object.keys(cardano).map(obj => {
      const curObj = cardano[obj]
      if (curObj.apiVersion && curObj.icon) {
	    // Always set ccvault to eternl
        curObj.key = obj === 'ccvault' ? 'eternl' : obj;
		wallets.set(curObj.key, curObj);
	  }
    });
	
	return wallets;
}

const isWalletSameAsSelected = async (walletName) => {
  let currentWalletName = await localStorage.getItem('selectedWallet');
  return window.cardano.api && walletName === currentWalletName;
}

window.loadSelectedWallet = async (walletName) => {
  cardanoApi = await cardano[walletName].enable();
  if(!walletName){return;}
  walletName = walletName ? walletName : await localStorage.getItem('selectedWallet');
  await loadDucks(walletName);
}

window.setWallet = async (walletName) => {
 try {
  showLoading("Loading wallet content");
  document.getElementById('duckSelector').innerHTML = '';
  console.debug('setWallet');
  
  // Set selected class on right wallet
  let walletImgs = document.querySelectorAll('#walletBody img');
  for (let index = 0; index < walletImgs.length; index++) {
    const element = walletImgs[index];
    if (element.getAttribute('data-wallet-name') === walletName) {
      element.classList.add('selected');
    } else {
      element.classList.remove('selected');
    }
  }
  
  await window.loadSelectedWallet(walletName);
 } catch(ex){
   console.error(ex.message);
 } finally {
   await localStorage.setItem('selectedWallet', walletName);
   hideLoading();
 }
}

const loadWubs = async (walletName) => {
  let avatarSelector = document.getElementById('duckSelector');
    let assets = await ampdId.getAssets();
  let wubs = assets.filter((w) => {
    return w.policyId === WUBS_POLICY;
  })
  console.log(wubs);

  if (!wubs || wubs.length === 0) {
    //alert(`No ducks found in this wallet! Go mint one here: https://duck-mint.vercel.app/ \n and come back ✨`);
    //avatarSelector.innerHTML = '';
    //return;
	wubs = [{image: '57.png', assetName: 'LoD57', hex: strToHex('LoD57')}];
  }
  localStorage.setItem('myWubs', JSON.stringify(wubs));

  const isLocalHost =
    location.hostname === "localhost" || location.hostname === "127.0.0.1";
  const baseUrl = isLocalHost
    ? ".."
    : "https://u25-duck-minigame.vercel.app";

  let html = '';
  for (let duck of ducks) {
    let img = baseUrl + `/assets/img/ducks/${duck.image}`;
    html += `<img class="duck" src='${img}' onclick='chooseDuck("${duck.assetName}")' />`;
  }
  avatarSelector.innerHTML = html;
}

export const showLoading = (loadingText) => {
	let loader = document.querySelector('#loader');
	loader.style.display = 'flex';
	loader.querySelector('div').innerText = loadingText;
}

export const hideLoading = () => {
	let loader = document.querySelector('#loader');
	loader.style.display = 'none';
}