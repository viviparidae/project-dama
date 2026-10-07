import { ILightRepository } from "../../adapters/ILightRepository";

const RECOMMENDED_LIMIT_MINUTES = 30;

export class LogNightExposure {
  constructor(private repo: ILightRepository) {}

  async getSummary({
    userId,
    date,
  }: {
    userId: string;
    date: string;
  }): Promise<{ totalMinutes: number; exceedsRecommendedLimit: boolean }> {
    const totalMinutes = await this.repo.getNightExposureMinutes(userId, date);
    return {
      totalMinutes,
      exceedsRecommendedLimit: totalMinutes > RECOMMENDED_LIMIT_MINUTES,
    };
  }
}
