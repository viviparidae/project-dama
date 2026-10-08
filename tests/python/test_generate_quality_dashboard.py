import json
import sys
import tempfile
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

    def test_visualizes_test_pyramid_with_unclassified_tests(self) -> None:
        results = {
            "numTotalTestSuites": 3,
            "numTotalTests": 4,
            "numPassedTests": 4,
            "numFailedTests": 0,
            "testResults": [
                {
                    "name": "/project/tests/unit/domain/example.test.ts",
                    "status": "passed",
                    "assertionResults": [{"status": "passed"}, {"status": "passed"}],
                },
                {
                    "name": "/project/tests/acceptance/example.test.ts",
                    "status": "passed",
                    "assertionResults": [{"status": "passed"}],
                },
                {
                    "name": "/project/custom/example.test.ts",
                    "status": "passed",
                    "assertionResults": [{"status": "passed"}],
                },
            ],
        }

        dashboard = render_dashboard(results, {})

        self.assertIn("テストピラミッド", dashboard)
        self.assertIn("単体", dashboard)
        self.assertIn("受け入れ", dashboard)
        self.assertIn("未分類", dashboard)
        self.assertIn("50.0%", dashboard)
        self.assertIn("推移の比較は次回以降", dashboard)
        self.assertIn("要求定義が入力されていない", dashboard)

    def test_counts_only_requirements_with_existing_implementation_and_passing_test(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            implementation = root / "src" / "feature.ts"
            test_file = root / "tests" / "unit" / "feature.test.ts"
            implementation.parent.mkdir(parents=True)
            test_file.parent.mkdir(parents=True)
            implementation.write_text("export const feature = true;\n", encoding="utf-8")
            test_file.write_text("test('feature', () => {});\n", encoding="utf-8")
            requirements = {
                "user_stories": [
                    {
                        "acceptance_criteria": [
                            {"ac_id": "AC-01"},
                            {"ac_id": "AC-02"},
                        ]
                    }
                ],
                "non_functional_requirements": [{"ac_id": "NFR-01"}],
            }
            evidence = {
                "requirements": {
                    "AC-01": {
                        "implementation_paths": ["src/feature.ts"],
                        "test_paths": ["tests/unit/feature.test.ts"],
                    },
                    "AC-02": {
                        "implementation_paths": ["src/missing.ts"],
                        "test_paths": ["tests/unit/feature.test.ts"],
                    },
                    "NFR-01": {
                        "implementation_paths": ["src/feature.ts"],
                        "test_paths": ["tests/unit/failed.test.ts"],
                    },
                }
            }
            results = {
                "testResults": [
                    {
                        "name": str(test_file),
                        "status": "passed",
                        "assertionResults": [{"status": "passed"}],
                    }
                ]
            }

            dashboard = render_dashboard(
                results,
                {},
                requirements_source=requirements,
                requirements_evidence=evidence,
                repository_root=root,
                commit="commit-1",
                generated_at="2026-10-08T00:00:00+00:00",
            )

        self.assertIn("対象要求</strong><div class=\"value\">3", dashboard)
        self.assertIn("完了</strong><div class=\"value\">1", dashboard)
        self.assertIn("未完了</strong><div class=\"value\">2", dashboard)
        self.assertIn("33.3%", dashboard)
        self.assertIn("AC-01", dashboard)
        self.assertIn("AC-02", dashboard)

    def test_persists_and_reuses_history_without_duplicate_commits(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            history_path = Path(temporary_directory) / "history.json"
            first_args = {
                "results": {"numTotalTests": 1, "numPassedTests": 1, "numFailedTests": 0},
                "coverage": {},
                "history_path": history_path,
                "commit": "commit-1",
                "generated_at": "2026-10-08T00:00:00+00:00",
            }
            render_dashboard(**first_args)
            render_dashboard(**{**first_args, "generated_at": "2026-10-08T00:01:00+00:00"})
            render_dashboard(
                **{
                    **first_args,
                    "commit": "commit-2",
                    "generated_at": "2026-10-08T00:02:00+00:00",
                }
            )
            history = json.loads(history_path.read_text(encoding="utf-8"))

        self.assertEqual(len(history["snapshots"]), 2)
        self.assertEqual(history["snapshots"][0]["commit"], "commit-1")
        self.assertEqual(history["snapshots"][1]["commit"], "commit-2")


if __name__ == "__main__":
    unittest.main()
