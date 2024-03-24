// export const allHighScoreEntries = [];

export async function load(runtime) {
  const loaderDuck = runtime.objects.loaderduck.createInstance(
    'game',
    runtime.layout.width / 2,
    runtime.layout.height / 2
  );
  const loaderDuckText = runtime.objects.Text.createInstance(
    'game',
    runtime.layout.width / 2 - 17,
    runtime.layout.height / 2 + 32
  );
  loaderDuckText.text = 'Loading...';
  loaderDuckText.fontColor = [1, 1, 1];
  loaderDuckText.width = 100;
  loaderDuckText.horizontalAlign = 'left';
  loaderDuckText.verticalAlign = 'center';

  const response = await fetch('https://0j2iyj6m8a.execute-api.us-east-2.amazonaws.com/high-score', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const allHighScoreItems = await response.json();

  loaderDuck.destroy();
  loaderDuckText.destroy();

  return allHighScoreItems;
}

export function populateList(runtime, items) {
  const layer = 'game';
  const x = runtime.layout.width / 2 - 70;
  const textColor = [1, 1, 1];

  let y = 80;
  let i = 1;
  let height = 9;
  let fontSize = 8;
  for (const item of items) {
    const placement = runtime.objects.Text.createInstance(layer, x, y);
    placement.text = i.toString() + '.';
    placement.fontColor = textColor;
	placement.width = 100;
	placement.height = height;
	placement.sizePt = fontSize;
	placement.horizontalAlign = "left";

    const duckAsset = item.assetName;
    const duck = runtime.objects.Player.createInstance(layer, x + 30, y+2);
    duck.width = 24;
    duck.height = 24;
    duck.behaviors.Tween.isEnabled = false;
    duck.behaviors.Platform.isEnabled = false;
    duck.animationFrame = Number.parseInt(duckAsset.replace('LoD', ''));

    const assetTag = runtime.objects.Text.createInstance(layer, x + 45, y);
    assetTag.text = duckAsset.substring(0, 3) + ' #' + duckAsset.substring(3);
    assetTag.fontColor = [0.85, 0.85, 0.85];
    assetTag.width = 100;
	assetTag.height = height;
	assetTag.sizePt = fontSize-2;
    assetTag.horizontalAlign = 'left';
    assetTag.verticalAlign = 'center';

    const score = runtime.objects.Text.createInstance(layer, x + 95, y);
    score.text = item.score.toString();
    score.width = 200;
	score.height = height;
	score.sizePt = fontSize;
    score.horizontalAlign = 'left';
    score.verticalAlign = 'center';
    score.fontColor = textColor;

    // allHighScoreEntries.push({ placement, duck, assetTag, score, item });

    y += 30;
    i++;
  }
}

// export function scroll(direction) {
//   console.log(direction);
//   if (direction === 'down') {
//     for (let i = 0; i < allHighScoreEntries.length - 1; i++) {
//       const oldDuck = allHighScoreEntries[i];
//       const newDuck = allHighScoreEntries[i + 1];
//       oldDuck.placement.text = newDuck.placement.text;
//       oldDuck.duck.animationFrame = newDuck.duck.animationFrame;
//       oldDuck.assetTag.text = newDuck.assetTag.text;
//       oldDuck.score.text = newDuck.score.text;
//     }
//   } else {
//     ...
//   }
// }
