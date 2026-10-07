from pathlib import Path
from config import SUPPORTED_EXTENSIONS, IGNORED_DIRECTORIES


def scan_project(project_path):
    files = []

    for path in project_path.rglob("*"):
        if not path.is_file():
            continue

        if any(part in IGNORED_DIRECTORIES for part in path.parts):
            continue

        if path.suffix.lower() in SUPPORTED_EXTENSIONS:
            files.append(path)

    return sorted(files)


def scan_all_projects(references_dir):
    projects = {}

    for project_path in sorted(references_dir.iterdir()):
        if not project_path.is_dir():
            continue

        files = scan_project(project_path)

        if files:
            projects[project_path.name] = files

    return projects