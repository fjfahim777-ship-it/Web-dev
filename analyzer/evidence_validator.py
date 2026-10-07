import re


class EvidenceValidator:
    """
    Validates extracted observations before they become coding knowledge.

    The goal is not to understand every piece of code perfectly.
    The goal is to prevent weak keyword matches from becoming strong
    coding-style rules.
    """

    def __init__(self):
        self.auth_call_patterns = [
            r"\bsignIn\s*\(",
            r"\bsignUp\s*\(",
            r"\bsignOut\s*\(",
            r"\blogin\s*\(",
            r"\blogout\s*\(",
            r"\bregister\s*\(",
            r"\bauthClient\.useSession\s*\(",
            r"\buseSession\s*\(",
            r"\bonAuthStateChanged\s*\(",
            r"\bNextAuth\s*\(",
            r"\btoNextJsHandler\s*\(",
            r"\bcurrentUser\b",
            r"\bsession\??\.",
            r"\bsession\s*=",
        ]

        self.auth_import_patterns = [
            r"from\s+[\"'].*auth",
            r"from\s+[\"'].*better-auth",
            r"from\s+[\"'].*next-auth",
            r"import\s+.*auth",
        ]

    # ---------------------------------------------------------
    # Generic
    # ---------------------------------------------------------

    def clean_code(self, code):
        if not code:
            return ""

        return code.strip()

    def is_real_code_evidence(self, code):
        """
        Reject extremely weak observations.
        """
        code = self.clean_code(code)

        if not code:
            return False

        if len(code) < 8:
            return False

        return True

    # ---------------------------------------------------------
    # Authentication
    # ---------------------------------------------------------

    def validate_authentication(self, evidence):
        """
        Authentication should only be considered strong evidence when
        actual auth calls/imports/session usage are present.
        """

        if not evidence:
            return []

        validated = []

        for item in evidence:
            code = item.get("evidence", "")

            if isinstance(code, list):
                code = " ".join(str(x) for x in code)

            if not self.is_real_code_evidence(code):
                continue

            matches = []

            for pattern in self.auth_call_patterns:
                if re.search(pattern, code):
                    matches.append(pattern)

            imports = []

            for pattern in self.auth_import_patterns:
                if re.search(pattern, code):
                    imports.append(pattern)

            if matches or imports:
                item = dict(item)

                item["validation"] = {
                    "status": "validated",
                    "auth_calls_detected": len(matches),
                    "auth_imports_detected": len(imports),
                }

                validated.append(item)

        return validated

    # ---------------------------------------------------------
    # Fetch / API
    # ---------------------------------------------------------

    def validate_fetch(self, fetch):
        """
        Fetch evidence is valid when actual fetch() usage exists.
        """

        code = fetch.get("code", "")

        if not self.is_real_code_evidence(code):
            return None

        if not re.search(r"\bfetch\s*\(", code):
            return None

        result = dict(fetch)

        result["validation"] = {
            "status": "validated",
            "reason": "Actual fetch() call detected in source code.",
        }

        return result

    def validate_fetches(self, fetches):
        validated = []

        for fetch in fetches:
            result = self.validate_fetch(fetch)

            if result:
                validated.append(result)

        return validated

    # ---------------------------------------------------------
    # UI functionality
    # ---------------------------------------------------------

    def validate_functionality(self, functionality):
        """
        Prevent simple JavaScript array methods from automatically
        becoming user-facing functionality.

        Example:
            news.filter(...)
        does NOT automatically mean:
            "The application has a filter feature."
        """

        if not functionality:
            return []

        validated = []

        for item in functionality:
            name = item.get("name", "")
            code = item.get("code", "")
            context = item.get("context", "")

            if not code and not context:
                continue

            item = dict(item)

            if name in {"filter", "search", "sort"}:
                ui_keywords = [
                    "input",
                    "query",
                    "search",
                    "keyword",
                    "sortBy",
                    "selected",
                    "category",
                    "button",
                    "onChange",
                    "onClick",
                ]

                combined = f"{code} {context}".lower()

                has_ui_context = any(
                    keyword.lower() in combined
                    for keyword in ui_keywords
                )

                if has_ui_context:
                    item["evidence_level"] = "observed"
                else:
                    item["evidence_level"] = "implementation_detail"

            else:
                item["evidence_level"] = "observed"

            validated.append(item)

        return validated

    # ---------------------------------------------------------
    # General classification
    # ---------------------------------------------------------

    def classify_observation(
        self,
        occurrence_count,
        project_count,
        has_source_example=True,
    ):
        if not has_source_example:
            return "weak"

        if project_count >= 3 and occurrence_count >= 5:
            return "strong"

        if project_count >= 2 and occurrence_count >= 3:
            return "moderate"

        return "limited"