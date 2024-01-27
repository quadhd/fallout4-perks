export enum AttributeType {
  STR = 'STR',
  PER = 'PER',
  END = 'END',
  CHR = 'CHR',
  INT = 'INT',
  AGI = 'AGI',
  LCK = 'LCK',
}

export type AttributeTypeStrings = keyof typeof AttributeType;
