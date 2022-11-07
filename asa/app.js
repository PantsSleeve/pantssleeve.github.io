import { } from './components/ps-card.js';
import { getMyShits } from './wallet.js';

const assetsGz = await (await fetch("./data/asa3.json.gz")).arrayBuffer();
const binData = new Uint8Array(assetsGz);
let assets = JSON.parse(pako.ungzip(binData, { 'to': 'string' }));
assets = assets.sort((a, b) => {
  return a.RarityRank - b.RarityRank;
});

const imgsGz = await (await fetch("./data/svg.json.gz")).arrayBuffer();
const imgBinData = new Uint8Array(imgsGz);
let imgs = JSON.parse(pako.ungzip(imgBinData, { 'to': 'string' }));

const content = document.getElementById('content');
const filterText = document.getElementById('filter');
const sortCheck = document.getElementById('rarity');

let sortByRarity = true;
const counter = document.getElementById('counter');
const totalCount = 6969;

const filter = (str) => {
  // TODO - tokenize value to do smarter filtering.
  let filteredShits = assets.filter(a => {
    return Object.entries(a).some(p => {
      let key = p[0].toLowerCase();
      let value = p[1].toString().toLowerCase();
      if (['asset', 'rarityrank', 'id'].includes(key)) { return false; }
      return value.includes(str.toLowerCase());
    })
  });
  updateCards(filteredShits);
}

const nami = document.getElementById('nami');
nami.onclick = async (e) => {
  e.preventDefault();
  if (!await cardano.enable()) { return; }
  let myShits = await getMyShits(assets);
  updateCards(myShits);
}

sortCheck.onchange = (e) => {
  console.log(e.srcElement.checked);
  sortByRarity = e.srcElement.checked;
  filter(filterText.value);
}

filterText.onkeyup = (e) => {
  if (e.key !== 'Enter' || e.keyCode !== 13) { return; }
  let value = e.srcElement.value;
  filter(value);
};

const maxCardsToShow = 100;
const updateCards = (filteredShits) => {
  counter.innerHTML = `${filteredShits ? filteredShits.length : totalCount}/${totalCount} (showing first ${maxCardsToShow})`
  let c = document.createElement('div');
  let shits = filteredShits || assets;

  shits = shits.splice(0, maxCardsToShow);
  const skipProps = ['Id', 'Name', 'Rarity', 'RarityRank', 'Asset'];
  for (let shit of shits) {
    let card = document.createElement('ps-card');
    let title = `<h3 slot="title"><div>${shit.Name} <br />
        <span class="weak">
        🧪 Rarity rank: ${shit.RarityRank}
        </span>
      </div>
      <div>
        <a target="_blank" href="https://www.jpg.store/asset/${shit.Asset}" >
          <img class="icon" src="./imgs/jpg-store.svg" />
        </a>
      </div>
    </h3>`;
    let img = `<img slot="img" src="${imgs[shit.Id]}" />`;

    let body = ``;
    for (let prop of Object.entries(shit)) {
      if (skipProps.includes(prop[0])) { continue };
      body += `<div class="properties">
      <div class="bold">${prop[0]}:</div>
      <div>${prop[1]} (${shit.Rarity[prop[0]]}%)</div>
      </div>`
    }

    card.innerHTML = `${title}${img}<div slot="body">${body}</div>`;
    c.append(card);
  }
  content.innerHTML = c.innerHTML;
}

updateCards([...assets]);