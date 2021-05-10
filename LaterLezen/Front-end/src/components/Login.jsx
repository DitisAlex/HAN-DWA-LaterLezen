/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { loginUser } from "../serverCommunication";
import M from "materialize-css";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  function handleLoginUser(email, password) {
    loginUser(email, password)
      .then((response) => {
        if (response.isAuthenticated === true) {
          props.handleLoginState(true);
          props.handleEmailState(email);
          props.handleFirstnameState(response.firstname);
          props.handleLastnameState(response.lastname);
          props.handleTagsState(response.tags);
          history.push("/dashboard");
          window.location.reload();
        }
      })
      .catch(() => {
        M.toast({ html: "Email or password incorrect" });
      });
  }

  return (
    <div className="container">
      <div className="row">
        <form>
          <div className="col s6">
            <h5>Email</h5>
            <input
              type="email"
              id="email"
              placeholder="Please enter your email here.."
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            ></input>
          </div>
          <div className="col s6">
            <h5>Password</h5>
            <input
              type="password"
              id="password"
              placeholder="Please enter your password here.."
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            ></input>
          </div>
          <div class="row">
            <div className="col">
              <a
                className="waves-effect waves-light btn-small blue"
                id="login"
                onClick={() => {
                  handleLoginUser(email, password);
                }}
              >
                Log in
              </a>
            </div>
          </div>
        </form>
        <div className="col">
          <h5>No account?</h5>
          <Link to="/register">
            <a className="waves-effect waves-light btn-small blue" id="login">
              Register here!
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
