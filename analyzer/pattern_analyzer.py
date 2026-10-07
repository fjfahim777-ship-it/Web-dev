from collections import Counter, defaultdict


class PatternAnalyzer:

    def aggregate(self, analyzed_files):
        patterns = defaultdict(list)

        for file in analyzed_files:
            for key in [
                "state",
                "effects",
                "context",
                "fetches",
                "components",
                "functions",
                "interfaces",
                "types",
                "array_methods",
                "routing",
                "storage",
                "forms",
                "authentication",
                "ui_categories",
                "conditionals",
            ]:
                for item in file.get(key, []):
                    patterns[key].append({
                        "project": file.get("project"),
                        "file": file.get("file"),
                        "evidence": item,
                    })

        return {
            key: self.summarize(items)
            for key, items in patterns.items()
        }

    def summarize(self, items):
        project_set = set()

        for item in items:
            project_set.add(item.get("project"))

        count = len(items)
        project_count = len(project_set)

        if project_count >= 3 and count >= 6:
            confidence = "high"
        elif project_count >= 2 and count >= 3:
            confidence = "medium"
        else:
            confidence = "low"

        return {
            "occurrence_count": count,
            "projects_found": sorted(project_set),
            "project_count": project_count,
            "confidence": confidence,
            "examples": items[:20],
        }

    def naming_summary(self, analyzed_files):
        variables = []
        functions = []
        components = []

        for file in analyzed_files:
            naming = file.get("naming", {})

            variables.extend(naming.get("variables", []))
            functions.extend(naming.get("functions", []))
            components.extend(naming.get("components", []))

        return {
            "variables": self.count_names(variables),
            "functions": self.count_names(functions),
            "components": self.count_names(components),
        }

    def count_names(self, names):
        counts = Counter(names)

        return [
            {
                "name": name,
                "count": count
            }
            for name, count in counts.most_common(100)
        ]