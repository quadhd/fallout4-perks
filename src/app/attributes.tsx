import { useContext } from 'react';
import { AttributeType } from './models/attribute-type';
import { getNTimeStars } from './shared/utils';
import { PerkAllocationActionType, PerkAllocationState, PerkAllocationAction } from './state/perks-allocation-reducer';
import { GridParametersContext } from './global-contexts/grid-parameters-context';
import { AttributesDataContext } from './global-contexts/attributes-data-context';

export default function Attributes({ state, dispatch }: { state: PerkAllocationState; dispatch: (action: PerkAllocationAction) => void }) {
  const gridParams = useContext(GridParametersContext);
  const attributesData = useContext(AttributesDataContext);
  return attributesData.attributes.map((attribute, i) => {
    return (
      <div className="grid-item attr-item" style={getAttributeSpriteStyle(i)} id={`attr-item${i}`} key={attribute.key}>
        <div className="stars">{getNTimeStars(state[attribute.key][0])}</div>
        <div className="selected-box">
          <div className="perk-buttons">
            <button className="minus-button" onClick={() => decrementAttribute(attribute.key)}>
              —
            </button>
            <button className="plus-button" onClick={() => incrementAttribute(attribute.key)}>
              +
            </button>
          </div>
          <div className="description description-text">{attribute.description}</div>
        </div>
      </div>
    );
  });

  function decrementAttribute(attributeType: AttributeType) {
    dispatch({ type: PerkAllocationActionType.DECREMENT, attribute: attributeType, attributeRank: 0 });
  }

  function incrementAttribute(attributeType: AttributeType) {
    dispatch({ type: PerkAllocationActionType.INCREMENT, attribute: attributeType, attributeRank: 0 });
  }

  function getAttributeSpriteStyle(index: number) {
    return {
      height: `${gridParams.attributeSpriteHeight}px`,
      width: `${gridParams.attributeSpriteWidht}px`,
      backgroundPosition: `-${gridParams.attributeSpriteWidht * index}px 0px`,
    };
  }
}
