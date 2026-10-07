import { ILightRepository } from "../../adapters/ILightRepository";

export class RecordSunlight {
  constructor(private repo: ILightRepository) {}

  async execute({
    userId,
  }: {
    userId: string;
  }): Promise<{ checkedIn: boolean; checkedInAt: Date }> {
    const now = new Date();
    const date = now.toISOString().slice(0, 10); // YYYY-MM-DD

    await this.repo.saveSunlightLog({
      userId,
      date,
      checkedInAt: now,
    });

    return { checkedIn: true, checkedInAt: now };
  }
}
