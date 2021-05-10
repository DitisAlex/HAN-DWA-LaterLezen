const port = 4000;
const serverHostname = `${window.location.hostname}:${port}`;
const serverFetchBase = `${window.location.protocol}//${serverHostname}`;
let ws;

export async function saveArticle(url, tags, title) {
  const body = {
    url: url,
    tags: tags,
    title: title,
  };
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(body),
  };

  return fetch(
    serverFetchBase + `/user/article`,
    fetchOptions
  ).then((response) => response.json());
}

export async function getAllArticles() {
  const fetchOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
  };

  return fetch(serverFetchBase + `/user/articles`, fetchOptions);
}

export async function getArticleByUser() {
  const fetchOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
  };
  return fetch(serverFetchBase + `/user/articles`, fetchOptions);
}

export async function loginUser(email, password) {
  const body = {
    email: email,
    password: password,
  };

  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(body),
  };
  return fetch(serverFetchBase + `/user/login`, fetchOptions).then((response) =>
    response.json()
  );
}

export async function logoutUser() {
  const fetchOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
  };
  return fetch(serverFetchBase + `/user/logout`, fetchOptions);
}

export async function registerUser(email, password, firstname, lastname) {
  const body = {
    email: email,
    password: password,
    firstname: firstname,
    lastname: lastname,
  };
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(body),
  };
  return fetch(serverFetchBase + `/user/register`, fetchOptions);
}

export async function checkAuthenticated() {
  const fetchOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
  };
  return fetch(
    serverFetchBase + `/user/authenticated`,
    fetchOptions
  ).then((response) => response.json());
}

export async function searchArticleByTags(tagids) {
  const body = {
    tagids: tagids,
  };

  const fetchOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(body),
  };
<<<<<<< HEAD
  return fetch(serverFetchBase + `/user/tags`, fetchOptions)
  .then((response) => response.json())
=======
  return fetch(serverFetchBase + `/user/tags`, fetchOptions).then((response) =>
    response.json()
  );
>>>>>>> c1973ebd10627c01266b8212b726c7bb6b10edad
}

export async function searchArticleByID(id) {
  const fetchOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
  };
  return fetch(
    serverFetchBase + `/user/article/${id}`,
    fetchOptions
  ).then((response) => response.json());
}

export async function deleteArticleByID(id) {
  const body = {
    article_id: id,
  };

  const fetchOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(body),
  };
  return fetch(serverFetchBase + `/user/article/`, fetchOptions);
}

export async function savePreference(theme) {
  const body = {
    theme: theme,
  };
  const fetchOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(body),
  };
  return fetch(serverFetchBase + `/user/preference/`, fetchOptions);
}

export async function requestPreferences() {
  const fetchOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
  };
  return fetch(
    serverFetchBase + `/user/preference/`,
    fetchOptions
  ).then((response) => response.json());
}

export async function confirmArticleChanges(
  article,
  title,
  source,
  description,
  author,
  tags
) {
  const body = {
    article_id: article,
    title: title,
    source: source,
    description: description,
    author: author,
    tags: tags,
  };
  const fetchOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(body),
  };
  return fetch(serverFetchBase + `/user/article`, fetchOptions);
}

export async function findArticle(query, searchContent) {
  const body = {
    query: query,
    searchContent: searchContent,
  };

  const fetchOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(body),
  };
  return fetch(
    serverFetchBase + `/user/search`,
    fetchOptions
  ).then((response) => response.json());
}

export async function getSources() {
  const fetchOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    mode: "cors",
  };
  return fetch(serverFetchBase + `/user/sources`, fetchOptions);
}

export function onOpenSocket(email) {
  let ws = new WebSocket(`ws://${serverHostname}`);
  ws.onerror = function error() {};
  ws.onopen = function open() {
    let data = {
      email: email,
      request: "webappUserAdd",
    };
    ws.send(JSON.stringify(data));
  };
  ws.onclose = function close() {};
  ws.onmessage = (msg) => {
    switch (msg.data) {
      case "connected":
        break;
      case "refresh article data":
        window.location.reload();
        break;
      default:
    }
  };
}

export function getWebSocket() {
  if (ws) {
    return ws;
  } else {
    throw new Error("The websocket has not been opened yet.");
  }
}
