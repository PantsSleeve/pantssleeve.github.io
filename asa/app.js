import { } from './components/ps-card.js';

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

const filter = (value) => {
  // TODO - tokenize value to do smarter filtering.
  let filteredShits = assets.filter(a => {
    return Object.values(a).some(p => {
      return p.toString().toLowerCase().includes(value.toLowerCase());
    })
  });
  updateCards(filteredShits);
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
    let title = `<h3 slot="title">${shit.Name} (${shit.RarityRank}) 
      <a href="https://www.jpg.store/asset/${shit.Asset}" >
        <img class="icon" src="./imgs/jpg-store.svg" />
      </a>
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