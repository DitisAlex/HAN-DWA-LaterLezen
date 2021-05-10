/*global chrome*/
import React, { useState } from "react";
import M from "materialize-css";
import { loginUser, onOpenSocket } from "../serverCommunication";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLoginUser(email, password) {
    loginUser(email, password)
      .then((response) => response.json())
      .then((response) => {
        if (response.isAuthenticated === true) {
          props.handleEmailState(email);
          props.setTags(response.tags);
          onOpenSocket(email);
          props.handleLoginState(true);
        }
      })
      .catch(() => {
        M.toast({
          html: "Incorrect email/password!",
          displayLength: 1650,
        });
      });
  }

  return (
    <div className="login">
      <div className="container extension-bg">
        <h3 className="login-title">LaterLezer</h3>
        <div className="row">
          <input
            type="email"
            class="email"
            placeholder="Email..."
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <input
            type="password"
            class="password"
            placeholder="Password..."
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <button
            value="Log in"
            id="ext-login-button"
            className="waves-effect waves-light btn"
            onClick={() => {
              handleLoginUser(email, password);
            }}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
