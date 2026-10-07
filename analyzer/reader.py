from pathlib import Path


def read_file(path):
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        try:
            return path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            return ""

    except Exception:
        return ""


def relative_path(path, project_path):
    try:
        return str(Path(path).relative_to(project_path))
    except ValueError:
        return str(path)