/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import {
  searchArticleByID,
  requestPreferences,
  savePreference,
  confirmArticleChanges,
} from "../serverCommunication";
import Parser from "html-react-parser/dist/html-react-parser";
import { useHistory } from "react-router-dom";
import Preferences from "./Preferences";
import M from "materialize-css";

export default function DisplayArticle() {
  const [article, setArticle] = useState([]);
  const history = useHistory();
  const [background, setBackground] = useState("white");
  const [editFields, setEditFields] = useState(false);
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTags, setCurrentTags] = useState([]);

  useEffect(() => {
    getArticleContent();
    let preferenceMenuSelector = document.querySelector(".preference-menu");
    let preferenceMenuOptions = {
      closeOnClick: false,
      constrainWidth: false,
      onCloseStart: () => {
        getPreferences();
      },
    };
    M.Dropdown.init(preferenceMenuSelector, preferenceMenuOptions);
    getPreferences();
    return () => (document.body.className = "");
  }, []);

  useEffect(() => {
    handleTagChips();
  }, [tags]);

  function handleTagChips() {
    setCurrentTags([]);
    let chipSelector = document.querySelectorAll(".chips");
    M.Chips.init(chipSelector, {
      onChipAdd: () => {
        setCurrentTags(chipSelector[0].M_Chips.chipsData);
      },
      onChipDelete: () => {
        setCurrentTags(chipSelector[0].M_Chips.chipsData);
      },
      placeholder: "Enter Tag...",
      secondaryPlaceholder: "+ Sub Tag",
    });
  }

  const handleRemoveTagClick = (index) => {
    const List = [...tags];
    List.splice(index, 1);
    setTags(List);
  };

  function handleAddTagClick() {
    var tagArray = [];
    currentTags.forEach((element) => {
      tagArray.push(element.tag);
    });
    setTags([...tags, tagArray]);
  }

  const checkTheme = (newTheme) => {
    setBackground(newTheme);
    document.body.className = "theme-" + newTheme;
  };

  const handleSaveButtonPreferences = () => {
    savePreference(background)
      .then((response) => {
        if (response.status === 200) {
          M.toast({ html: "Theme is saved!" });
        } else {
          M.toast({ html: "Theme could not be saved!" });
        }
      })
      .catch(() => {
        M.toast({
          html: "Something went wrong with the server",
        });
      });
  };

  const getPreferences = () => {
    requestPreferences().then((result) => checkTheme(result));
  };

  const saveArticleChanges = () => {
    let title_input = document.querySelector("#title-input");
    if (title_input.value.length <= 0) {
      M.toast({ html: "Required fields can not be empty!" });
    } else {
      let noErrors = true;
      if (tags !== undefined) {
        tags.forEach((data) => {
          data.forEach((element) => {
            if (!new RegExp("^[a-zA-Z0-9_.-]{1,15}$").test(element)) {
              M.toast({ html: "Geen geldige tag: " + element });
              noErrors = false;
            }
          });
        });
      }
      if (noErrors === true) {
        confirmArticleChanges(
          article._id,
          title,
          source,
          description,
          author,
          tags
        )
          .then(() => {
            M.toast({ html: "Article succesfully saved" });
            setEditFields(false);
          })
          .catch(() => {
            M.toast({ html: "Article could not be saved" });
          });
      }
    }
  };
  const getArticleContent = () => {
    let url = window.location.href;
    let id = url.substring(url.lastIndexOf("/") + 1);
    searchArticleByID(id).then((response) => {
      if (response.error === true) {
        history.push("/search");
        M.toast({ html: "Cannot find article" });
      } else {
        if (editFields != false) {
          setEditFields(false);
        }
        setArticle(response);
        setTitle(response.title);
        setDescription(response.excerpt);
        setSource(response.domain);
        setAuthor(response.author);
        setTags(response.tags);
        let textArea = document.querySelector(".materialize-textarea");
        M.textareaAutoResize(textArea);
      }
    });
  };

  return (
    <div>
      <Preferences
        handleThemeState={checkTheme}
        backgroundColor={background}
        handleCancelButton={getPreferences}
        handleSaveButton={handleSaveButtonPreferences}
      />
      <div className={"edit-button"}>
        {editFields ? (
          <button class="btn blue" onClick={saveArticleChanges}>
            <i class="small material-icons" id="editArticle">
              save
            </i>
          </button>
        ) : (
          <button class="btn blue" onClick={() => setEditFields(true)}>
            <i class="small material-icons" id="editArticle">
              create
            </i>
          </button>
        )}
      </div>
      <div className={"cancel-button"}>
        {editFields ? (
          <button class="btn blue" onClick={getArticleContent}>
            <i class="small material-icons" id="cancelEditArticle">
              cancel
            </i>
          </button>
        ) : (
          ""
        )}
      </div>

      <div className="article">
        <div className={editFields ? "" : "center"}>
          {editFields ? (
            <h5>
              Title:
              <div className="input-field">
                <input
                  required
                  className="validate"
                  id="title-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                ></input>
              </div>
            </h5>
          ) : (
            <h2 className={"hover-show"}>{title}</h2>
          )}
          <h5 className={"hover-show"}>
            Published by:
            {editFields ? (
              <div className="input-field">
                <input
                  id="author-input"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                ></input>
              </div>
            ) : (
              <b>{" " + author + " "}</b>
            )}
          </h5>
          <h5 className={"hover-show"}>
            Source:
            {editFields ? (
              <div className="input-field">
                <input
                  id="source-input"
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                ></input>
              </div>
            ) : (
              <b>{" " + source + " "}</b>
            )}
          </h5>
          <div className={editFields ? "" : "hidden"}>
            <h5>Description:</h5>
            <textarea
              required
              className="materialize-textarea"
              id={"description-input"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className={editFields ? "col-md-10" : "hidden"}>
            <h5>
              Tags:
              <div
                id="chipsDiv"
                className="chips chips-placeholder chips-autocomplete tooltipped"
                data-position="bottom"
                data-tooltip="[Tag requirements] Allow chars: A-Z / 0-9 / _  / - / Max length: 15 chars"
              ></div>
              <button
                className="inline waves-effect waves-light btn-small blue accent-2"
                id="addTag"
                onClick={() => {
                  handleAddTagClick();
                }}
              >
                Add
              </button>
            </h5>
            <h5>Used Tags:</h5>
            {tags.map((element, i) => {
              return (
                <p key={i}>
                  <li>
                    {element + " "}
                    <button
                      className="btn-floating btn-small waves-effect waves-light red"
                      onClick={() => {
                        handleRemoveTagClick(i);
                      }}
                    >
                      <i class="material-icons">delete</i>
                    </button>
                  </li>
                </p>
              );
            })}
          </div>
          <img
            alt={title}
            className="responsive-img"
            src={article.lead_image_url}
          />
        </div>
        <div className="text-flow">
          <h5>{Parser(" " + article.content)}</h5>
        </div>
        <a href={article.url} id="originalArticle">
          <button className="waves-effect waves-light btn-small blue accent-2">
            Go to original article
          </button>
        </a>
      </div>
    </div>
  );
}
