import { IActivityRepository } from "../../adapters/IActivityRepository";

export class GetWeeklyNEATScores {
  constructor(private readonly repository: IActivityRepository) {}

  async execute({
    userId,
  }: {
    userId: string;
  }): Promise<Array<{ date: string; score: number }>> {
    return this.repository.getWeeklyNEATScores(userId);
  }
}
