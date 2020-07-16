// backend start point

const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const { User } = require("./models/User");
const config = require("./config/dev");

//
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

app.get("/", (req, res) => res.send("Hello World! Thank you john"));

app.post("/register", (req, res) => {
  // 회원가입 할 때 필요한 정보들을 클라이언트에서 가져오면 그것을 DB에 넣어줌
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  }); // 몽고디비에 저장
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
