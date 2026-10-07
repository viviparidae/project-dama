import { IActivityRepository } from "../../adapters/IActivityRepository";

export class GetActivitySummary {
  constructor(private readonly repository: IActivityRepository) {}

  async execute({
    userId,
    date,
  }: {
    userId: string;
    date: string;
  }): Promise<{
    sedentaryBlocks: number;
    microMoveCount: number;
    totalSedentaryMinutes: number;
  }> {
    return this.repository.getDailySummary(userId, date);
  }
}
