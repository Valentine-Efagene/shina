import React, { useEffect } from "react";
import styles from "./Login.module.css";
import { useAppDispatch } from "../../redux/hooks";
import { fetchAllStudents, login } from "../../redux/slice/studentSlice";
import { useNavigate } from "react-router-dom";
import { fetchAllCourses } from "../../redux/slice/courseSlice";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      await dispatch(fetchAllStudents());
      await dispatch(fetchAllCourses());
    };

    init();
  }, [dispatch]);

  const logIn: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await dispatch(login(e.currentTarget.studentName.value.trim()));
    navigate("/courses");
  };

  return (
    <form onSubmit={logIn} className={styles.form}>
      <label htmlFor='studentName'>
        Student Name: <input type='text' name='studentName' id='studentName' />
      </label>
      <input type='submit' value='login' />
    </form>
  );
}
