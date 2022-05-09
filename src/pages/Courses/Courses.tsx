import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchStudentCourses } from "../../redux/slice/courseSlice";
import styles from "./Courses.module.css";

export default function Courses() {
  const dispatch = useAppDispatch();
  const courses = useAppSelector((state) => state.course.studentCourses);

  useEffect(() => {
    async function load() {
      await dispatch(fetchStudentCourses());
    }

    load();
  }, [dispatch]);

  return (
    <div className={styles.container}>
      {courses.map((course) => {
        return (
          <div className={styles.courseCard} key={course.id}>
            <b>Name</b>
            {course.name}
            <b>Students</b>
            <div className={styles.students}>
              {course.students &&
                course.students.map((student, index) => {
                  return (
                    <>
                      {student !== null && typeof student !== "undefined" && (
                        <div key={student.id}>
                          {student.name}
                          {index !== course.students.length - 1 && ", "}
                        </div>
                      )}
                    </>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
