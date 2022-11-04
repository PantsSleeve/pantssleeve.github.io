import { } from './components/ps-card.js';
const assets = await (await fetch("./data/asa.json")).json();
const imgs = await (await fetch("./data/svg.json")).json();

const content = document.getElementById('content');
const filterText = document.getElementById('filter');
const counter = document.getElementById('counter');
const totalCount = 6969;

filterText.onkeyup = (e) => {
  if (e.key !== 'Enter' || e.keyCode !== 13) { return; }
  let value = event.srcElement.value;
  let filteredShits = Object.entries(assets).filter(a => {
    return Object.values(a[1]).some(p => {
      return p.toLowerCase().includes(value.toLowerCase());
    })
  });
  updateCards(filteredShits);
};

const maxCardsToShow = 100;
const updateCards = (filteredShits) => {
  counter.innerHTML = `${filteredShits ? filteredShits.length : totalCount}/${totalCount}`
  let c = document.createElement('div');
  let shits = filteredShits || Object.entries(assets);
  shits = shits.splice(0, maxCardsToShow);

  for (let shit of shits) {
    let key = shit[0];
    let value = shit[1];

    let card = document.createElement('ps-card');
    let title = `<h3 slot="title">${value.Name}</h3>`;
    let img = `<img slot="img" src="${imgs[key]}" />`;
    let body = ``;
    for (let prop of Object.entries(value)) {
      if (prop[0] === "Name") { continue };
      body += `<div>${prop[0]}: ${prop[1]}</div>`
    }

    card.innerHTML = `${title}${img}<div slot="body">${body}</div>`;
    c.append(card);
  }
  content.innerHTML = c.innerHTML;
}

updateCards();