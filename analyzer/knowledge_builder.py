import json
from pathlib import Path


class KnowledgeBuilder:
    def __init__(self, output_dir):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

    # =========================================================
    # PUBLIC
    # =========================================================

    def build(
        self,
        project_data,
        relationships,
        cross_project,
    ):
        knowledge = {
            "general_coding_style": self.build_general(
                project_data
            ),
            "frontend_coding_style": self.build_frontend(
                project_data
            ),
            "component_patterns": self.build_components(
                project_data
            ),
            "react_nextjs_patterns": self.build_react(
                project_data
            ),
            "functionality_patterns": self.build_functionality(
                project_data,
                relationships,
            ),
            "api_patterns": self.build_api(
                project_data,
                relationships,
            ),
            "authentication_patterns": self.build_auth(
                project_data
            ),
            "styling_patterns": self.build_styling(
                project_data
            ),
            "naming_patterns": self.build_naming(
                project_data
            ),
            "cross_project_patterns": cross_project,
        }

        for filename, data in knowledge.items():
            self.write_json(
                filename + ".json",
                data,
            )

        self.write_json(
            "raw_project_analysis.json",
            project_data,
        )

        return knowledge

    # =========================================================
    # GENERAL
    # =========================================================

    def build_general(self, project_data):
        result = {
            "purpose": "Observed general coding style.",
            "projects": {},
            "recurring_patterns": [],
        }

        for project, data in project_data.items():
            files = data.get("files", [])

            result["projects"][project] = {
                "file_count": len(files),
                "file_roles": self.collect(
                    files,
                    "role",
                ),
                "imports": self.collect_nested(
                    files,
                    "imports",
                ),
                "exports": self.collect_nested(
                    files,
                    "exports",
                ),
                "functions": self.collect_nested(
                    files,
                    "functions",
                ),
                "interfaces": self.collect_nested(
                    files,
                    "interfaces",
                ),
                "types": self.collect_nested(
                    files,
                    "types",
                ),
                "conditionals": self.collect_nested(
                    files,
                    "conditionals",
                ),
            }

        return result

    # =========================================================
    # FRONTEND
    # =========================================================

    def build_frontend(self, project_data):
        result = {
            "purpose": "Observed frontend implementation patterns.",
            "projects": {},
        }

        for project, data in project_data.items():
            files = data.get("files", [])

            result["projects"][project] = {
                "ui_categories": self.collect_nested(
                    files,
                    "ui_categories",
                ),
                "components": self.collect_nested(
                    files,
                    "components",
                ),
                "responsive_classes": self.collect_nested(
                    files,
                    "tailwind",
                ),
            }

        return result

    # =========================================================
    # COMPONENTS
    # =========================================================

    def build_components(self, project_data):
        result = {
            "purpose": "Observed reusable component patterns.",
            "components": [],
        }

        for project, data in project_data.items():
            for file_data in data.get("files", []):
                for component in file_data.get(
                    "components",
                    [],
                ):
                    result["components"].append({
                        "project": project,
                        "file": file_data.get("file"),
                        "name": component,
                        "evidence": self.safe_example(
                            file_data
                        ),
                    })

        return result

    # =========================================================
    # REACT / NEXT
    # =========================================================

    def build_react(self, project_data):
        result = {
            "purpose": "Observed React and Next.js patterns.",
            "projects": {},
        }

        for project, data in project_data.items():
            files = data.get("files", [])

            result["projects"][project] = {
                "state": self.collect_nested(
                    files,
                    "state",
                ),
                "effects": self.collect_nested(
                    files,
                    "effects",
                ),
                "contexts": self.collect_nested(
                    files,
                    "contexts",
                ),
                "routing": self.collect_nested(
                    files,
                    "routing",
                ),
                "array_methods": self.collect_nested(
                    files,
                    "array_methods",
                ),
                "components": self.collect_nested(
                    files,
                    "components",
                ),
            }

        return result

    # =========================================================
    # FUNCTIONALITY
    # =========================================================

    def build_functionality(
        self,
        project_data,
        relationships,
    ):
        result = {
            "purpose": "Observed application functionality.",
            "flows": [],
            "pseudocode": {},
        }

        for project, project_relationships in relationships.items():
            for item in project_relationships.get(
                "functionality_flows",
                [],
            ):
                result["flows"].append(item)

            result["pseudocode"][project] = (
                project_relationships.get(
                    "pseudocode",
                    {},
                ).get(
                    "functionality_flows",
                    [],
                )
            )

        return result

    # =========================================================
    # API
    # =========================================================

    def build_api(
        self,
        project_data,
        relationships,
    ):
        result = {
            "purpose": (
                "Observed API routes and data-fetching "
                "implementation."
            ),
            "data_fetching": {
                "implementation_observations": [],
                "occurrence_count": 0,
                "projects_found": [],
            },
            "api_routes": [],
            "flows": [],
            "pseudocode": {},
        }

        for project, data in project_data.items():
            for file_data in data.get("files", []):
                fetches = file_data.get(
                    "fetches",
                    [],
                )

                for fetch in fetches:
                    result["data_fetching"][
                        "implementation_observations"
                    ].append({
                        "project": project,
                        "file": file_data.get("file"),
                        "url_expression": fetch.get(
                            "url_expression",
                            "",
                        ),
                        "method": fetch.get(
                            "method",
                            "GET",
                        ),
                        "code": fetch.get(
                            "code",
                            "",
                        ),
                        "validation": "source_observed",
                    })

                    result["data_fetching"][
                        "occurrence_count"
                    ] += 1

                    if project not in result[
                        "data_fetching"
                    ]["projects_found"]:
                        result["data_fetching"][
                            "projects_found"
                        ].append(project)

                if file_data.get("role") == "api_route":
                    result["api_routes"].append({
                        "project": project,
                        "file": file_data.get("file"),
                        "methods": file_data.get(
                            "api_methods",
                            [],
                        ),
                        "evidence": self.safe_example(
                            file_data
                        ),
                    })

        for project, project_relationships in relationships.items():
            result["flows"].extend(
                project_relationships.get(
                    "api_flows",
                    [],
                )
            )

            result["pseudocode"][project] = (
                project_relationships.get(
                    "pseudocode",
                    {},
                ).get(
                    "api_flows",
                    [],
                )
            )

        project_count = len(
            result["data_fetching"]["projects_found"]
        )

        if (
            project_count >= 3
            and result["data_fetching"]["occurrence_count"] >= 6
        ):
            confidence = "high"
        elif project_count >= 2:
            confidence = "medium"
        else:
            confidence = "low"

        result["data_fetching"]["confidence"] = confidence

        return result

    # =========================================================
    # AUTHENTICATION
    # =========================================================

    def build_auth(self, project_data):
        evidence = []

        for project, data in project_data.items():
            for file_data in data.get("files", []):
                auth = file_data.get(
                    "authentication",
                    [],
                )

                for item in auth:
                    evidence.append({
                        "project": project,
                        "file": file_data.get("file"),
                        "evidence": item,
                    })

        if not evidence:
            return {
                "status": "no_evidence_found",
                "important_rule": (
                    "Do not invent authentication "
                    "patterns when source projects "
                    "do not contain them."
                ),
                "evidence": [],
            }

        return {
            "status": "evidence_found",
            "important_rule": (
                "Only use authentication patterns "
                "supported by actual source evidence."
            ),
            "evidence": evidence,
        }

    # =========================================================
    # STYLING
    # =========================================================

    def build_styling(self, project_data):
        result = {
            "purpose": (
                "Observed Tailwind and styling patterns."
            ),
            "projects": {},
            "recurring_classes": {},
        }

        for project, data in project_data.items():
            files = data.get("files", [])

            classes = []

            for file_data in files:
                tailwind = file_data.get(
                    "tailwind",
                    [],
                )

                if isinstance(tailwind, list):
                    classes.extend(tailwind)

            result["projects"][project] = {
                "tailwind_classes": classes,
            }

            for value in classes:
                result["recurring_classes"][value] = (
                    result["recurring_classes"].get(
                        value,
                        0,
                    ) + 1
                )

        return result

    # =========================================================
    # NAMING
    # =========================================================

    def build_naming(self, project_data):
        result = {
            "purpose": "Observed naming patterns.",
            "projects": {},
        }

        for project, data in project_data.items():
            files = data.get("files", [])

            result["projects"][project] = {
                "variables": self.collect_nested(
                    files,
                    "variables",
                ),
                "functions": self.collect_nested(
                    files,
                    "functions",
                ),
                "components": self.collect_nested(
                    files,
                    "components",
                ),
            }

        return result

    # =========================================================
    # HELPERS
    # =========================================================

    def collect(self, files, key):
        result = []

        for file_data in files:
            value = file_data.get(key)

            if isinstance(value, str):
                result.append(value)

            elif isinstance(value, list):
                result.extend(value)

        return result

    def collect_nested(self, files, key):
        result = []

        for file_data in files:
            value = file_data.get(key)

            if isinstance(value, list):
                result.extend(value)

            elif isinstance(value, dict):
                result.append(value)

        return result

    def safe_example(self, file_data):
        content = file_data.get("content", "")

        if len(content) <= 1000:
            return content

        return content[:1000]

    def write_json(self, filename, data):
        path = self.output_dir / filename

        with path.open(
            "w",
            encoding="utf-8",
        ) as file:
            json.dump(
                data,
                file,
                indent=2,
                ensure_ascii=False,
            )