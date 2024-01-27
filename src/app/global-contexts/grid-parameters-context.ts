import { createContext } from 'react';

const gridParameters = {
  attributeSpriteWidht: 200,
  attributeSpriteHeight: 200,
  perkSpriteHeight: 179,
  attributesCount: 7,
  perksPerAttributeCount: 10,
};

export type GridParameters = typeof gridParameters;

export const GridParametersContext = createContext<GridParameters>(gridParameters);
