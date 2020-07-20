import React, { useEffect, useState } from "react";
import "./FavoritePage.css";
import Axios from "axios";
import { Popover } from "antd";
import { IMG_BASE_URL } from "../Config";

const FavoritePage = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavoredMovie();
  }, []);

  const fetchFavoredMovie = () => {
    Axios.post("/api/favorite/getFavoredMovie", {
      userFrom: localStorage.getItem("userId"),
    }).then((res) => {
      if (res.data.success) {
        setFavorites(res.data.favorites);
      } else {
        alert("fail to get movies data");
      }
    });
  };

  const renderCards = favorites.map((favorite, index) => {
    const content = (
      <div>
        {favorite.moviePost ? (
          <img src={`${IMG_BASE_URL}w500${favorite.moviePost}`} />
        ) : (
          "no image"
        )}
      </div>
    );

    const onClickRemove = (movieId, userFrom) => {
      const variable = {
        movieId,
        userFrom,
      };

      Axios.post("/api/favorite/removeFromFavorite", variable).then((res) => {
        if (res.data.success) {
          fetchFavoredMovie();
        } else {
          alert("fail to get image");
        }
      });
    };

    return (
      <tr key={index}>
        <Popover content={content} title={`${favorite.movieTitle}`}>
          <td>{favorite.movieTitle}</td>
        </Popover>
        <td>{favorite.movieRunTime}</td>
        <td>
          <button
            onClick={() => onClickRemove(favorite.movieId, favorite.userFrom)}
          >
            remove
          </button>
        </td>
      </tr>
    );
  });
  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <h2>Favorite Movies</h2>
      <br />
      <table>
        <thead>
          <tr>
            <td>Movie Title</td>
            <td>Movie RunTime</td>
            <td>Remove from favorites</td>
          </tr>
        </thead>
        <tbody>{renderCards}</tbody>
      </table>
    </div>
  );
};

export default FavoritePage;
