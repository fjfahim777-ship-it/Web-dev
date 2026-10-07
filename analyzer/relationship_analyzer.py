import re


class RelationshipAnalyzer:

    def __init__(self, max_example_length=1500):
        self.max_example_length = max_example_length

    # =========================================================
    # PUBLIC
    # =========================================================

    def analyze_project(self, project_name, analyzed_files):

        relationships = {
            "state_flows": [],
            "data_flows": [],
            "functionality_flows": [],
            "api_flows": [],
            "context_flows": [],
            "ui_flows": [],
        }

        for file_data in analyzed_files:

            content = file_data.get("content", "")
            file_path = file_data.get("file", "")

            if not content:
                continue

            relationships["state_flows"].extend(
                self.extract_state_flows(
                    project_name,
                    file_path,
                    content,
                    file_data,
                )
            )

            relationships["data_flows"].extend(
                self.extract_data_flows(
                    project_name,
                    file_path,
                    content,
                    file_data,
                )
            )

            relationships["functionality_flows"].extend(
                self.extract_functionality_flows(
                    project_name,
                    file_path,
                    content,
                    file_data,
                )
            )

            relationships["api_flows"].extend(
                self.extract_api_flows(
                    project_name,
                    file_path,
                    content,
                    file_data,
                )
            )

            relationships["context_flows"].extend(
                self.extract_context_flows(
                    project_name,
                    file_path,
                    content,
                    file_data,
                )
            )

            relationships["ui_flows"].extend(
                self.extract_ui_flows(
                    project_name,
                    file_path,
                    content,
                    file_data,
                )
            )

        relationships["pseudocode"] = self.build_pseudocode(
            relationships
        )

        return relationships

    # =========================================================
    # STATE
    # =========================================================

    def extract_state_flows(
        self,
        project,
        file_path,
        content,
        file_data,
    ):

        results = []

        for state in file_data.get("state", []):

            state_name = state.get("state", "")
            setter = state.get("setter", "")

            if not state_name:
                continue

            state_usage = self.find_state_usage(
                content,
                state_name,
                setter,
            )

            flow = [
                f"create state {state_name}",
            ]

            pseudocode = [
                f"create {state_name}",
            ]

            if setter:
                flow.append(
                    f"update {state_name} through {setter}"
                )
                pseudocode.append(
                    f"update {state_name} when required"
                )

            flow.append(
                f"use {state_name} in component logic or rendering"
            )

            pseudocode.append(
                f"use {state_name} while rendering or processing data"
            )

            results.append({
                "project": project,
                "file": file_path,
                "type": "state_flow",
                "state": state_name,
                "setter": setter,
                "flow": flow,
                "pseudocode": pseudocode,
                "usage": state_usage,
                "evidence": self.nearby_code(
                    content,
                    state_name,
                ),
            })

        return results

    # =========================================================
    # DATA
    # =========================================================

    def extract_data_flows(
        self,
        project,
        file_path,
        content,
        file_data,
    ):

        results = []

        for fetch in file_data.get("fetches", []):

            url = (
                fetch.get("url_expression")
                or fetch.get("url")
                or ""
            )

            method = fetch.get(
                "method",
                "GET",
            )

            code = (
                fetch.get("code")
                or fetch.get("example")
                or fetch.get("source")
                or ""
            )

            response_handling = self.extract_response_handling(
                content,
                code,
            )

            flow = [
                f"make {method} request to {url or 'data endpoint'}",
                "wait for response",
            ]

            pseudocode = [
                f"fetch {url or 'endpoint'}",
                "await response",
            ]

            if response_handling["json"]:

                flow.append(
                    "convert response to JSON"
                )

                pseudocode.append(
                    "await response.json()"
                )

            if response_handling["variable"]:

                flow.append(
                    f"store response in {response_handling['variable']}"
                )

                pseudocode.append(
                    f"store returned data in {response_handling['variable']}"
                )

            if response_handling["state"]:

                flow.append(
                    f"store returned data in state {response_handling['state']}"
                )

                pseudocode.append(
                    f"update {response_handling['state']} with returned data"
                )

            flow.append(
                "use returned data in component/page"
            )

            pseudocode.append(
                "use returned data in component/page"
            )

            results.append({
                "project": project,
                "file": file_path,
                "type": "data_fetch_flow",
                "url": url,
                "method": method,
                "response_handling": response_handling,
                "flow": flow,
                "pseudocode": pseudocode,
                "evidence": code or self.nearby_code(
                    content,
                    "fetch(",
                ),
            })

        return results

    # =========================================================
    # FUNCTIONALITY
    # =========================================================

    def extract_functionality_flows(
        self,
        project,
        file_path,
        content,
        file_data,
    ):

        results = []
        lower = content.lower()

        # -----------------------------------------------------
        # Search
        # -----------------------------------------------------

        if (
            "search" in lower
            and (
                "input" in lower
                or "onchange" in lower
                or "query" in lower
            )
        ):

            evidence = self.find_best_evidence(
                content,
                [
                    "search",
                    "query",
                    "onChange",
                    "onchange",
                ],
            )

            results.append({
                "project": project,
                "file": file_path,
                "feature": "search",
                "evidence_level": "observed",
                "flow": [
                    "receive search input",
                    "store or read search value",
                    "compare search value with data",
                    "render matching results",
                ],
                "pseudocode": [
                    "read search input",
                    "store search value",
                    "filter or search the collection",
                    "render matching results",
                ],
                "evidence": evidence,
            })

        # -----------------------------------------------------
        # Sorting
        # -----------------------------------------------------

        if (
            ".sort(" in content
            and (
                "sortby" in lower
                or "sort by" in lower
                or "selected" in lower
                or "sort(" in lower
            )
        ):

            results.append({
                "project": project,
                "file": file_path,
                "feature": "sorting",
                "evidence_level": "observed",
                "flow": [
                    "identify sorting option or condition",
                    "apply sort operation",
                    "render reordered collection",
                ],
                "pseudocode": [
                    "read selected sort option if present",
                    "sort collection",
                    "render sorted collection",
                ],
                "evidence": self.nearby_code(
                    content,
                    ".sort(",
                ),
            })

        # -----------------------------------------------------
        # Filtering
        # -----------------------------------------------------

        if ".filter(" in content:

            results.append({
                "project": project,
                "file": file_path,
                "feature": "filtering",
                "evidence_level": "observed",
                "flow": [
                    "identify filtering condition",
                    "filter collection",
                    "render matching items",
                ],
                "pseudocode": [
                    "read filtering condition",
                    "filter collection using condition",
                    "render filtered items",
                ],
                "evidence": self.nearby_code(
                    content,
                    ".filter(",
                ),
            })

        # -----------------------------------------------------
        # Forms
        # -----------------------------------------------------

        if (
            "<form" in lower
            or "formdata" in lower
            or "onsubmit" in lower
        ):

            evidence = self.find_best_evidence(
                content,
                [
                    "<form",
                    "onSubmit",
                    "onSubmit=",
                    "FormData",
                ],
            )

            results.append({
                "project": project,
                "file": file_path,
                "feature": "form_handling",
                "evidence_level": "observed",
                "flow": [
                    "render form",
                    "receive user input",
                    "handle submission",
                    "process submitted data",
                ],
                "pseudocode": [
                    "render form",
                    "read form values",
                    "handle submit event",
                    "process submitted data",
                ],
                "evidence": evidence,
            })

        # -----------------------------------------------------
        # Local Storage
        # -----------------------------------------------------

        if "localstorage" in lower:

            storage_operations = []

            if re.search(
                r"localStorage\.getItem\s*\(",
                content,
                re.I,
            ):
                storage_operations.append(
                    "read stored value"
                )

            if re.search(
                r"localStorage\.setItem\s*\(",
                content,
                re.I,
            ):
                storage_operations.append(
                    "write stored value"
                )

            if re.search(
                r"localStorage\.removeItem\s*\(",
                content,
                re.I,
            ):
                storage_operations.append(
                    "remove stored value"
                )

            results.append({
                "project": project,
                "file": file_path,
                "feature": "local_storage",
                "evidence_level": "observed",
                "operations": storage_operations,
                "flow": [
                    "access browser localStorage",
                    *storage_operations,
                    "use stored value in application logic",
                ],
                "pseudocode": [
                    "access localStorage",
                    *storage_operations,
                    "use stored value when needed",
                ],
                "evidence": self.find_best_evidence(
                    content,
                    [
                        "localStorage.getItem",
                        "localStorage.setItem",
                        "localStorage.removeItem",
                    ],
                ),
            })

        return results

    # =========================================================
    # API
    # =========================================================

    def extract_api_flows(
        self,
        project,
        file_path,
        content,
        file_data,
    ):

        results = []

        role = file_data.get(
            "role",
            "",
        )

        # -----------------------------------------------------
        # API route
        # -----------------------------------------------------

        if (
            role == "api_route"
            or "/api/" in file_path
        ):

            methods = []

            for method in [
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
            ]:

                if re.search(
                    rf"\b{method}\b",
                    content,
                ):
                    methods.append(method)

            route_behavior = self.detect_api_route_behavior(
                content
            )

            results.append({
                "project": project,
                "file": file_path,
                "type": "api_route",
                "methods": methods,
                "behavior": route_behavior,
                "flow": [
                    "receive HTTP request",
                    *route_behavior["flow"],
                    "return or delegate response",
                ],
                "pseudocode": [
                    "receive request",
                    *route_behavior["pseudocode"],
                    "return response",
                ],
                "evidence": self.trim(
                    content
                ),
            })

        # -----------------------------------------------------
        # Fetch/API requests
        # -----------------------------------------------------

        for fetch in file_data.get(
            "fetches",
            [],
        ):

            url = (
                fetch.get("url_expression")
                or fetch.get("url")
                or ""
            )

            method = fetch.get(
                "method",
                "GET",
            )

            code = (
                fetch.get("code")
                or fetch.get("example")
                or fetch.get("source")
                or ""
            )

            response_handling = (
                self.extract_response_handling(
                    content,
                    code,
                )
            )

            flow = [
                f"make {method} request",
                f"request {url or 'data endpoint'}",
                "wait for response",
            ]

            pseudocode = [
                f"call {method} {url or 'endpoint'}",
                "await response",
            ]

            if response_handling["json"]:

                flow.append(
                    "parse response using response.json()"
                )

                pseudocode.append(
                    "parse response with response.json()"
                )

            if response_handling["variable"]:

                flow.append(
                    f"store response in {response_handling['variable']}"
                )

                pseudocode.append(
                    f"store response in {response_handling['variable']}"
                )

            if response_handling["state"]:

                flow.append(
                    f"update state {response_handling['state']}"
                )

                pseudocode.append(
                    f"update {response_handling['state']} with returned data"
                )

            if response_handling["array_operation"]:

                flow.append(
                    f"use returned data with {response_handling['array_operation']}"
                )

                pseudocode.append(
                    f"process returned data using {response_handling['array_operation']}"
                )

            flow.append(
                "use returned data in page/component"
            )

            pseudocode.append(
                "use returned data in page/component"
            )

            results.append({
                "project": project,
                "file": file_path,
                "type": "api_request",
                "method": method,
                "url": url,
                "response_handling": response_handling,
                "flow": flow,
                "pseudocode": pseudocode,
                "evidence": code,
            })

        return results

    # =========================================================
    # CONTEXT
    # =========================================================

    def extract_context_flows(
        self,
        project,
        file_path,
        content,
        file_data,
    ):

        results = []

        contexts = file_data.get(
            "contexts",
            [],
        )

        for context in contexts:

            name = context.get(
                "context",
                context.get(
                    "name",
                    "",
                ),
            )

            if not name:
                continue

            provider_usage = self.detect_provider_usage(
                content,
                name,
            )

            results.append({
                "project": project,
                "file": file_path,
                "type": "context_flow",
                "context": name,
                "provider_usage": provider_usage,
                "flow": [
                    "create or access shared context",
                    "provide shared state through provider",
                    "consume shared state from components",
                ],
                "pseudocode": [
                    "create context",
                    "store shared state in provider",
                    "wrap required components",
                    "read context using useContext",
                ],
                "evidence": self.nearby_code(
                    content,
                    name,
                ),
            })

        return results

    # =========================================================
    # UI
    # =========================================================

    def extract_ui_flows(
        self,
        project,
        file_path,
        content,
        file_data,
    ):

        results = []

        if ".map(" not in content:
            return results

        map_evidence = self.nearby_code(
            content,
            ".map(",
        )

        key_present = bool(
            re.search(
                r"\bkey\s*=",
                map_evidence,
            )
        )

        results.append({
            "project": project,
            "file": file_path,
            "type": "collection_to_ui",
            "key_present": key_present,
            "flow": [
                "receive collection",
                "iterate over collection",
                "render one UI element per item",
                "assign stable key"
                if key_present
                else "render items without detected key evidence",
            ],
            "pseudocode": [
                "get collection",
                "map over collection",
                "render component for each item",
                "provide key"
                if key_present
                else "render component for each item",
            ],
            "evidence": map_evidence,
        })

        return results

    # =========================================================
    # RESPONSE HANDLING
    # =========================================================

    def extract_response_handling(
        self,
        content,
        fetch_code="",
    ):

        search_area = content

        if fetch_code:

            index = content.find(
                fetch_code
            )

            if index != -1:

                search_area = content[
                    index:
                    min(
                        len(content),
                        index + 1500,
                    )
                ]

        uses_json = bool(
            re.search(
                r"\.json\s*\(\s*\)",
                search_area,
            )
        )

        variable = ""

        # const response = await fetch(...)
        variable_match = re.search(
            r"\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*await\s+fetch",
            search_area,
        )

        if variable_match:
            variable = variable_match.group(1)

        state = ""

        # setSomething(await response.json())
        state_match = re.search(
            r"\b(set[A-Z][A-Za-z0-9_$]*)\s*\(",
            search_area,
        )

        if state_match:
            setter = state_match.group(1)
            state = self.setter_to_state(
                setter
            )

        array_operation = ""

        for operation in [
            "filter",
            "map",
            "find",
            "reduce",
            "sort",
            "forEach",
            "some",
            "includes",
        ]:

            if re.search(
                rf"\.{operation}\s*\(",
                search_area,
            ):
                array_operation = operation
                break

        return {
            "json": uses_json,
            "variable": variable,
            "state": state,
            "array_operation": array_operation,
        }

    # =========================================================
    # API ROUTE BEHAVIOR
    # =========================================================

    def detect_api_route_behavior(
        self,
        content,
    ):

        flow = []
        pseudocode = []

        if re.search(
            r"toNextJsHandler\s*\(",
            content,
        ):

            flow.append(
                "delegate request handling to authentication handler"
            )

            pseudocode.append(
                "pass request handling to authentication handler"
            )

        if re.search(
            r"NextResponse|Response\s*\(",
            content,
        ):

            flow.append(
                "construct HTTP response"
            )

            pseudocode.append(
                "construct response"
            )

        if re.search(
            r"request\.json\s*\(\)",
            content,
        ):

            flow.append(
                "read JSON request body"
            )

            pseudocode.append(
                "await request.json()"
            )

        if re.search(
            r"request\.(?:url|nextUrl|headers)",
            content,
        ):

            flow.append(
                "read request information"
            )

            pseudocode.append(
                "read request URL/headers when required"
            )

        if not flow:

            flow.append(
                "perform server-side operation"
            )

            pseudocode.append(
                "perform server-side operation"
            )

        return {
            "flow": flow,
            "pseudocode": pseudocode,
        }

    # =========================================================
    # PROVIDER
    # =========================================================

    def detect_provider_usage(
        self,
        content,
        context_name,
    ):

        provider = (
            context_name
            + "Provider"
        )

        return {
            "provider_detected": provider in content,
            "use_context_detected": bool(
                re.search(
                    r"\buseContext\s*\(",
                    content,
                )
            ),
        }

    # =========================================================
    # STATE USAGE
    # =========================================================

    def find_state_usage(
        self,
        content,
        state_name,
        setter="",
    ):

        usage = {
            "setter_calls": [],
            "array_methods_near_state": [],
        }

        if setter:

            setter_pattern = (
                rf"\b{re.escape(setter)}\s*\("
            )

            usage["setter_calls"] = re.findall(
                setter_pattern,
                content,
            )

        state_index = content.find(
            state_name
        )

        if state_index != -1:

            nearby = content[
                max(0, state_index - 300):
                min(
                    len(content),
                    state_index + 1000,
                )
            ]

            for operation in [
                "map",
                "filter",
                "find",
                "reduce",
                "sort",
            ]:

                if re.search(
                    rf"\.{operation}\s*\(",
                    nearby,
                ):

                    usage[
                        "array_methods_near_state"
                    ].append(operation)

        return usage

    # =========================================================
    # PSEUDOCODE
    # =========================================================

    def build_pseudocode(
        self,
        relationships,
    ):

        output = {}

        for category, items in relationships.items():

            if category == "pseudocode":
                continue

            output[category] = []

            for item in items:

                pseudocode = item.get(
                    "pseudocode"
                )

                if not pseudocode:
                    continue

                output[category].append({
                    "project": item.get(
                        "project"
                    ),
                    "file": item.get(
                        "file"
                    ),
                    "pattern": item.get(
                        "feature",
                        item.get(
                            "type",
                            category,
                        ),
                    ),
                    "steps": pseudocode,
                    "evidence": item.get(
                        "evidence",
                        "",
                    ),
                })

        return output

    # =========================================================
    # HELPERS
    # =========================================================

    def nearby_code(
        self,
        content,
        keyword,
    ):

        if not content or not keyword:
            return ""

        index = content.find(
            keyword
        )

        if index == -1:
            return ""

        start = max(
            0,
            index - 250,
        )

        end = min(
            len(content),
            index + self.max_example_length,
        )

        return content[
            start:end
        ].strip()

    def find_best_evidence(
        self,
        content,
        keywords,
    ):

        for keyword in keywords:

            evidence = self.nearby_code(
                content,
                keyword,
            )

            if evidence:
                return evidence

        return ""

    def setter_to_state(
        self,
        setter,
    ):

        if not setter.startswith(
            "set"
        ):
            return ""

        name = setter[3:]

        if not name:
            return ""

        return (
            name[0].lower()
            + name[1:]
        )

    def trim(
        self,
        content,
    ):

        content = content.strip()

        if len(content) <= self.max_example_length:
            return content

        return content[
            :self.max_example_length
        ]