import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from scripts.humanize_requirements import render_markdown


class HumanizeRequirementsTest(unittest.TestCase):
    def test_renders_yaml_as_japanese_markdown(self) -> None:
        source = {
            "version": "1.0",
            "project": "Project Dama",
            "status": "Draft",
            "user_stories": [
                {
                    "id": "US-EAT-01",
                    "title": "食事タイマーによるペーシング",
                    "actor": "健康意識の高いユーザー",
                    "goal": "食事開始から20分間、食べるペースをコントロールする",
                    "reason": "満腹シグナルが脳に届くまでに約20分かかる",
                    "acceptance_criteria": [
                        {
                            "ac_id": "AC-EAT-01",
                            "priority": "Must",
                            "title": "食事タイマーの開始",
                            "given": ["ユーザーがホーム画面を表示している"],
                            "when": "食事開始ボタンを押した",
                            "then": "20分のカウントダウンタイマーが開始される",
                        }
                    ],
                }
            ],
        }

        output = render_markdown(source)

        self.assertIn("# プロジェクトダマ 要求一覧", output)
        self.assertIn("## US-EAT-01: 食事タイマーによるペーシング", output)
        self.assertIn("### 食事タイマーの開始", output)
        self.assertIn("【前提】", output)
        self.assertIn("【もし】", output)
        self.assertIn("【ならば】", output)


if __name__ == "__main__":
    unittest.main()
