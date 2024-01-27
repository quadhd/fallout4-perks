'use client';

import Header from './header';
import Attributes from './attributes';
import Perks from './perks';
import { useContext, useReducer } from 'react';
import { perkAllocationReducer, getInitialState } from './state/perks-allocation-reducer';
import { GridParametersContext } from './global-contexts/grid-parameters-context';
import { AttributesDataContext } from './global-contexts/attributes-data-context';

export default function App() {
  const [perkAllocationState, perkAllocationActionDispatch] = useReducer(perkAllocationReducer, getInitialState());
  const gridParamsContext = useContext(GridParametersContext);
  const attributesDataContext = useContext(AttributesDataContext);
  return (
    <>
      <AttributesDataContext.Provider value={attributesDataContext}>
        <Header state={perkAllocationState} dispatch={perkAllocationActionDispatch} />
        <GridParametersContext.Provider value={gridParamsContext}>
          <div
            id="grid-container"
            style={{
              width: gridParamsContext.attributeSpriteWidht * gridParamsContext.attributesCount,
              height: gridParamsContext.attributeSpriteHeight + gridParamsContext.perksPerAttributeCount * gridParamsContext.perkSpriteHeight,
            }}
          >
            <Attributes state={perkAllocationState} dispatch={perkAllocationActionDispatch} />
            <Perks state={perkAllocationState} dispatch={perkAllocationActionDispatch} />
          </div>
        </GridParametersContext.Provider>
        <footer id="footer"></footer>
      </AttributesDataContext.Provider>
    </>
  );
}
