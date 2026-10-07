import { IDetoxRepository } from "../../adapters/IDetoxRepository";
import { BatchNotification } from "../../domain/detox/BatchNotification";

export class ConfigureBatchNotify {
  constructor(private repo: IDetoxRepository) {}

  async execute({
    userId,
    enabled,
    windows,
  }: {
    userId: string;
    enabled: boolean;
    windows: Array<{ hour: number; minute: number }>;
  }): Promise<void> {
    // Instantiate domain object to trigger validation
    new BatchNotification({ enabled, windows });

    await this.repo.saveBatchNotifySetting({ userId, enabled, windows });
  }
}
