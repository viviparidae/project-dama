import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // テストルートの設定
    include: [
      "tests/unit/**/*.test.ts",
      "tests/acceptance/**/*.test.ts",
      "tests/integration/**/*.test.ts",
    ],

    // グローバル設定（describe / it / expect をインポート不要にする）
    globals: false, // 明示的インポートで型安全性を維持

    // 環境設定
    environment: "node", // 受け入れテストは jsdom を個別指定

    // カバレッジ設定
    coverage: {
      provider: "v8",
      include: ["src/domain/**", "src/usecases/**"],
      exclude: ["src/infrastructure/**", "src/adapters/**"],
      thresholds: {
        lines: 80,    // 品質ゲート：ライン カバレッジ ≥ 80%（test-strategy.md 参照）
        functions: 80,
        branches: 75,
      },
      reporter: ["text", "json", "html"],
    },

    // タイムアウト設定
    testTimeout: 5000,  // 単体テストは5秒以内
    hookTimeout: 10000,

    // スナップショット設定
    snapshotFormat: {
      printBasicPrototype: false,
    },
  },

  resolve: {
    alias: {
      "@domain": path.resolve(__dirname, "./src/domain"),
      "@usecases": path.resolve(__dirname, "./src/usecases"),
      "@adapters": path.resolve(__dirname, "./src/adapters"),
      "@infrastructure": path.resolve(__dirname, "./src/infrastructure"),
    },
  },
});

