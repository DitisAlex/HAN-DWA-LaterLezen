import React, { useEffect, useState } from "react";
import M from "materialize-css";

export default function Preferences(props) {
  const [activeTheme, setActiveTheme] = useState();
  const [themes] = useState([
    "default",
    "typewriter",
    "dark",
    "bluegrey",
    "darkblue",
  ]);

  useEffect(() => {
    setActiveTheme(props.backgroundColor);
  }, []);

  function changeTheme(value) {
    props.handleThemeState(value);
  }

  function handleCancelButton() {
    props.handleCancelButton();
  }

  function handleSaveButton() {
    props.handleSaveButton();
  }

  return (
    <div className="row">
      <div className="center-align preference-button">
        <button
          className={"preference-menu btn blue"}
          data-target={"preferences"}
          id="preferenceButton"
        >
          <i className="small material-icons">settings</i>
        </button>
      </div>
      <div
        className={`dropdown-content blue-border no-scroll theme-${props.backgroundColor}`}
        id="preferences"
      >
        <div className="row">
          <div className="col s12">
            <h5>Select a theme to read articles</h5>
          </div>
        </div>
        <div className="row">
          <div className="col s12">
            {themes.map((theme) => {
              return (
                <div
                  className={
                    `btn-large waves round-icon ${theme}` +
                    (theme === activeTheme ? " active_theme" : "")
                  }
                  id={theme}
                  onClick={() => changeTheme(theme)}
                ></div>
              );
            })}
          </div>
        </div>
        <div className="row">
          <div className="col s12">
            <div className="center-align">
              <div
                className="btn waves blue accent-2"
                onClick={handleSaveButton}
                id="savePreferences"
              >
                Save
              </div>
              <div
                className="btn waves blue accent-2"
                onClick={handleCancelButton}
                id="cancelPreferences"
              >
                Cancel
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
