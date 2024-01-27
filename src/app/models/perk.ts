import { PerkRank } from './perk-rank';
import { AttributeType } from './attribute-type';

export default interface Perk {
  name: string;
  attributeType: AttributeType;
  attributeRank: number;
  perkRanks: PerkRank[];
}
