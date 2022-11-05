import * as wasm from 'https://cdn.jsdelivr.net/npm/@emurgo/cardano-serialization-lib-asmjs@11.1.0/cardano_serialization_lib.min.js';

export const getMyShits = async (assets) => {
  const policyString =
    "9f69089a100e93c776becadf5763f6766adf41d9715264d47286dd9c";
  const asaPolicy = wasm.ScriptHash.from_hex(policyString);
  let hex = await cardano.getBalance();
  const balance = wasm.Value.from_hex(hex);
  let multiAsset = balance.multiasset();
  let myApeShits = Object.keys(JSON.parse(multiAsset.get(asaPolicy).to_json())).map(asa => {
    return `${policyString}${asa}`
  });

  const myShits = assets.filter(a => {
    return myApeShits.includes(a.Asset);
  });
  return myShits;
}