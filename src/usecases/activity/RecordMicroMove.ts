import { IActivityRepository } from "../../adapters/IActivityRepository";

export class RecordMicroMove {
  constructor(private readonly repository: IActivityRepository) {}

  async execute({ userId }: { userId: string }): Promise<{
    todayCount: number;
    sedentaryTimerReset: boolean;
  }> {
    const result = await this.repository.recordMicroMove({
      userId,
      completedAt: new Date(),
    });

    return {
      todayCount: result.todayCount,
      sedentaryTimerReset: true,
    };
  }
}
