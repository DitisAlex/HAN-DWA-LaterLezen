/*global chrome*/
import React from "react";
import Login from "./Login";
import Article from "./Article";
import "materialize-css/dist/css/materialize.min.css";
import M from "materialize-css";

import { checkAuthenticated, onOpenSocket } from "../serverCommunication";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      email: "",
      tags: [],
    };
  }

  componentDidMount() {
    M.AutoInit();
    checkAuthenticated()
      .then((response) => response.json())
      .then((response) => {
        if (response.isAuthenticated === true) {
          this.handleLoginState(true);
          this.handleEmailState(response.user.email);
          this.handleTagState(response.user.tags);
          onOpenSocket(this.state.email);
        }
      })
      .catch((e) => {
        M.toast({ html: "Unauthorized user, please login first" });
      });
  }

  setTags(value) {
    this.setState({
      tags: value,
    });
  }

  handleLoginState(value) {
    this.setState(() => ({
      isLoggedIn: value,
    }));
  }

  handleEmailState(value) {
    this.setState(() => ({
      email: value,
    }));
  }

  handleTagState(value) {
    this.setState(() => ({
      tags: value,
    }));
  }

  render() {
    const currentLoginState = (c) => this.handleLoginState(c);
    const currentEmailState = (c) => this.handleEmailState(c);
    const setTags = (c) => this.setTags(c);

    return (
      <div class="container">
        {this.state.isLoggedIn === true ? (
          <Article
            tags={this.state.tags}
            email={this.state.email}
            handleEmailState={currentEmailState}
            handleLoginState={currentLoginState}
            isLoggedIn={this.state.isLoggedIn}
          />
        ) : (
          <Login
            setTags={setTags}
            handleLoginState={currentLoginState}
            handleEmailState={currentEmailState}
          />
        )}
      </div>
    );
  }
}
