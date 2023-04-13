import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {pageWrapperMixin, titleMixin} from "../styles/mixins";
import {BASE_URL} from "../config";

interface TodoItemType {
  id: number;
  todo: string;
  isCompleted: boolean;
  userId: number;
  isModify: boolean;
  lastModifiedTodo?: string;
}

interface StyledSpanProps {
  isCompleted: boolean;
}

const ToDo = () => {
  const [todoList, setTodoList] = useState<TodoItemType[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [refShouldRender, setRefShouldRender] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const modifyInputRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();

  const onChangeInput = ({target}: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = target;
    setInputValue(value);
  };

  const onChangeCheckBox = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number,
    idx: number
  ) => {
    const {checked} = event.target;
    setTodoList((prev) => {
      const newList = [...prev];
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

  const onChangeModify = (
    event: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const {value} = event.target;
    setTodoList((prevTodoList) => {
      const newList = [...prevTodoList];
      newList[idx]["todo"] = value;
      return newList;
    });
  };

  const onClickBtnSignOut = () => {
    localStorage.removeItem("token");
    setAccessToken(null);
  };

  const onClickBtnAdd = (event: React.FormEvent<HTMLButtonElement>) => {
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
          const ErrorMsg = "내용을 입력해주세요!";
          throw ErrorMsg;
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

  const onClickBtnModify = (
    event: React.FormEvent<HTMLButtonElement>,
    idx: number
  ) => {
    event.preventDefault();
    setTodoList((prev) => {
      const newList = [...prev];
      newList[idx]["isModify"] = !newList[idx]["isModify"];
      newList[idx]["lastModifiedTodo"] = newList[idx]["todo"];
      return newList;
    });
    setRefShouldRender(!refShouldRender);
  };

  const onClickBtnDelete = (
    event: React.FormEvent<HTMLButtonElement>,
    id: number,
    idx: number
  ) => {
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

  const onClickBtnSubmit = (
    event: React.FormEvent<HTMLButtonElement>,
    id: number,
    idx: number,
    todo: string
  ) => {
    event.preventDefault();
    if (todo) {
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
    } else {
      alert("내용을 채워주세요");
    }
  };

  const onClickBtnCancel = (
    event: React.FormEvent<HTMLButtonElement>,
    idx: number
  ) => {
    event.preventDefault();
    setTodoList((prev) => {
      const newList = [...prev];
      newList[idx]["isModify"] = !newList[idx]["isModify"];
      newList[idx]["todo"] = newList[idx]["lastModifiedTodo"]!;
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
  }, []);

  useEffect(() => {
    if (!accessToken) {
      navigate("/signin");
    }
  }, [accessToken]);

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
          data-testid="new-todo-input"
          onChange={onChangeInput}
          placeholder=" "
          type="text"
          value={inputValue}
        />
        <StyledButtonAdd
          data-testid="new-todo-add-button"
          type="submit"
          onClick={onClickBtnAdd}
          disabled={inputValue === ""}
        >
          추가
        </StyledButtonAdd>
      </StyledForm>
      <StyledTodoList>
        {todoList.length > 0 &&
          todoList.map(({id, todo, isCompleted}, idx) => (
            <StyledTodoItem key={id}>
              <StyledLabel>
                <StyledCheckbox
                  type="checkbox"
                  checked={isCompleted}
                  onChange={(event) => onChangeCheckBox(event, id, idx)}
                />
              </StyledLabel>
              {!todoList[idx]["isModify"] ? (
                <>
                  <StyledSpan isCompleted={isCompleted}>{todo}</StyledSpan>
                  <StyledButtonModify
                    data-testid="modify-button"
                    onClick={(event) => onClickBtnModify(event, idx)}
                  >
                    수정
                  </StyledButtonModify>
                  <StyledButtonDelete
                    data-testid="delete-button"
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
                    onClick={(event) =>
                      onClickBtnSubmit(event, id, idx, todoList[idx]["todo"])
                    }
                    disabled={todoList[idx]["todo"] === ""}
                  >
                    제출
                  </StyledButtonSubmit>
                  <StyledButtonCancel
                    data-testid="cancel-button"
                    onClick={(event) => onClickBtnCancel(event, idx)}
                  >
                    취소
                  </StyledButtonCancel>
                </StyledForm>
              )}
            </StyledTodoItem>
          ))}
      </StyledTodoList>
      <StyledButtonSignOut onClick={onClickBtnSignOut}>
        로그아웃
      </StyledButtonSignOut>
    </StyledToDoWrapper>
  );
};

const StyledToDoWrapper = styled.div`
  ${pageWrapperMixin};
`;

const StyledTitle = styled.h1`
  ${titleMixin};
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

  &:hover {
    opacity: 0.7;
  }

  &:disabled {
    background-color: rgb(230, 230, 230);
    color: rgb(200, 200, 200);
  }
`;

const StyledButtonAdd = styled(StyledButton)``;

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

const StyledLabel = styled.label``;

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

const StyledSpan = styled.span<StyledSpanProps>`
  min-width: 200px;
  margin-right: 8px;
  text-decoration: ${(props) => (props.isCompleted ? "line-through" : "none")};
`;

const StyledInputModify = styled(StyledInput)`
  min-width: 195px;
  height: 40px;
`;

const StyledButtonModify = styled(StyledButton)`
  margin-right: 5px;
`;

const StyledButtonDelete = styled(StyledButton)``;

const StyledButtonSubmit = styled(StyledButton)`
  margin-right: 5px;
`;

const StyledButtonCancel = styled(StyledButton)``;

const StyledButtonSignOut = styled(StyledButton)`
  width: 100px;
  margin-top: 20px;
`;

export default ToDo;
