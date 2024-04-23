import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import './App.css';

// Firebase configuration...
const firebaseConfig = {
  apiKey: "AIzaSyCVu6OtQSlnJzRI6gcDnlnj3QbWX6BY01U",
  authDomain: "strawhatcoders-c1028.firebaseapp.com",
  databaseURL: "https://strawhatcoders-c1028-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "strawhatcoders-c1028",
  storageBucket: "strawhatcoders-c1028.appspot.com",
  messagingSenderId: "1073430107906",
  appId: "1:1073430107906:web:e23a1a7ebe272b1936941b",
  measurementId: "G-J5RHT0X7F4"
};

// Initialize Firebase...
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

const App = () => {
  const [grades, setGrades] = useState([]);
  const [course, setCourse] = useState('');
  const [grade, setGrade] = useState('');
  const [totalCredits, setTotalCredits] = useState(0);
  const [totalGradePoints, setTotalGradePoints] = useState(0);
  const [gpa, setGpa] = useState(0);
  const [deansList, setDeansList] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const snapshot = await db.ref('grades').once('value');
      const data = snapshot.val();
      if (data) {
        setGrades(Object.values(data));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addGrade = () => {
    if (course.trim() === '' || grade.trim() === '') {
      alert('Please enter both course and grade.');
      return;
    }

    const newGrades = [...grades, { course, grade }];
    setGrades(newGrades);
    setCourse('');
    setGrade('');
  };

  const saveData = () => {
    db.ref('grades').set(grades);
    alert('Data saved successfully!');
    // Clear calculated data
    setTotalCredits(0);
    setTotalGradePoints(0);
    setGpa(0);
  };

  const calculateGPA = () => {
    if (grades.length === 0) {
      alert('Please add at least one grade.');
      return;
    }

    let totalCredits = 0;
    let totalGradePoints = 0;

    grades.forEach((grade) => {
      const credit = 3; // Assuming each course has 3 credits
      const gradePoint = parseFloat(grade.grade);

      if (!isNaN(gradePoint)) {
        totalCredits += credit;
        totalGradePoints += credit * gradePoint;
      }
    });

    const gpa = totalGradePoints / totalCredits;
    setTotalCredits(totalCredits);
    setTotalGradePoints(totalGradePoints);
    setGpa(gpa.toFixed(2));

    // Determine Dean's List status
    if (gpa >= 1.0 && gpa <= 1.75) {
      setDeansList('Yes');
    } else {
      setDeansList('No');
    }

    // Determine Remarks
    if (gpa >= 1.0 && gpa <= 3.0) {
      setRemarks('Passed');
    } else {
      setRemarks('Failed');
    }

    // Filter out grades that have been used for GPA calculation
    const filteredGrades = grades.filter((grade) => parseFloat(grade.grade) === 0);
    setGrades(filteredGrades);
  };

  return (
    <div className="container">
      <h1>Student Grade Average Calculator</h1>
      <div>
        <label>Course: </label>
        <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} />
      </div>
      <div>
        <label>Grade: </label>
        <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} />
      </div>
      <button onClick={addGrade}>Add Grade</button>
      <button onClick={saveData}>Save Data</button>
      <button onClick={fetchData}>Retrieve Data</button>
      <hr />
      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade, index) => (
            <tr key={index}>
              <td>{grade.course}</td>
              <td>{grade.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <button onClick={calculateGPA}>Calculate GPA</button>
      {gpa !== 0 && (
        <div>
          <h2>GPA: {gpa}</h2>
          <p>Total Credits: {totalCredits}</p>
          <p>Total Grade Points: {totalGradePoints}</p>
          <p>Dean's List: {deansList}</p>
          <p>Remarks: {remarks}</p>
        </div>
      )}
    </div>
  );
};

export default App;
