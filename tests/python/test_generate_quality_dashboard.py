import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from scripts.generate_quality_dashboard import render_dashboard


class GenerateQualityDashboardTest(unittest.TestCase):
    def test_reads_istanbul_coverage_report(self) -> None:
        results = {
            "numTotalTestSuites": 2,
            "numTotalTests": 4,
            "numPassedTests": 3,
            "numFailedTests": 1,
            "success": False,
        }
        coverage = {
            "/project/src/domain/example.ts": {
                "all": False,
                "statementMap": {"0": {"start": {"line": 1, "column": 0}}},
                "s": {"0": 1},
                "fnMap": {"0": {"name": "example", "decl": {"line": 1}}},
                "f": {"0": 1},
                "branchMap": {},
                "b": {},
            }
        }

        html = render_dashboard(results, coverage)

        self.assertIn("テスト件数", html)
        self.assertIn("4", html)
        self.assertIn("成功率", html)
        self.assertIn("75.0%", html)
        self.assertIn("状態: 失敗", html)
        self.assertIn("100.0%", html)


if __name__ == "__main__":
    unittest.main()
