import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { API_URL, API_KEY, IMG_BASE_URL } from "../Config";
import MainImage from "./Sections/MainImage";
import { Row } from "antd";
import GridCard from "../commons/GridCard";
// import { response } from "express";

const LandingPage = () => {
  const [movies, setMovies] = useState([]);
  const [mainMovie, setMainMovie] = useState(null);
  const [page, setPage] = useState(0);

  const fetchMovies = () => {
    const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${
      page + 1
    }`;
    fetch(endpoint)
      .then((response) => response.json())
      .then((response) => {
        setMovies([...movies, ...response.results]);
        setMainMovie(mainMovie || response.results[0]);
        setPage(response.page);
        console.log(movies, mainMovie);
      });
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const onClickLoadMore = () => {
    fetchMovies();
  };

  return (
    <div style={{ width: "100%", margin: "0" }}>
      {/* {main image} */}
      {mainMovie && (
        <MainImage
          image={`${IMG_BASE_URL}w1280${mainMovie.backdrop_path}`}
          title={mainMovie.original_title}
          text={mainMovie.overview}
        />
      )}
      <div>
        <h2>Movie by latest</h2>
        <hr />
        {/* {movie grid cards} */}
        <Row gutter={[16, 16]}>
          {movies &&
            movies.map((movie, index) => {
              return (
                <React.Fragment key={index}>
                  <GridCard
                    landingpage
                    image={
                      movie.poster_path
                        ? `${IMG_BASE_URL}w500${movie.poster_path}`
                        : null
                    }
                    movieId={movie.id}
                    movieName={movie.original_title}
                  />
                </React.Fragment>
              );
            })}
          <GridCard />
        </Row>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button onClick={onClickLoadMore}>Load More</button>
      </div>
    </div>
  );
};

export default withRouter(LandingPage);
