import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {pageWrapperMixin, titleMixin} from "../styles/mixins";
import {BASE_URL} from "../config";

interface Input {
  id: number;
  name: string;
  type: string;
  placeholder: string;
  autoFocus: boolean;
  infoText: string;
}

interface UserInputList {
  userId: string;
  userPw: string;
  [key: string]: string;
}

const SignIn: React.FC<{inputData: Input[]}> = ({inputData}) => {
  const [userInputList, setUserInputList] = useState<UserInputList>({
    userId: "",
    userPw: "",
  });

  const {userId, userPw} = userInputList;

  const navigate = useNavigate();

  const idRegEx = /.*@.*/;
  const pwRegEx = /.{8,}/;

  const idCheck = idRegEx.test(userId);
  const pwCheck = pwRegEx.test(userPw);

  const isValid = idCheck && pwCheck;

  const printInfoText = (
    name: string,
    value: string
  ): JSX.Element | boolean => {
    if (!value) return false;
    switch (name) {
      case "userId":
        if (!idRegEx.test(value)) {
          return (
            <StyledInfoText>아이디에 @가 포함되어야 합니다.</StyledInfoText>
          );
        } else {
          return <StyledInfoText>조건을 충족했습니다!</StyledInfoText>;
        }
      case "userPw":
        if (!pwRegEx.test(value)) {
          return (
            <StyledInfoText>비밀번호는 8글자 이상이어야 합니다.</StyledInfoText>
          );
        } else {
          return <StyledInfoText>조건을 충족했습니다!</StyledInfoText>;
        }
      default:
        return false;
    }
  };

  const onChangeInfo = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {name, value} = e.target;
    setUserInputList({...userInputList, [name]: value});
  };

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    fetch(`${BASE_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        email: userId,
        password: userPw,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.access_token) {
          localStorage.setItem("token", result.access_token);
          navigate("/todo");
        } else {
          alert("입력이 틀렸습니다");
        }
      });
  };

  const onClickBtnGoToSignUp = () => {
    navigate("/signup");
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/todo");
    }
  }, [navigate]);

  return (
    <StyledSignInWrapper>
      <StyledTitle>로그인</StyledTitle>
      <StyledForm onSubmit={onSubmitForm}>
        <StyledInputList>
          {inputData &&
            inputData.map((input) => {
              const {id, name, type, placeholder, autoFocus, infoText} = input;
              return (
                <StyledInputWrap key={id}>
                  <StyledInput
                    data-testid={
                      name === "userId" ? "email-input" : "password-input"
                    }
                    onChange={onChangeInfo}
                    placeholder=" "
                    name={name}
                    type={type}
                    autoFocus={autoFocus}
                    value={userInputList[name] || ""}
                  />
                  <StyledInputLabel>{placeholder}</StyledInputLabel>
                  {printInfoText(name, userInputList[name]) ? (
                    printInfoText(name, userInputList[name])
                  ) : (
                    <StyledInfoText>{infoText}</StyledInfoText>
                  )}
                </StyledInputWrap>
              );
            })}
        </StyledInputList>
        <StyledButton
          data-testid="signin-button"
          type="submit"
          disabled={!isValid}
        >
          로그인
        </StyledButton>
      </StyledForm>
      <StyledButtonGoToSignUp onClick={onClickBtnGoToSignUp}>
        회원가입 하러 가기
      </StyledButtonGoToSignUp>
    </StyledSignInWrapper>
  );
};

export default SignIn;

const StyledSignInWrapper = styled.div`
  ${pageWrapperMixin};
`;

const StyledTitle = styled.h1`
  ${titleMixin};
`;

const StyledForm = styled.form``;

const StyledInfoText = styled.p`
  margin: 5px 0px 0px 3px;
  opacity: 0.6;
  font-size: 11px;
`;

const StyledInputList = styled.ul``;

const StyledInputWrap = styled.li`
  display: flex;
  position: relative;
  flex-direction: column;
  margin-top: 1px;
  padding-top: 13px;
`;

const StyledInput = styled.input`
  min-width: 300px;
  height: 45px;
  padding: 0px 15px;
  -webkit-appearance: none;
  -webkit-transition: all 0.1s linear;
  -moz-transition: all 0.1s linear;
  transition: all 0.1s linear;
  border: 1px solid lightgrey;
  border-radius: 5px;
  outline: none;
  font-size: 16px;
  font-weight: 400;

  &:focus {
    padding-top: 20px;
    border: 2px solid #d392ff;
    font-size: 15px;
  }

  &:not(:placeholder-shown) {
    padding-top: 20px;
  }
`;

const StyledInputLabel = styled.label`
  position: absolute;
  top: calc(50% - 5px);
  left: 15px;
  box-sizing: border-box;
  transition: all 0.1s linear;
  background-color: white;
  color: lightgray;
  font-size: 13px;
  pointer-events: none;

  &.input-vacant {
    top: calc(50% - 5px);
  }

  input:focus + &,
  input:not(:placeholder-shown) + & {
    top: 20px;
    color: rgb(200, 200, 200);
    font-size: 10px;
  }
`;

const StyledButton = styled.button`
  min-width: 300px;
  height: 45px;
  margin-top: 20px;
  border: 0;
  border-radius: 5px;
  background-color: #d392ff;
  color: white;

  &:disabled {
    background-color: rgb(230, 230, 230);
    color: lightgray;
  }
`;

const StyledButtonGoToSignUp = styled(StyledButton)``;
