// backend start point

const express = require("express");
const app = express();
const router = express.Router();
const port = 2000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");
const { Favorite } = require("./models/Favorite");
const config = require("./config/dev");

//
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

//

app.get("/", (req, res) => res.send("Hello World! why so late"));

// 로그인
app.post("/api/user/register", (req, res) => {
  // 회원가입 할 때 필요한 정보들을 클라이언트에서 가져오면 그것을 DB에 넣어줌
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  }); // 몽고디비에 저장
});

app.post("/api/user/login", (req, res) => {
  // 요청된 이메일을 데이터베이스에 있는지 찾는다

  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "이메일에 해당하는 유저가 없습니다",
      });
    }
    console.log(user);
    // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다",
        });
      // 비밀번호 까지 맞다면 토큰을 생성하기
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장 (쿠키, 로컬저장소, 세션)
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get("/api/user/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/user/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });

    return res.status(200).send({
      success: true,
    });
  });
});

// favorite
app.post("/api/favorite/favoriteNumber", (req, res) => {
  // req.body.movieId;
  // 디비에서 좋아요 숫자 가져오기
  Favorite.find({ movieId: req.body.movieId }).exec((err, info) => {
    if (err) return res.status(400).send(err);

    // 프론트에 다시 숫자정보 보내기
    res.status(200).json({ success: true, favoriteNumber: info.length });
  });
});

app.post("/api/favorite/favorited", (req, res) => {
  // 내가 이 정보를 favorite리스트에 넣었는지 정보 확인
  Favorite.find({
    movieId: req.body.movieId,
    userFrom: req.body.userFrom,
  }).exec((err, info) => {
    if (err) return res.status(400).send(err);

    let result = false;
    if (info.length !== 0) {
      result = true;
    }
    res.status(200).json({ success: true, favorited: result });
  });
});

app.post("/api/favorite/removeFromFavorite", (req, res) => {
  Favorite.findOneAndDelete({
    movieId: req.body.movieId,
    userFrom: req.body.userFrom,
  }).exec((err, doc) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true });
  });
});
app.post("/api/favorite/addFavorite", (req, res) => {
  const favorite = new Favorite(req.body);
  favorite.save((err, doc) => {
    if (err) return res.status(400).send(err);
    console.log("add fav", doc);
    return res.status(200).json({ success: true, doc });
  });
});
app.post("/api/favorite/getFavoredMovie", (req, res) => {
  console.log("get fav", req.body.userFrom);
  Favorite.find({ userFrom: req.body.userFrom }).exec((err, favorites) => {
    if (err) res.status(400).send(err);
    console.log("back favpage", favorites);
    res.status(200).json({ success: true, favorites });
  });
});

app.post("removeFromFavorite/", (req, res) => {
  Favorite.findOneAndDelete({
    movieId: req.body.movieId,
    userFrom: req.body.userFrom,
  }).exec((err, result) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true });
  });
});

app.get("/api/hello", (req, res) => {
  res.send("hello~~");
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
