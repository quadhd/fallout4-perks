import PerkRank from './perk-ranks';
import { PerkAllocationAction, PerkAllocationActionType, PerkAllocationState } from './state/perks-allocation-reducer';
import { getNTimeStars } from './shared/utils';
import { AttributeType } from './models/attribute-type';
import { useContext } from 'react';
import { GridParametersContext } from './global-contexts/grid-parameters-context';
import { AttributesDataContext } from './global-contexts/attributes-data-context';

export default function Perks({ state, dispatch }: { state: PerkAllocationState; dispatch: (action: PerkAllocationAction) => void }) {
  const gridParamsContext = useContext(GridParametersContext);
  const attributesData = useContext(AttributesDataContext);

  return attributesData.perks.map((perk, i) => (
    <div
      className="grid-item"
      id={`grid-item${i}`}
      key={`${perk.attributeType}${perk.attributeRank}`}
      style={getPerkSpriteStyle(i)}
      {...(state[perk.attributeType][0] < perk.attributeRank && { disabled: true })}
    >
      <div className="name header-small-text">{perk.name}</div>
      <div className="stars">{getNTimeStars(state[perk.attributeType][perk.attributeRank])}</div>
      <div className="level">L{perk.attributeRank.toString().padStart(2, '0')}</div>
      <div className="selected-box">
        <div className="perk-buttons">
          <button className="minus-button" onClick={() => decrementAttribute(perk.attributeType, perk.attributeRank)}>
            —
          </button>
          <button className="plus-button" onClick={() => incrementAttribute(perk.attributeType, perk.attributeRank)}>
            +
          </button>
        </div>
        <PerkRank perkRank={state[perk.attributeType][perk.attributeRank] > 0 ? perk.perkRanks[state[perk.attributeType][perk.attributeRank] - 1] : null} />
      </div>
    </div>
  ));

  function decrementAttribute(attributeType: AttributeType, attributeRank: number) {
    dispatch({ type: PerkAllocationActionType.DECREMENT, attribute: attributeType, attributeRank: attributeRank });
  }

  function incrementAttribute(attributeType: AttributeType, attributeRank: number) {
    dispatch({ type: PerkAllocationActionType.INCREMENT, attribute: attributeType, attributeRank: attributeRank });
  }

  function getPerkSpriteStyle(index: number) {
    return {
      height: `${gridParamsContext.perkSpriteHeight}px`,
      width: `${gridParamsContext.attributeSpriteWidht}px`,
      backgroundPosition: `-${(index % gridParamsContext.attributesCount) * gridParamsContext.attributeSpriteWidht}px -${
        gridParamsContext.perkSpriteHeight * Math.floor(index / gridParamsContext.attributesCount) + gridParamsContext.attributeSpriteHeight
      }px`,
    };
  }
}
