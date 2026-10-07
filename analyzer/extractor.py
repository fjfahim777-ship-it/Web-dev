import re
from pathlib import Path


class CodeExtractor:

    def __init__(self, max_example_length=1200):
        self.max_example_length = max_example_length

    def analyze_file(self, project_name, file_path, content):
        relative_path = str(Path(file_path)).replace("\\", "/")

        result = {
            "project": project_name,
            "file": relative_path,
            "extension": Path(file_path).suffix,
            "role": self.detect_file_role(relative_path),
            "imports": self.extract_imports(content),
            "exports": self.extract_exports(content),
            "components": self.extract_components(content),
            "functions": self.extract_functions(content),
            "interfaces": self.extract_interfaces(content),
            "types": self.extract_types(content),
            "state": self.extract_state(content),
            "effects": self.extract_effects(content),
            "context": self.extract_context(content),
            "fetches": self.extract_fetches(content),
            "array_methods": self.extract_array_methods(content),
            "event_handlers": self.extract_event_handlers(content),
            "forms": self.extract_forms(content),
            "routing": self.extract_routing(content),
            "storage": self.extract_storage(content),
            "authentication": self.extract_authentication(content),
            "ui_categories": self.detect_ui_categories(relative_path, content),
            "tailwind": self.extract_tailwind(content),
            "conditionals": self.extract_conditionals(content),
            "naming": self.extract_naming(content),
            "code_examples": self.extract_examples(content),
        }

        return result

    # ---------------------------------------------------------
    # FILE ROLE
    # ---------------------------------------------------------

    def detect_file_role(self, path):
        p = path.lower()

        if "/api/" in p or "/route." in p:
            return "api_route"

        if "context" in p or "provider" in p:
            return "context"

        if "hook" in p:
            return "custom_hook"

        if "layout." in p:
            return "layout"

        if "loading." in p:
            return "loading"

        if "error." in p:
            return "error"

        if "not-found." in p:
            return "not_found"

        if "/page." in p:
            return "page"

        if "/components/" in p:
            return "component"

        if "/utils/" in p or "/lib/" in p:
            return "utility"

        return "source"

    # ---------------------------------------------------------
    # IMPORTS / EXPORTS
    # ---------------------------------------------------------

    def extract_imports(self, code):
        pattern = r'import\s+(.*?)\s+from\s+[\'"](.+?)[\'"]'

        return [
            {
                "import": match.group(1).strip(),
                "source": match.group(2)
            }
            for match in re.finditer(pattern, code)
        ]

    def extract_exports(self, code):
        results = []

        if re.search(r'export\s+default', code):
            results.append("default")

        for match in re.finditer(
            r'export\s+(?:const|function|class|interface|type)\s+([A-Za-z_$][\w$]*)',
            code
        ):
            results.append(match.group(1))

        return results

    # ---------------------------------------------------------
    # COMPONENTS
    # ---------------------------------------------------------

    def extract_components(self, code):
        results = []

        patterns = [
            r'(?:export\s+)?(?:default\s+)?function\s+([A-Z][A-Za-z0-9_]*)',
            r'(?:export\s+)?const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>',
        ]

        for pattern in patterns:
            for match in re.finditer(pattern, code):
                results.append({
                    "name": match.group(1),
                    "type": "component"
                })

        return self.unique_dicts(results)

    # ---------------------------------------------------------
    # FUNCTIONS
    # ---------------------------------------------------------

    def extract_functions(self, code):
        results = []

        for match in re.finditer(
            r'(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\((.*?)\)',
            code
        ):
            results.append({
                "name": match.group(1),
                "parameters": match.group(2).strip(),
                "async": bool(re.search(r'async\s+function', match.group(0)))
            })

        for match in re.finditer(
            r'(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\((.*?)\)\s*=>',
            code
        ):
            results.append({
                "name": match.group(1),
                "parameters": match.group(2).strip(),
                "async": "async" in match.group(0)
            })

        return self.unique_dicts(results)

    # ---------------------------------------------------------
    # TYPESCRIPT
    # ---------------------------------------------------------

    def extract_interfaces(self, code):
        results = []

        for match in re.finditer(
            r'(?:export\s+)?interface\s+([A-Za-z_$][\w$]*)\s*\{([\s\S]*?)\}',
            code
        ):
            fields = []

            for field in re.finditer(
                r'([A-Za-z_$][\w$]*)\??\s*:\s*([^;\n]+)',
                match.group(2)
            ):
                fields.append({
                    "name": field.group(1),
                    "type": field.group(2).strip()
                })

            results.append({
                "name": match.group(1),
                "fields": fields
            })

        return results

    def extract_types(self, code):
        results = []

        for match in re.finditer(
            r'(?:export\s+)?type\s+([A-Za-z_$][\w$]*)\s*=\s*([^\n;]+)',
            code
        ):
            results.append({
                "name": match.group(1),
                "definition": match.group(2).strip()
            })

        return results

    # ---------------------------------------------------------
    # STATE
    # ---------------------------------------------------------

    def extract_state(self, code):
        results = []

        pattern = (
            r'(?:const|let)\s*\[\s*([A-Za-z_$][\w$]*)\s*,\s*'
            r'([A-Za-z_$][\w$]*)\s*\]\s*='
            r'\s*useState(?:<([^>]+)>)?\s*\(([\s\S]*?)\)'
        )

        for match in re.finditer(pattern, code):
            results.append({
                "state": match.group(1),
                "setter": match.group(2),
                "type": match.group(3),
                "initial_value": match.group(4).strip()
            })

        return results

    # ---------------------------------------------------------
    # EFFECT
    # ---------------------------------------------------------

    def extract_effects(self, code):
        results = []

        for match in re.finditer(
            r'useEffect\s*\(\s*\(\s*\)\s*=>\s*\{([\s\S]*?)\}\s*,\s*\[([\s\S]*?)\]\s*\)',
            code
        ):
            results.append({
                "body": self.clean_example(match.group(1)),
                "dependencies": [
                    x.strip()
                    for x in match.group(2).split(",")
                    if x.strip()
                ]
            })

        return results

    # ---------------------------------------------------------
    # CONTEXT
    # ---------------------------------------------------------

    def extract_context(self, code):
        results = []

        for match in re.finditer(
            r'(?:createContext|useContext)\s*(?:<[^>]+>)?\s*\(\s*([A-Za-z_$][\w$]*)?',
            code
        ):
            results.append({
                "kind": "context_usage",
                "value": match.group(1) or "context"
            })

        for match in re.finditer(
            r'([A-Za-z_$][\w$]*Context)\.Provider',
            code
        ):
            results.append({
                "kind": "provider",
                "context": match.group(1)
            })

        return results

    # ---------------------------------------------------------
    # FETCH / API
    # ---------------------------------------------------------

    def extract_fetches(self, code):
        results = []

        fetch_pattern = re.compile(
            r'fetch\s*\(\s*([\'"`])([\s\S]*?)\1'
            r'(?:\s*,\s*\{([\s\S]*?)\})?\s*\)',
            re.I
        )

        for match in fetch_pattern.finditer(code):

            full = match.group(0)

            url = match.group(2)
            options = match.group(3) or ""

            # HTTP method
            method_match = re.search(
                r'method\s*:\s*[\'"]([^\'"]+)',
                options,
                re.I
            )

            method = (
                method_match.group(1).upper()
                if method_match
                else "GET"
            )

            # Nearby code
            start = match.start()

            nearby_end = min(
                len(code),
                match.end() + 1000
            )

            nearby_code = code[start:nearby_end]

            results.append({
                "url": url,
                "url_expression": url,
                "method": method,

                "options": self.clean_example(options),

                "has_body": "body" in options,

                "uses_json": ".json()" in nearby_code,

                "has_try_catch": self.has_nearby_try_catch(
                    code,
                    start
                ),

                "example": self.clean_example(full),

                "code": self.clean_example(full),

                "source": self.clean_example(full)
            })

        return results

    # ---------------------------------------------------------
    # ARRAY METHODS
    # ---------------------------------------------------------

    def extract_array_methods(self, code):
        methods = [
            "map",
            "filter",
            "find",
            "reduce",
            "sort",
            "forEach",
            "some",
            "includes"
        ]

        results = []

        for method in methods:
            matches = list(
                re.finditer(
                    rf'\.\s*{method}\s*\(',
                    code
                )
            )

            if matches:
                results.append({
                    "method": method,
                    "count": len(matches)
                })

        return results

    # ---------------------------------------------------------
    # EVENT HANDLERS
    # ---------------------------------------------------------

    def extract_event_handlers(self, code):
        results = []

        for match in re.finditer(
            r'(onClick|onChange|onSubmit|onInput|onBlur|onFocus)\s*=\s*\{([\s\S]*?)\}',
            code
        ):
            results.append({
                "event": match.group(1),
                "handler": self.clean_example(match.group(2))
            })

        return results

    # ---------------------------------------------------------
    # FORMS
    # ---------------------------------------------------------

    def extract_forms(self, code):
        results = []

        if re.search(r'<form\b', code):
            results.append({
                "type": "form",
                "has_on_submit": "onSubmit" in code,
                "has_inputs": bool(
                    re.search(
                        r'<input\b|<textarea\b|<select\b',
                        code
                    )
                ),
                "has_button": bool(
                    re.search(r'<button\b', code)
                )
            })

        return results

    # ---------------------------------------------------------
    # ROUTING
    # ---------------------------------------------------------

    def extract_routing(self, code):
        results = []

        patterns = {
            "usePathname": r'\busePathname\b',
            "useRouter": r'\buseRouter\b',
            "useParams": r'\buseParams\b',
            "Link": r'<Link\b',
            "router.push": r'\.push\s*\(',
            "dynamic_route": r'\[[^\]]+\]'
        }

        for name, pattern in patterns.items():
            count = len(re.findall(pattern, code))

            if count:
                results.append({
                    "pattern": name,
                    "count": count
                })

        return results

    # ---------------------------------------------------------
    # LOCAL STORAGE
    # ---------------------------------------------------------

    def extract_storage(self, code):
        results = []

        for method in [
            "getItem",
            "setItem",
            "removeItem",
            "clear"
        ]:
            count = len(
                re.findall(
                    rf'localStorage\.{method}',
                    code
                )
            )

            if count:
                results.append({
                    "method": method,
                    "count": count
                })

        return results

    # ---------------------------------------------------------
    # AUTHENTICATION
    # ---------------------------------------------------------

    def extract_authentication(self, code):
        keywords = [
            "login",
            "logout",
            "register",
            "signup",
            "signin",
            "signIn",
            "signOut",
            "signUp",
            "authentication",
            "authorization",
            "session",
            "currentUser",
            "token",
            "accessToken",
            "refreshToken",
            "firebase/auth",
            "next-auth",
            "NextAuth",
            "GoogleAuthProvider",
            "onAuthStateChanged"
        ]

        found = []

        for keyword in keywords:
            if keyword in code:
                found.append(keyword)

        if not found:
            return []

        return [{
            "keywords": found,
            "evidence": self.clean_example(
                self.find_auth_context(code, found)
            )
        }]

    # ---------------------------------------------------------
    # UI CATEGORY
    # ---------------------------------------------------------

    def detect_ui_categories(self, path, code):
        p = path.lower()
        c = code.lower()

        categories = []

        checks = {
            "navbar": ["navbar", "navlinks", "<nav"],
            "footer": ["footer", "<footer"],
            "hero": ["hero", "banner"],
            "card": ["card", "cards"],
            "form": ["<form"],
            "modal": ["modal", "dialog"],
            "button": ["<button", "btn"],
            "details": ["details", "[id]", "description"],
            "list": [".map("],
            "search": ["search"],
            "filter": ["filter"],
            "pagination": ["pagination", "page"],
            "loading": ["loading", "spinner"],
            "error": ["error"],
            "empty_state": ["no data", "no result", "empty"]
        }

        for category, terms in checks.items():
            if any(
                term in p or term in c
                for term in terms
            ):
                categories.append(category)

        return sorted(set(categories))

    # ---------------------------------------------------------
    # TAILWIND
    # ---------------------------------------------------------

    def extract_tailwind(self, code):
        classes = []

        for match in re.finditer(
            r'className\s*=\s*[{"`]?([^"`}\n]+)',
            code
        ):
            value = match.group(1).strip()

            for cls in re.split(r'\s+', value):
                if cls:
                    classes.append(cls)

        categories = {
            "layout": [],
            "spacing": [],
            "typography": [],
            "responsive": [],
            "color": [],
            "border": [],
            "radius": [],
            "shadow": [],
            "interaction": [],
            "flex_grid": []
        }

        for cls in classes:

            if re.match(
                r'(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr)-',
                cls
            ):
                categories["spacing"].append(cls)

            if re.match(
                r'(text|font|leading|tracking)-',
                cls
            ):
                categories["typography"].append(cls)

            if re.match(
                r'(sm|md|lg|xl|2xl):',
                cls
            ):
                categories["responsive"].append(cls)

            if re.match(
                r'(bg|text|from|to|via)-',
                cls
            ):
                categories["color"].append(cls)

            if "border" in cls:
                categories["border"].append(cls)

            if "rounded" in cls:
                categories["radius"].append(cls)

            if "shadow" in cls:
                categories["shadow"].append(cls)

            if any(
                x in cls
                for x in [
                    "hover:",
                    "focus:",
                    "active:",
                    "transition",
                    "duration"
                ]
            ):
                categories["interaction"].append(cls)

            if (
                cls in ["flex", "grid", "block", "inline-block"]
                or cls.startswith(
                    (
                        "flex-",
                        "grid-",
                        "justify-",
                        "items-",
                        "gap-"
                    )
                )
            ):
                categories["flex_grid"].append(cls)

            if cls in [
                "container",
                "relative",
                "absolute",
                "fixed",
                "sticky"
            ]:
                categories["layout"].append(cls)

        return {
            "classes": sorted(set(classes)),
            "categories": {
                key: sorted(set(value))
                for key, value in categories.items()
                if value
            }
        }

    # ---------------------------------------------------------
    # CONDITIONALS
    # ---------------------------------------------------------

    def extract_conditionals(self, code):
        results = []

        patterns = {
            "ternary": r'\?.*:',
            "logical_and": r'&&',
            "if_statement": r'\bif\s*\(',
            "optional_chaining": r'\?\.',
            "nullish": r'\?\?'
        }

        for name, pattern in patterns.items():
            count = len(
                re.findall(pattern, code)
            )

            if count:
                results.append({
                    "pattern": name,
                    "count": count
                })

        return results

    # ---------------------------------------------------------
    # NAMING
    # ---------------------------------------------------------

    def extract_naming(self, code):
        variables = re.findall(
            r'\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)',
            code
        )

        functions = re.findall(
            r'(?:function\s+|const\s+)([A-Za-z_$][\w$]*)'
            r'\s*(?:=\s*(?:async\s*)?\([^)]*\)\s*=>|\()',
            code
        )

        components = re.findall(
            r'(?:function|const)\s+([A-Z][A-Za-z0-9_]*)',
            code
        )

        return {
            "variables": variables[:100],
            "functions": functions[:100],
            "components": components[:100]
        }

    # ---------------------------------------------------------
    # EXAMPLES
    # ---------------------------------------------------------

    def extract_examples(self, code):
        examples = []

        patterns = [
            r'useState\s*\([^;]+\)',
            r'useEffect\s*\([\s\S]{0,300}?\)',
            r'fetch\s*\([\s\S]{0,500}?\)',
            r'\.map\s*\([\s\S]{0,250}?\)',
            r'localStorage\.[A-Za-z]+\s*\([\s\S]{0,200}?\)'
        ]

        for pattern in patterns:
            for match in re.finditer(pattern, code):
                example = self.clean_example(
                    match.group(0)
                )

                if example and len(example) > 15:
                    examples.append(
                        example[:self.max_example_length]
                    )

        return examples[:10]

    # ---------------------------------------------------------
    # HELPERS
    # ---------------------------------------------------------

    def has_nearby_try_catch(self, code, position):
        start = max(0, position - 700)
        end = min(len(code), position + 1000)

        nearby = code[start:end]

        return "try" in nearby and "catch" in nearby

    def find_auth_context(self, code, keywords):
        for keyword in keywords:
            position = code.find(keyword)

            if position != -1:
                start = max(0, position - 250)
                end = min(len(code), position + 500)

                return code[start:end]

        return ""

    def clean_example(self, text):
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    def unique_dicts(self, items):
        seen = set()
        result = []

        for item in items:
            key = tuple(sorted(item.items()))

            if key not in seen:
                seen.add(key)
                result.append(item)

        return result