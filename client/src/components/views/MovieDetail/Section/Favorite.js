import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Button } from "antd";

const Favorite = (props) => {
  const movieId = props.movieId;
  const userFrom = props.userFrom;
  const movieTitle = props.movieInfo.title;
  const moviePost = props.movieInfo.backdrop_path;
  const movieRunTime = props.movieInfo.runtime;

  const [favoriteNumber, setFavoriteNumber] = useState(0);
  const [favorited, setFavorited] = useState(false);

  console.log("movieDetail=>favoirite", userFrom);
  let variable = {
    userFrom,
    movieId,
    movieTitle,
    moviePost,
    movieRunTime,
  };
  console.log("favorite var", variable);

  useEffect(() => {
    Axios.post("/api/favorite/favoriteNumber", variable).then((res) => {
      if (res.data.success) {
        setFavoriteNumber(res.data.favoriteNumber);
      } else {
        alert("좋아요 숫자 실패함");
      }
    });

    Axios.post("/api/favorite/favorited", variable).then((res) => {
      if (res.data.success) {
        console.log("favorited:", res);
        setFavorited(res.data.favorited);
      } else {
        alert("좋아요 정보 실패함");
      }
    });
  }, []);

  const onClickFavorite = () => {
    if (favorited) {
      Axios.post("/api/favorite/removeFromFavorite", variable).then((res) => {
        if (res.data.success) {
          setFavoriteNumber(favoriteNumber - 1);
          setFavorited(!favorited);
        } else {
          alert("favorite list remove fail");
        }
      });
    } else {
      Axios.post("/api/favorite/addFavorite", variable).then((res) => {
        if (res.data.success) {
          setFavoriteNumber(favoriteNumber + 1);
          setFavorited(!favorited);
          //   console.log("click favor", res);
        } else {
          alert("favorite list add fail");
        }
      });
    }
  };

  return (
    <Button onClick={onClickFavorite}>
      {favorited ? "Not Favorite" : "Add to Favorite"} {favoriteNumber}
    </Button>
  );
};

export default Favorite;
