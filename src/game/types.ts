export type Outcome = 'win' | 'lose';

export interface GameResult {
  outcome: Outcome;
  level: number;
  moves: number;
  stars: number;
  n: number;
}
