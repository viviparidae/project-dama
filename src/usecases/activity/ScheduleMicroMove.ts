import { IActivityRepository } from "../../adapters/IActivityRepository";

const SUPPORTED_INTERVALS = new Set([20, 30, 45]);

export class ScheduleMicroMove {
  constructor(private readonly repository: IActivityRepository) {}

  async execute({
    userId,
    intervalMinutes,
  }: {
    userId: string;
    intervalMinutes: number;
  }): Promise<void> {
    if (!SUPPORTED_INTERVALS.has(intervalMinutes)) {
      throw new Error("マイクロムーブリマインドの間隔は20分、30分、45分のいずれかです。");
    }

    await this.repository.saveMicroMoveSetting({
      userId,
      intervalMinutes,
      enabled: true,
    });
  }
}
