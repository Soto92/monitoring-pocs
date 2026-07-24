// PostHog integration
!(function (t, e) {
  var o, n, p, r;
  e.__SV ||
    ((window.posthog = e),
    (e._i = []),
    (e.init = function (i, s, a) {
      function g(t, e) {
        var o = e.split(".");
        (2 == o.length && ((t = t[o[0]]), (e = o[1])),
          (t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          }));
      }
      (((p = t.createElement("script")).type = "text/javascript"),
        (p.async = !0),
        (p.src = s.api_host + "/static/array.js"),
        (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(
          p,
          r,
        ));
      var u = e;
      for (
        void 0 !== a ? (u = e[a] = []) : (a = "posthog"),
          u.people = u.people || [],
          u.toString = function (t) {
            var e = "posthog";
            return (
              "posthog" !== a && (e += "." + a),
              t || (e += " (stub)"),
              e
            );
          },
          u.people.toString = function () {
            return u.toString(1) + ".people (stub)";
          },
          o =
            "capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(
              " ",
            ),
          n = 0;
        n < o.length;
        n++
      )
        g(u, o[n]);
      e._i.push([i, s, a]);
    }),
    (e.__SV = 1));
})(document, window.posthog || []);
posthog.init(POSTHOG_CONFIG.apiKey, {
  api_host: POSTHOG_CONFIG.host,
  ...POSTHOG_CONFIG.options,
});

let todos = JSON.parse(localStorage.getItem("todos") || "[]");

const input = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("todoList");
const totalCount = document.getElementById("totalCount");
const doneCount = document.getElementById("doneCount");

function render() {
  list.innerHTML = "";
  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    if (todo.done) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => toggleTodo(index));

    const span = document.createElement("span");
    span.textContent = todo.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "x";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => deleteTodo(index));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });

  totalCount.textContent = `Total: ${todos.length}`;
  doneCount.textContent = `Concluidas: ${todos.filter((t) => t.done).length}`;
}

function addTodo() {
  const text = input.value.trim();
  if (!text) return;

  todos.push({ text, done: false });
  localStorage.setItem("todos", JSON.stringify(todos));

  posthog.capture("todo_added", { todo_text: text });
  posthog.capture("todo_list_changed", {
    total: todos.length,
    done: todos.filter((t) => t.done).length,
  });

  input.value = "";
  render();
}

function toggleTodo(index) {
  todos[index].done = !todos[index].done;
  localStorage.setItem("todos", JSON.stringify(todos));

  posthog.capture("todo_toggled", {
    todo_text: todos[index].text,
    is_done: todos[index].done,
  });
  posthog.capture("todo_list_changed", {
    total: todos.length,
    done: todos.filter((t) => t.done).length,
  });

  render();
}

function deleteTodo(index) {
  const removed = todos.splice(index, 1)[0];
  localStorage.setItem("todos", JSON.stringify(todos));

  posthog.capture("todo_deleted", { todo_text: removed.text });
  posthog.capture("todo_list_changed", {
    total: todos.length,
    done: todos.filter((t) => t.done).length,
  });

  render();
}

addBtn.addEventListener("click", addTodo);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo();
});

posthog.capture("app_loaded", { initial_todos: todos.length });
render();
