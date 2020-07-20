import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import FavoritePage from "./components/views/FavoritePage/FavoritePage";

import Auth from "./hoc/auth";
import MovieDetail from "./components/views/MovieDetail/MovieDetail";
import Favorite from "./components/views/MovieDetail/Section/Favorite";
// hoc option
// null : 아무나
// true : 로그인한 들어갈 수 있음
// false : 로그인한 사람 못 들어감

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={Auth(LandingPage, null)} />
          <Route path="/login" exact component={Auth(LoginPage, false)} />
          <Route path="/register" exact component={Auth(RegisterPage, false)} />
          <Route
            path="/movie/:movieId"
            exact
            component={Auth(MovieDetail, null)}
          />
          <Route path="/favorite" exact component={Auth(FavoritePage, true)} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
