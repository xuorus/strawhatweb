import React, { useState, useEffect } from 'react';
import { Button, Dropdown, DropdownButton, DropdownItem } from 'react-bootstrap';
import { db } from './firebaseConfig';
import { push, ref, set } from 'firebase/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faCalculator, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'; // Import SweetAlert
import './App.css';
import logo from './images/logo.png';

const App = () => {
  const [grades, setGrades] = useState([]);
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [course, setCourse] = useState('');
  const [grade, setGrade] = useState('');
  const [totalCredits, setTotalCredits] = useState(0);
  const [totalGradePoints, setTotalGradePoints] = useState(0);
  const [gpa, setGpa] = useState(0);
  const [deansList, setDeansList] = useState('');
  const [remarks, setRemarks] = useState('');


  const [dropdown1Title, setDropdown1Title] = useState('Dropdown 1');
  const [dropdown2Title, setDropdown2Title] = useState('Dropdown 2');
  const [dropdown3Title, setDropdown3Title] = useState('Dropdown 3');

  const handleDropdown1Click = (title) => {
    setDropdown1Title(title);
  };

  const handleDropdown2Click = (title) => {
    setDropdown2Title(title);
  };

  const handleDropdown3Click = (title) => {
    setDropdown3Title(title);
  };

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
      Swal.fire('Error', 'Input fields should not be empty!', 'error'); // SweetAlert
      return;
    }

    const newGrades = [...grades, { course, grade }];
    setGrades(newGrades);
    setCourse('');
    setGrade('');

  };

  const saveData = () => {
    const newDataRef = ref(db, 'grades');
    const newGradeRef = push(newDataRef);

    const dataToSave = {
      name,
      id,
      grades,
      gpa,
      deansList,
      remarks,
    };

    set(newGradeRef, dataToSave);
    Swal.fire('Success', 'Data saved successfully!', 'success'); // SweetAlert
    setTotalCredits(0);
    setTotalGradePoints(0);
    setGpa(0);
  };

  const calculateGPA = () => {
    if (grades.length === 0) {
      Swal.fire('Error', 'Please add at least one grade.', 'error'); // SweetAlert
      return;
    }

    let totalCredits = 0;
    let totalGradePoints = 0;

    grades.forEach((grade) => {
      const credit = 3;
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

  const handleGradeChange = (e) => {
    const value = e.target.value;
    if (isNaN(value)) {
      Swal.fire('Error', 'Invalid Input', 'error'); // SweetAlert
      e.target.style.borderColor = 'red';
    } else {
      e.target.style.borderColor = ''; // Reset border color
      setGrade(value);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1 style={{ color: 'white' }}>Student Grade Average Calculator</h1>
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="dropdown-container">
        {/* Dropdown buttons */}
        <DropdownButton id="dropdown1" title={dropdown1Title} className="dropdown-button">
          <Dropdown.Item onClick={() => handleDropdown1Click('Action 1')}>Action 1</Dropdown.Item>
          <Dropdown.Item onClick={() => handleDropdown1Click('Action 2')}>Action 2</Dropdown.Item>
          <Dropdown.Item onClick={() => handleDropdown1Click('Action 3')}>Action 3</Dropdown.Item>
        </DropdownButton>
        <DropdownButton id="dropdown2" title={dropdown2Title} className="dropdown-button">
          <Dropdown.Item onClick={() => handleDropdown2Click('Option 1')}>Option 1</Dropdown.Item>
          <Dropdown.Item onClick={() => handleDropdown2Click('Option 2')}>Option 2</Dropdown.Item>
          <Dropdown.Item onClick={() => handleDropdown2Click('Option 3')}>Option 3</Dropdown.Item>
        </DropdownButton>
        <DropdownButton id="dropdown3" title={dropdown3Title} className="dropdown-button">
          <Dropdown.Item onClick={() => handleDropdown3Click('Choice 1')}>Choice 1</Dropdown.Item>
          <Dropdown.Item onClick={() => handleDropdown3Click('Choice 2')}>Choice 2</Dropdown.Item>
          <Dropdown.Item onClick={() => handleDropdown3Click('Choice 3')}>Choice 3</Dropdown.Item>
        </DropdownButton>
      </div>
      <div className="input-columns">
        <div className="column">
          <div className="input-container">
            <label style = {{color: 'white'}}>Name: </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="input-container">
            <label style = {{color: 'white'}}>ID Number: </label>
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
          </div>
        </div>
        <div className="column">
          <div className="input-container">
            <label style = {{color: 'white'}}>Course: </label>
            <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} />
          </div>
          <div className="input-container">
            <label style = {{color: 'white'}}>Grade: </label>
            <input type="text" value={grade} onChange={handleGradeChange} />
          </div>
        </div>
      </div>
      <Button onClick={addGrade} variant="primary">
        <FontAwesomeIcon icon={faPlus} /> Add Grade
      </Button>{' '}
      <Button onClick={saveData} variant="success">
        <FontAwesomeIcon icon={faSave} /> Save Grade
      </Button>
      <hr />
      <table className="grades-table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade, index) => (
            <tr key={index}>
              <td style = {{color: 'white'}}>{grade.course}</td>
              <td style = {{color: 'white'}}>{grade.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <button onClick={calculateGPA}>
        <FontAwesomeIcon icon={faCalculator} /> Calculate GPA
      </button>
      {gpa !== 0 && (
        <div>
          <h2 style={{ color: 'white' }}>GPA: {gpa}</h2>
          <p style={{ color: 'white' }}>Total Credits: {totalCredits}</p>
          <p style={{ color: 'white' }}>Total Grade Points: {totalGradePoints}</p>
          <p style={{ color: 'white' }}>Dean's List: {deansList}</p>
          <p style={{ color: 'white' }}>Remarks: {remarks}</p>
        </div>
      )}
    </div>
  );
};

export default App;
