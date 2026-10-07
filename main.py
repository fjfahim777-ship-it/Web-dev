from pathlib import Path

from config import REFERENCES_DIR, OUTPUT_DIR

from analyzer.scanner import scan_all_projects
from analyzer.reader import read_file, relative_path
from analyzer.extractor import CodeExtractor
from analyzer.pattern_analyzer import PatternAnalyzer
from analyzer.relationship_analyzer import RelationshipAnalyzer
from analyzer.cross_project import CrossProjectAnalyzer
from analyzer.evidence_validator import EvidenceValidator
from analyzer.knowledge_builder import KnowledgeBuilder


def main():

    print("\n==============================")
    print("   FAHIM PROJECT ANALYZER")
    print("==============================\n")

    references_dir = Path(REFERENCES_DIR)
    output_dir = Path(OUTPUT_DIR)

    # ---------------------------------------------------------
    # 1. SCAN
    # ---------------------------------------------------------

    print("[1/7] Scanning reference projects...")

    projects = scan_all_projects(
        references_dir
    )

    print(
        f"Found {len(projects)} projects."
    )

    # ---------------------------------------------------------
    # 2. READ + EXTRACT
    # ---------------------------------------------------------

    print("\n[2/7] Reading and analyzing source files...")

    extractor = CodeExtractor()

    project_data = {}

    for project_name, files in projects.items():

        print(
            f"  → {project_name}: "
            f"{len(files)} files"
        )

        project_path = references_dir / project_name

        analyzed_files = []

        for file_path in files:

            content = read_file(file_path)

            if not content:
                continue

            extracted = extractor.analyze_file(
                project_name,
                file_path,
                content,
            )

            # -------------------------------------------------
            # IMPORTANT:
            # Store project-relative paths only.
            # -------------------------------------------------

            extracted["file"] = relative_path(
                file_path,
                project_path,
            )

            # Keep original source for deep evidence.
            extracted["content"] = content

            analyzed_files.append(extracted)

        project_data[project_name] = {
            "project": project_name,
            "file_count": len(analyzed_files),
            "files": analyzed_files,
        }

    # ---------------------------------------------------------
    # 3. VALIDATE EVIDENCE
    # ---------------------------------------------------------

    print("\n[3/7] Validating extracted evidence...")

    validator = EvidenceValidator()

    for project_name, data in project_data.items():

        for file_data in data["files"]:

            # -------------------------------------------------
            # Fetch validation
            # -------------------------------------------------

            fetches = file_data.get(
                "fetches",
                [],
            )

            validated_fetches = (
                validator.validate_fetches(
                    fetches
                )
            )

            # Never destroy extractor evidence.
            if validated_fetches:
                file_data["fetches"] = validated_fetches
            else:
                file_data["fetches"] = fetches

            # -------------------------------------------------
            # Authentication validation
            # -------------------------------------------------

            auth = file_data.get(
                "authentication",
                [],
            )

            if auth:

                validated_auth = (
                    validator.validate_authentication(
                        [
                            {
                                "evidence": str(item)
                            }
                            if not isinstance(
                                item,
                                dict
                            )
                            else item
                            for item in auth
                        ]
                    )
                )

                # Keep original evidence if validation
                # could not classify it.
                if validated_auth:
                    file_data["authentication"] = (
                        validated_auth
                    )
                else:
                    file_data["authentication"] = auth

    # ---------------------------------------------------------
    # 4. RELATIONSHIPS
    # ---------------------------------------------------------

    print("\n[4/7] Building relationships and flows...")

    relationship_analyzer = (
        RelationshipAnalyzer()
    )

    relationships = {}

    for project_name, data in project_data.items():

        relationships[project_name] = (
            relationship_analyzer.analyze_project(
                project_name,
                data["files"],
            )
        )

    # ---------------------------------------------------------
    # 5. PATTERNS
    # ---------------------------------------------------------

    print("\n[5/7] Aggregating recurring patterns...")

    pattern_analyzer = PatternAnalyzer()

    for project_name, data in project_data.items():

        data["aggregated_patterns"] = (
            pattern_analyzer.aggregate(
                data["files"]
            )
        )

    # ---------------------------------------------------------
    # 6. CROSS PROJECT
    # ---------------------------------------------------------

    print("\n[6/7] Comparing projects...")

    cross_project_analyzer = (
        CrossProjectAnalyzer()
    )

    cross_project = (
        cross_project_analyzer.analyze(
            project_data,
            relationships,
        )
    )

    # ---------------------------------------------------------
    # 7. KNOWLEDGE
    # ---------------------------------------------------------

    print("\n[7/7] Building knowledge JSON...")

    builder = KnowledgeBuilder(
        output_dir
    )

    builder.build(
        project_data,
        relationships,
        cross_project,
    )

    # ---------------------------------------------------------
    # COMPLETE
    # ---------------------------------------------------------

    print("\n==============================")
    print(" ANALYSIS COMPLETE")
    print("==============================")

    print(
        f"\nOutput directory:\n"
        f"{output_dir.resolve()}"
    )

    print("\nGenerated knowledge files:")

    for path in sorted(
        output_dir.glob("*.json")
    ):
        print(
            f"  ✓ {path.name}"
        )

    print("\nDone.\n")


if __name__ == "__main__":
    main()