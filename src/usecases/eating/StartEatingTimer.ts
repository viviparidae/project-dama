import { IEatingRepository } from "../../adapters/IEatingRepository";
import { EatingSession } from "../../domain/eating/EatingSession";

export class StartEatingTimer {
  constructor(private readonly repository: IEatingRepository) {}

  async execute({ userId }: { userId: string }): Promise<EatingSession> {
    const session = EatingSession.create({ userId });
    session.start();
    await this.repository.save(session);
    return session;
  }
}
