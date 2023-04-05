import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {pageWrapperMixin} from "../styles/mixins";
import {BASE_URL} from "../config";

const ToDo = () => {
  const [todoList, setTodoList] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [refShouldRender, setRefShouldRender] = useState(false);

  const modifyInputRef = useRef(null);

  const navigate = useNavigate();

  const accessToken = localStorage.getItem("token");

  const onClickBtnAdd = (event) => {
    event.preventDefault();
    fetch(`${BASE_URL}/todos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        todo: inputValue,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          throw new Error("추가 실패");
        }
      })
      .then(({id, todo, isCompleted, userId}) => {
        setTodoList([
          ...todoList,
          {
            id: id,
            todo: todo,
            isCompleted: isCompleted,
            userId: userId,
            isModify: false,
          },
        ]);
        setInputValue("");
      })
      .catch((error) => {
        alert(`Error: ${error}`);
      });
  };

  const onClickBtnModify = (event, idx) => {
    event.preventDefault();
    setTodoList((prev) => {
      const newList = [...prev];
      newList[idx]["isModify"] = !newList[idx]["isModify"];
      return newList;
    });
    setRefShouldRender(!refShouldRender);
  };

  const onClickBtnDelete = (event, id, idx) => {
    event.preventDefault();
    fetch(`${BASE_URL}/todos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (response.status === 204) {
          setTodoList((prev) => {
            const newList = [...prev];
            newList.splice(idx, 1);
            return newList;
          });
        } else {
          alert(`State Code: ${response.status}`);
        }
      })
      .catch((error) => {
        alert(`Error: ${error}`);
      });
  };

  const onClickBtnSubmit = (event, id, idx) => {
    event.preventDefault();
    setTodoList((prev) => {
      const newList = [...prev];
      newList[idx]["isModify"] = !newList[idx]["isModify"];
      return newList;
    });
    fetch(`${BASE_URL}/todos/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        todo: todoList[idx]["todo"],
        isCompleted: todoList[idx]["isCompleted"],
      }),
    })
      .then((response) => {
        if (response.status !== 200) {
          alert(`State Code: ${response.status}`);
        }
      })
      .catch((error) => {
        alert(`Error: ${error}`);
      });
  };

  const onClickBtnCancel = (event, idx) => {
    event.preventDefault();
    setTodoList((prev) => {
      const newList = [...prev];
      newList[idx]["isModify"] = !newList[idx]["isModify"];
      return newList;
    });
  };

  const onChangeInput = ({target}) => {
    const {value} = target;
    setInputValue(value);
  };

  const onChangeCheckBox = (event, id, idx) => {
    const {checked} = event.target;
    setTodoList((prevTodoList) => {
      const newList = [...prevTodoList];
      newList[idx]["isCompleted"] = checked;
      return newList;
    });
    fetch(`${BASE_URL}/todos/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        todo: todoList[idx]["todo"],
        isCompleted: checked,
      }),
    })
      .then((response) => {
        if (response.status !== 200) {
          alert(`State Code: ${response.status}`);
        }
      })
      .catch((error) => {
        alert(`Error: ${error}`);
      });
  };

  const onChangeModify = (event, idx) => {
    const {value} = event.target;
    setTodoList((prevTodoList) => {
      const newList = [...prevTodoList];
      newList[idx]["todo"] = value;
      return newList;
    });
  };

  useEffect(() => {
    fetch(`${BASE_URL}/todos`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setTodoList(result);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(`Error: ${error}`);
      });
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) {
      navigate("/signin");
    }
  }, []);

  useEffect(() => {
    if (modifyInputRef.current) {
      modifyInputRef.current.focus();
    }
  }, [refShouldRender]);

  return (
    <StyledToDoWrapper>
      <StyledTitle>To-Do List</StyledTitle>
      <StyledForm>
        <StyledInput
          onChange={onChangeInput}
          placeholder=" "
          type="text"
          value={inputValue}
        />
        <StyledButton type="submit" onClick={onClickBtnAdd}>
          추가
        </StyledButton>
      </StyledForm>
      <StyledTodoList>
        {todoList.length > 0 &&
          todoList.map(({id, todo, isCompleted}, idx) => (
            <StyledTodoItem key={id}>
              <StyledCheckbox
                type="checkbox"
                checked={isCompleted}
                onChange={(event) => onChangeCheckBox(event, id, idx)}
              />
              {!todoList[idx]["isModify"] ? (
                <>
                  <StyledSpan>{todo}</StyledSpan>
                  <StyledButtonModify
                    onClick={(event) => onClickBtnModify(event, idx)}
                  >
                    수정
                  </StyledButtonModify>
                  <StyledButtonDelete
                    onClick={(event) => onClickBtnDelete(event, id, idx)}
                  >
                    삭제
                  </StyledButtonDelete>
                </>
              ) : (
                <StyledForm>
                  <StyledInputModify
                    data-testid="modify-input"
                    value={todo}
                    onChange={(event) => onChangeModify(event, idx)}
                    ref={modifyInputRef}
                  />
                  <StyledButtonSubmit
                    data-testid="submit-button"
                    type="submit"
                    onClick={(event) => onClickBtnSubmit(event, id, idx)}
                  >
                    제출
                  </StyledButtonSubmit>
                  <StyledButton
                    data-testid="cancel-button"
                    onClick={(event) => onClickBtnCancel(event, idx)}
                  >
                    취소
                  </StyledButton>
                </StyledForm>
              )}
            </StyledTodoItem>
          ))}
      </StyledTodoList>
    </StyledToDoWrapper>
  );
};

const StyledToDoWrapper = styled.div`
  ${pageWrapperMixin};
`;

const StyledTitle = styled.h1`
  margin: 100px 0 50px 0;
  font-size: 40px;
`;

const StyledForm = styled.form``;

const StyledInput = styled.input`
  min-width: 300px;
  margin-right: 10px;
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
`;

const StyledButton = styled.button`
  min-width: 70px;
  height: 45px;
  border: 0;
  border-radius: 5px;
  background-color: #d392ff;
  color: white;

  &:disabled {
    background-color: rgb(230, 230, 230);
    color: lightgray;
  }
`;

const StyledTodoList = styled.ul`
  margin-top: 20px;
`;

const StyledTodoItem = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  font-size: 18px;
`;

const StyledCheckbox = styled.input`
  margin-right: 20px;
  appearance: none;
  width: 25px;
  height: 25px;
  border: 2px solid #d392ff;
  outline: none;

  &:checked {
    background-color: #d392ff;
    border-color: #d392ff;
  }

  &:before {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background-color: #d392ff;
    border-radius: 50%;
    transform: scale(0);
    transition: transform 0.2s ease-in-out;
  }

  &:checked:before {
    transform: scale(0.8);
  }
`;

const StyledSpan = styled.span`
  flex-grow: 1;
  margin-right: 20px;
  text-decoration: ${(props) => (props.isCompleted ? "line-through" : "none")};
`;

const StyledInputModify = styled(StyledInput)``;

const StyledButtonSubmit = styled(StyledButton)`
  margin-right: 5px;
`;

const StyledButtonModify = styled(StyledButton)`
  margin-right: 5px;
`;

const StyledButtonDelete = styled(StyledButton)``;

export default ToDo;
