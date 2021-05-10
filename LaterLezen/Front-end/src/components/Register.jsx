import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { registerUser, loginUser, onOpenSocket } from "../serverCommunication";

import M from "materialize-css";

export default function Register(props) {
  const [email, setEmail] = useInput({ type: "email", name: "email" });
  const [firstName, setfirstName] = useInput({
    type: "text",
    name: "firstname",
  });
  const [lastName, setLastName] = useInput({ type: "text", name: "lastname" });
  const [password, setPassword] = useInput({
    type: "password",
    name: "password",
  });
  const [confirmPassword, setConfirmPassword] = useInput({
    type: "password",
    name: "confirmpassword",
  });
  const history = useHistory();

  function useInput({ type, name }) {
    const [value, setValue] = useState("");
    const input = (
      <input
        type={type}
        name={name}
        onChange={(e) => setValue(e.target.value)}
        required
      />
    );
    return [value, input];
  }

  const onSubmitForm = (e) => {
    const minPasswordLength = 7;

    e.preventDefault();

    if (password === confirmPassword) {
      if (password.length > minPasswordLength) {
        registerUser(email, password, firstName, lastName).then((response) => {
          if (response.status == 200) {
            response.json().then(() => {
              M.toast({ html: "Account successfully created" });
              loginUser(email, password).then((response) => {
                if (response.isAuthenticated === true) {
                  props.handleEmailState(email);
                  props.handleFirstnameState(response.firstname);
                  props.handleLastnameState(response.lastname);
                  onOpenSocket(email);
                  props.handleLoginState(true);
                  history.push("/dashboard");
                  window.location.reload();
                }
              });
            });
          } else {
            M.toast({ html: "Email already taken" });
          }
        });
      } else {
        M.toast({ html: "Password must be atleast 7 characters long" });
      }
    } else {
      M.toast({ html: "Passwords are not matching" });
    }
  };

  return (
    <div id="register">
      <div className="form">
        <form onSubmit={onSubmitForm}>
          <div className="row">
            <div className="input-field col s4">
              <p>Email</p>
              {setEmail}
            </div>
            <div className="input-field col s4">
              <p>First Name</p>
              {setfirstName}
            </div>
            <div className="input-field col s4">
              <p>Last Name</p>
              {setLastName}
            </div>
          </div>
          <div className="row">
            <div className="input-field col s6">
              <p>Password</p>
              {setPassword}
            </div>
            <div className="input-field col s6">
              <p>Confirm password</p>
              {setConfirmPassword}
            </div>
          </div>
          <div className="row">
            <input
              className="waves-effect waves-light btn-small blue"
              type="submit"
              name="register"
              value="Register"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
