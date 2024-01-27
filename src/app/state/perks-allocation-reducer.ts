import { AttributeType } from '../models/attribute-type';
import PerksData from '../data/perks.json';
import Perk from '../models/perk';

export type PerkAllocationState = {
  [key: string]: number[];
};

export enum PerkAllocationActionType {
  INCREMENT,
  DECREMENT,
  RESET,
}

export type PerkAllocationAction =
  | {
      type: PerkAllocationActionType.DECREMENT | PerkAllocationActionType.INCREMENT;
      attribute: AttributeType;
      attributeRank: number;
    }
  | {
      type: PerkAllocationActionType.RESET;
    };

export function perkAllocationReducer(state: PerkAllocationState, action: PerkAllocationAction): PerkAllocationState {
  switch (action.type) {
    case PerkAllocationActionType.INCREMENT: {
      if (!perkIsUnlocked(state, action.attribute, action.attributeRank)) {
        return state;
      }
      const perkMaxValue = getPerkMaxValue(action.attribute, action.attributeRank);
      const perkCurrentValue = state[action.attribute][action.attributeRank];
      if (perkCurrentValue === perkMaxValue) {
        return state;
      }
      const newPerksArray = [...state[action.attribute]];
      newPerksArray[action.attributeRank] = perkCurrentValue + 1;
      return {
        ...state,
        [action.attribute]: newPerksArray,
      };
    }
    case PerkAllocationActionType.DECREMENT: {
      const perkMinValue = getPerkMinValue(action.attributeRank);
      const perkCurrentValue = state[action.attribute][action.attributeRank];
      if (perkCurrentValue === perkMinValue) {
        return state;
      }
      const newPerksArray = [...state[action.attribute]];
      newPerksArray[action.attributeRank] = perkCurrentValue - 1;
      return {
        ...state,
        [action.attribute]: newPerksArray,
      };
    }
    case PerkAllocationActionType.RESET:
      return getInitialState();
    default:
      return state;
  }
}

export function getInitialState(): PerkAllocationState {
  const initialState = {} as PerkAllocationState;
  Object.keys(AttributeType).forEach((attribute) => {
    initialState[attribute] = new Array<number>(11).fill(0);
    initialState[attribute][0] = 1;
  });
  return initialState;
}

function perkIsUnlocked(state: PerkAllocationState, attribute: AttributeType, attributeRank: number): boolean {
  // special case for attribute row
  if (attributeRank === 0) {
    return true;
  }
  const attributeCurrentValue = state[attribute][0];
  return attributeCurrentValue >= attributeRank;
}

function getPerkMaxValue(attribute: AttributeType, attributeRank: number): number {
  // special case for attribute row
  if (attributeRank === 0) {
    return 12;
  }
  const perkData = (PerksData as Perk[]).find((p) => p.attributeType === attribute && p.attributeRank === attributeRank);
  if (perkData) {
    return perkData.perkRanks.length;
  }
  throw new Error(`Perk not found for attribute ${attribute} and rank ${attributeRank}`);
}

function getPerkMinValue(attributeRank: number): number {
  // special case for attribute row
  if (attributeRank === 0) {
    return 1;
  }
  return 0;
}
