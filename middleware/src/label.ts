import { SaleType, TraitAppearanceValue } from "./types.js"

export const attributeIndexToLabel: TraitAppearanceValue[] = ['Background', 'Clothes', 'Body', 'Expression', 'Face Accessory', 'Hat']

export const mintLabelMap = {
  [SaleType.Public]: 'Public',
  [SaleType.holder]: 'Holder',
  [SaleType.Whitelist]: 'Whitelist',
}
