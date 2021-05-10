/*global chrome*/
import React, { useState, useEffect } from "react";
import { saveArticle, logoutUser, getWebSocket } from "../serverCommunication";
import M from "materialize-css";

export default function Article(props) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTags, setCurrentTags] = useState([]);
  const [disableURLInput, setDisableURLInput] = useState(false);

  useEffect(() => {
    handleGetUrl();
  });

  useEffect(() => {
    handleTagChips();
  }, [tags]);

  function handleTagChips() {
    setCurrentTags([]);

    var elems = document.querySelectorAll(".chips");
    var instances = M.Chips.init(elems, {
      onChipAdd: () => {
        setCurrentTags(elems[0].M_Chips.chipsData);
      },
      onChipDelete: () => {
        setCurrentTags(elems[0].M_Chips.chipsData);
      },
      placeholder: "Enter Tag...",
      secondaryPlaceholder: "+ Sub Tag...",
    });
  }

  function handleUrlChange(e) {
    setUrl(e.target.value);
  }

  function handleTitleChange(e) {
    e.preventDefault();
    setTitle(e.target.value);
  }

  function handleSaveArticle(url, title, email, tags) {
    let noErrors = true;
    if (
      new RegExp(
        "([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?"
      ).test(url)
    ) {
      if (tags !== undefined) {
        tags.forEach((data) => {
          data.forEach((element) => {
            if (!new RegExp("^[a-zA-Z0-9_.-]{1,15}$").test(element)) {
              M.toast({ html: "Geen geldige tag: " + element });
              noErrors = false;
            }
          });
        });
        if (noErrors === true) {
          saveArticle(url, title, email, tags)
            .then((response) => {
              response.json();
            })
            .then(() => M.toast({ html: "Article succesfully saved" }))
            .then(() => {
              let ws = getWebSocket();
              let message = {
                request: "refresh article data",
                email: email,
              };
              ws.send(JSON.stringify(message));
            });
        }
      } else {
        M.toast({ html: "Please enter atleast one tag" });
      }
    } else {
      M.toast({ html: "Geen geldige URL" });
    }
  }

  function handleLogout() {
    logoutUser().then(() => {
      props.handleEmailState("");
      props.handleLoginState(false);
    });
  }

  function handleGetUrl() {
    if (chrome.tabs !== undefined) {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        let url = tabs[0].url;
        setUrl(url);
      });
      setDisableURLInput(true);
    }
  }

  const handleRemoveClick = (index) => {
    const List = [...tags];
    List.splice(index, 1);
    setTags(List);
  };

  function handleAddClick() {
    var tagArray = [];

    currentTags.forEach((element) => {
      tagArray.push(element.tag);
    });
    setTags([...tags, tagArray]);
  }

  return (
    <div className="article">
      <div className="container">
        <h3 className="h1">LaterLezer</h3>
        <h4 className="h2">Add article:</h4>
        <div className="row input-form">
          <input
            disabled={disableURLInput}
            type="text"
            id="ext-url"
            placeholder="URL.."
            className="input"
            onChange={(e) => handleUrlChange(e)}
            value={url}
            required
          />
          <input
            type="text"
            id="ext-title"
            placeholder="Title.."
            className="ext-title input"
            onChange={(e) => handleTitleChange(e)}
            value={title}
          />
          <div
            class="chips chips-placeholder chips-autocomplete tooltipped"
            data-position="bottom"
            data-tooltip="[Tag requirements] Allow chars: A-Z / 0-9 / _  / - / Max length: 15 chars"
          ></div>
          <button
            className="add-article waves-effect waves-light btn-small blue accent-2"
            onClick={() => {
              handleAddClick();
            }}
          >
            Add
          </button>
          <h5>Used Tags:</h5>
          {tags.map((element, i) => {
            return (
              <h6 key={i}>
                <li>
                  {element + " "}
                  <button
                    className="btn-floating btn-small waves-effect waves-light red"
                    onClick={() => {
                      handleRemoveClick(i);
                    }}
                  >
                    <i class="material-icons">delete</i>
                  </button>
                </li>
              </h6>
            );
          })}
          <button
            id="ext-save-article"
            className="waves-effect waves-light btn"
            onClick={() => {
              handleSaveArticle(url, title, props.email, tags);
            }}
          >
            Save
          </button>
          <button
            id="ext-logout"
            className="waves-effect waves-light btn"
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
