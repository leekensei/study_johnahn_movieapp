import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";

import { API_KEY, API_URL, IMG_BASE_URL } from "../Config";

import MainImage from "../LandingPage/Sections/MainImage";
import MovieInfo from "./Section/MovieInfo";
import GridCard from "../commons/GridCard";
import { Row } from "antd";
import Favorite from "./Section/Favorite";
// import { response } from "express";

const MovieDetail = (props) => {
  let movieId = props.match.params.movieId;

  const [movie, setMovie] = useState([]);
  const [actors, setActors] = useState([]);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    let endpointCrew = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
    let endpointInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}`;
    fetch(endpointInfo)
      .then((response) => response.json())
      .then((response) => {
        console.log("movieDetail", response);
        setMovie(response);
      });

    fetch(endpointCrew)
      .then((response) => response.json())
      .then((response) => {
        console.log("crew:", response);
        setActors(response.cast);
      });
  }, []);

  const ToggleActor = () => {
    setToggle(!toggle);
  };

  console.log("local:", localStorage.getItem("userId"));
  return (
    <div>
      {/* {header} */}
      <MainImage
        image={`${IMG_BASE_URL}w1280${movie.backdrop_path}`}
        title={movie.original_title}
        text={movie.overview}
      />
      {/* {body} */}
      <div style={{ width: "85%", margin: "1rem auto" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Favorite
            movieInfo={movie}
            movieId={movieId}
            userFrom={localStorage.getItem("userId")}
          />
        </div>

        {/* {movie info} */}
        <MovieInfo movie={movie} />
        <br />

        <div
          style={{ display: "flex", justifyContent: "center", margin: "2rem" }}
        >
          <button onClick={ToggleActor}>Toggle Action view</button>
        </div>

        {/* {actor grid} */}
        {toggle && (
          <Row gutter={[16, 16]}>
            {actors &&
              actors.map((actor, index) => {
                return (
                  <React.Fragment key={index}>
                    <GridCard
                      image={
                        actor.profile_path
                          ? `${IMG_BASE_URL}w500${actor.profile_path}`
                          : null
                      }
                      actorName={actor.name}
                    />
                  </React.Fragment>
                );
              })}
            <GridCard />
          </Row>
        )}
      </div>
    </div>
  );
};

export default withRouter(MovieDetail);
