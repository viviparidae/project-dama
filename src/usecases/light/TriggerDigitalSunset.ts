import { ILightRepository } from "../../adapters/ILightRepository";

export class TriggerDigitalSunset {
  constructor(private repo: ILightRepository) {}

  async enableSetting({ userId }: { userId: string }): Promise<void> {
    await this.repo.saveDigitalSunsetSetting({ userId, enabled: true });
  }

  async getSetting({
    userId,
  }: {
    userId: string;
  }): Promise<{ enabled: boolean }> {
    const setting = await this.repo.getDigitalSunsetSetting(userId);
    return { enabled: setting?.enabled ?? false };
  }
}
