import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";
// import { response } from "express";
import { withRouter } from "react-router-dom";

const RegisterPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();

  const onChangeEmail = (e) => {
    setEmail(e.currentTarget.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.currentTarget.value);
  };
  const onChangeConfirmPW = (e) => {
    setConfirmPassword(e.currentTarget.value);
  };
  const onChangeName = (e) => {
    setName(e.currentTarget.value);
  };
  const onSubmitForm = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return alert("비밀번호화 비밀번호확인이 다릅니다");
    }

    let body = {
      email: email,
      name: name,
      password: password,
    };

    dispatch(registerUser(body)).then((response) => {
      if (response.payload.success) {
        props.history.push("/login");
      } else {
        alert("error");
      }
    });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <form
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        onSubmit={onSubmitForm}
      >
        <label>Email</label>
        <input type="email" value={email} onChange={onChangeEmail} />
        <label>Name</label>
        <input type="text" value={name} onChange={onChangeName} />
        <label>password</label>
        <input type="password" value={password} onChange={onChangePassword} />
        <label>Confirm password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={onChangeConfirmPW}
        />

        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default withRouter(RegisterPage);
