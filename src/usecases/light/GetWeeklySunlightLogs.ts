import { ILightRepository } from "../../adapters/ILightRepository";

export class GetWeeklySunlightLogs {
  constructor(private repo: ILightRepository) {}

  async execute({
    userId,
  }: {
    userId: string;
  }): Promise<{ logs: Array<{ date: string; checkedIn: boolean }> }> {
    const logs = await this.repo.getWeeklySunlightLogs(userId);
    return { logs };
  }
}
