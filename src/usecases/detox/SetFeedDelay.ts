import { IDetoxRepository } from "../../adapters/IDetoxRepository";
import { FeedDelay } from "../../domain/detox/FeedDelay";

export class SetFeedDelay {
  constructor(private repo: IDetoxRepository) {}

  async execute({
    userId,
    enabled,
    delayHours,
  }: {
    userId: string;
    enabled: boolean;
    delayHours: 1 | 3 | 6 | 24;
  }): Promise<void> {
    // Instantiate domain object to trigger validation
    new FeedDelay({ enabled, delayHours });

    await this.repo.saveFeedDelaySetting({ userId, enabled, delayHours });
  }
}
