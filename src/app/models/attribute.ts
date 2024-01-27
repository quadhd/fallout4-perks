import { AttributeType } from './attribute-type';

export interface Attribute {
  id: number;
  key: AttributeType;
  name: string;
  description: string;
}
