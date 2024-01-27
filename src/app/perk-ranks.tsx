import { PerkRank } from './models/perk-rank';

export default function PerkRank({ perkRank }: { perkRank: PerkRank | null }) {
  if (!perkRank) return null;
  return (
    <div className="perk-rank" key={perkRank.rank}>
      <div className="description-text">
        {perkRank.description}
        <span className="req-attr-rank">{perkRank.characterLevel ? ` [LVL ${perkRank.characterLevel}]` : ''}</span>
      </div>
    </div>
  );
}
