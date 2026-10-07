export interface ILightRepository {
  saveSunlightLog(log: {
    userId: string;
    date: string;
    checkedInAt: Date;
  }): Promise<void>;

  getTodaySunlightLog(
    userId: string,
    date: string
  ): Promise<{ checkedIn: boolean; checkedInAt?: Date } | null>;

  getWeeklySunlightLogs(
    userId: string
  ): Promise<Array<{ date: string; checkedIn: boolean }>>;

  saveDigitalSunsetSetting(setting: {
    userId: string;
    enabled: boolean;
  }): Promise<void>;

  getDigitalSunsetSetting(
    userId: string
  ): Promise<{ enabled: boolean } | null>;

  getNightExposureMinutes(userId: string, date: string): Promise<number>;

  addNightExposureMinutes(entry: {
    userId: string;
    date: string;
    minutes: number;
  }): Promise<void>;
}
