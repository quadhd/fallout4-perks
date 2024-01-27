import { createContext, useContext } from 'react';
import AttributesJSONData from '../data/attributes.json';
import PerkJSONData from '../data/perks.json';
import { Attribute } from '../models/attribute';
import Perk from '../models/perk';

export type AttributesData = {
  attributes: Attribute[];
  perks: Perk[];
};

const attributesData = {
  attributes: AttributesJSONData,
  perks: PerkJSONData.sort((a, b) => {
    const aa = a.attributeRank;
    const bb = b.attributeRank;
    return aa < bb ? -1 : aa > bb ? 1 : 0;
  }),
} as AttributesData;

export const AttributesDataContext = createContext<AttributesData>(attributesData);
export const useAttributesData = () => useContext(AttributesDataContext);
