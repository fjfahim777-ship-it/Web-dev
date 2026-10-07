from collections import Counter


class CrossProjectAnalyzer:

    def analyze(self, project_data, relationships):
        summaries = {}

        for project, data in project_data.items():
            files = data.get("files", [])

            summaries[project] = self.project_summary(
                project,
                files,
                relationships.get(project, {})
            )

        return {
            "project_summaries": summaries,
            "recurring_patterns": self.find_recurring_patterns(
                summaries
            ),
            "consistency": self.find_consistency(
                summaries
            ),
            "differences": self.find_differences(
                summaries
            )
        }

    # =========================================================
    # PROJECT SUMMARY
    # =========================================================

    def project_summary(
        self,
        project,
        files,
        relationships
    ):
        return {
            "project": project,
            "file_count": len(files),

            "roles": dict(
                Counter(
                    file.get("role", "unknown")
                    for file in files
                )
            ),

            "components": self.count_nested(
                files,
                "components"
            ),

            "functions": self.count_nested(
                files,
                "functions"
            ),

            "state_usage": self.count_nested(
                files,
                "state"
            ),

            "effects": self.count_nested(
                files,
                "effects"
            ),

            "context_usage": self.count_nested(
                files,
                "contexts"
            ),

            "fetches": self.count_nested(
                files,
                "fetches"
            ),

            "forms": self.count_nested(
                files,
                "forms"
            ),

            "authentication": self.count_nested(
                files,
                "authentication"
            ),

            "local_storage": self.count_nested(
                files,
                "local_storage"
            ),

            "ui_categories": self.count_nested(
                files,
                "ui_categories"
            ),

            "array_methods": self.count_nested(
                files,
                "array_methods"
            ),

            "relationships": {
                key: len(value)
                for key, value in relationships.items()
                if isinstance(value, list)
            }
        }

    # =========================================================
    # RECURRING PATTERNS
    # =========================================================

    def find_recurring_patterns(self, summaries):
        patterns = {}

        for project, summary in summaries.items():

            self.add_pattern(
                patterns,
                "components",
                summary["components"],
                project
            )

            self.add_pattern(
                patterns,
                "functions",
                summary["functions"],
                project
            )

            self.add_pattern(
                patterns,
                "state_usage",
                summary["state_usage"],
                project
            )

            self.add_pattern(
                patterns,
                "effects",
                summary["effects"],
                project
            )

            self.add_pattern(
                patterns,
                "context_usage",
                summary["context_usage"],
                project
            )

            self.add_pattern(
                patterns,
                "fetches",
                summary["fetches"],
                project
            )

            self.add_pattern(
                patterns,
                "forms",
                summary["forms"],
                project
            )

            self.add_pattern(
                patterns,
                "authentication",
                summary["authentication"],
                project
            )

            self.add_pattern(
                patterns,
                "local_storage",
                summary["local_storage"],
                project
            )

        return patterns

    # =========================================================
    # CONSISTENCY
    # =========================================================

    def find_consistency(self, summaries):
        project_count = len(summaries)

        if project_count == 0:
            return {}

        fields = [
            "components",
            "functions",
            "state_usage",
            "effects",
            "context_usage",
            "fetches",
            "forms",
            "authentication",
            "local_storage"
        ]

        consistency = {}

        for field in fields:

            projects_with_usage = sum(
                1
                for summary in summaries.values()
                if summary.get(field, 0) > 0
            )

            percentage = (
                projects_with_usage / project_count
            ) * 100

            if percentage >= 75:
                level = "high"
            elif percentage >= 50:
                level = "medium"
            else:
                level = "low"

            consistency[field] = {
                "projects_found": projects_with_usage,
                "total_projects": project_count,
                "percentage": round(
                    percentage,
                    2
                ),
                "consistency": level
            }

        return consistency

    # =========================================================
    # DIFFERENCES
    # =========================================================

    def find_differences(self, summaries):
        differences = {}

        fields = [
            "components",
            "functions",
            "state_usage",
            "effects",
            "context_usage",
            "fetches",
            "forms",
            "authentication",
            "local_storage"
        ]

        for field in fields:

            differences[field] = {}

            for project, summary in summaries.items():
                differences[field][project] = summary.get(
                    field,
                    0
                )

        return differences

    # =========================================================
    # HELPERS
    # =========================================================

    def count_nested(self, files, key):
        count = 0

        for file in files:
            value = file.get(key, [])

            if isinstance(value, list):
                count += len(value)

            elif isinstance(value, dict):
                count += len(value)

            elif value:
                count += 1

        return count

    def add_pattern(
        self,
        patterns,
        name,
        count,
        project
    ):
        if name not in patterns:
            patterns[name] = {
                "occurrence_count": 0,
                "projects_found": []
            }

        patterns[name]["occurrence_count"] += count

        if (
            count > 0
            and project not in patterns[name]["projects_found"]
        ):
            patterns[name]["projects_found"].append(
                project
            )