import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchStudentCourses } from "../../redux/slice/courseSlice";
import styles from "./Courses.module.css";

export default function Courses() {
  const dispatch = useAppDispatch();
  const studentData = useAppSelector((state) => state.student.student);
  const courses = useAppSelector((state) => state.course.courses);

  useEffect(() => {
    async function load() {
      await dispatch(fetchStudentCourses(studentData));
    }

    load();
  }, [dispatch, studentData]);

  return (
    <div className={styles.container}>
      {courses.map((course) => {
        return (
          <div className={styles.courseCard} key={course.name}>
            <b>Name</b>
            {course.name}
            <b>Students</b>
            <div className={styles.students}>
              {course.students.map((student, index) => {
                return (
                  <div key={student.name}>
                    {student.name}
                    {index !== course.students.length - 1 && ", "}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
