import { PerkAllocationAction, PerkAllocationActionType, PerkAllocationState } from './state/perks-allocation-reducer';
import { useAttributesData } from './global-contexts/attributes-data-context';
import Perk from './models/perk';

const pointsOnLevel1 = 21;

export default function Header({ state, dispatch }: { state: PerkAllocationState; dispatch: (action: PerkAllocationAction) => void }) {
  const { perks } = useAttributesData();

  const attributePointsSpentCount = calculateAttributePointsSpentCount(state);
  const perkPointsSpentCount = calculatePerkPointsSpentCount(state);
  const levelFromAttributePoints = calculateLevelFromAttributePoints(attributePointsSpentCount);
  const additionallySpentAttributePoints = calculateAdditionallySpentAttributePoints(attributePointsSpentCount);
  const level = calculateLevel(state, perks, levelFromAttributePoints, perkPointsSpentCount);
  const unspentInitialPoints = calculateUnspentInitialPoints(levelFromAttributePoints, attributePointsSpentCount);
  const unspentLevelPoints = calculateUnspentLevelPoints(additionallySpentAttributePoints, perkPointsSpentCount, level);

  return (
    <header className="header">
      <div className="header-title">
        <div className="header-main">FALLOUT 4</div>
        <div className="header-secondary">PERK CALCULATOR</div>
      </div>
      <div className="header-summary">
        <div className={`available-skill-points ${unspentInitialPoints < 1 && 'hide'}`}>
          <div className="label">Unspent initial</div>
          <div className="value" id="unspent-initial-value">
            {unspentInitialPoints}
          </div>
        </div>
        <div className={`available-skill-points ${unspentLevelPoints < 1 && 'hide'}`}>
          <div className="label">Unspent level</div>
          <div className="value" id="unspent-level-value">
            {unspentLevelPoints}
          </div>
        </div>
        <div className="level-counter">
          <span className="label">Character level</span>
          <span className="value" id="level-counter-value">
            {level}
          </span>
        </div>
        <button id="reset-button" onClick={reset}>
          Reset
        </button>
      </div>
    </header>
  );

  function reset() {
    dispatch({ type: PerkAllocationActionType.RESET });
  }
}

function calculateAttributePointsSpentCount(state: PerkAllocationState): number {
  return Object.keys(state).reduce((prev, cur) => prev + state[cur][0], 0);
}

function calculatePerkPointsSpentCount(state: PerkAllocationState): number {
  return Object.keys(state).reduce((prev, cur) => prev + state[cur].reduce((a, b, index) => (index > 0 ? a + b : a), 0), 0);
}

function calculateUnspentInitialPoints(levelFromAttributePoints: number, attributePointsSpentCount: number): number {
  return pointsOnLevel1 + levelFromAttributePoints - 1 - attributePointsSpentCount;
}

function calculateAdditionallySpentAttributePoints(attributePointsSpentCount: number): number {
  return Math.max(attributePointsSpentCount - pointsOnLevel1, 0);
}

function calculateUnspentLevelPoints(additionallySpentAttributePoints: number, perkPointsSpentCount: number, level: number): number {
  return level - 1 - perkPointsSpentCount - additionallySpentAttributePoints;
}

function calculateLevelFromAttributePoints(attributePointsSpentCount: number): number {
  return attributePointsSpentCount > pointsOnLevel1 ? attributePointsSpentCount - pointsOnLevel1 + 1 : 1;
}

function calculateLevel(state: PerkAllocationState, perks: Perk[], levelFromAttributePoints: number, perkPointsSpentCount: number): number {
  const levelFromPointSpentCount = levelFromAttributePoints + perkPointsSpentCount;
  const highestPerkLevelRequirement = Object.keys(state).reduce(
    (prev, cur) =>
      Math.max(
        prev,
        state[cur].reduce((a, b, index) => {
          if (b > 0 && index > 0) {
            const perk = perks.filter((x) => x.attributeType === cur && x.attributeRank === index)[0];
            const perkRank = perk.perkRanks[b - 1];
            return Math.max(a, perkRank.characterLevel ?? 0);
          }
          return a;
        }, 0),
      ),
    0,
  );
  return Math.max(levelFromPointSpentCount, highestPerkLevelRequirement);
}
