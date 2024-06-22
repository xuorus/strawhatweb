import React, { useState, useEffect, useCallback } from 'react';
import { Button, Dropdown, DropdownButton, DropdownItem } from 'react-bootstrap';
import { db } from './firebaseConfig';
import { push, ref, set } from 'firebase/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faCalculator, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'; // Import SweetAlert
import './App.css';
import logo from './images/logo.png';
import Form from 'react-bootstrap/Form';

const App = () => {
  const [grades, setGrades] = useState([]);
  const [acad, setAcad] = useState('');
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [course, setCourse] = useState('');
  const [grade, setGrade] = useState('');
  const [totalCredits, setTotalCredits] = useState(0);
  const [totalGradePoints, setTotalGradePoints] = useState(0);
  const [gpa, setGpa] = useState(0);
  const [deansList, setDeansList] = useState('');
  const [remarks, setRemarks] = useState('');
  const [password, setPassword] = useState(''); // New state for password

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const snapshot = await db.ref('grades').once('value');
      const data = snapshot.val();
      if (data) {
        const gradesArray = Object.keys(data).map(key => ({
          ...data[key],
          key: key
        }));
        setGrades(gradesArray);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const checkForExistingEntry = useCallback((name, id) => {
    if (!name || !id) return undefined;
    return grades.find(grade => grade.name?.toLowerCase() === name.toLowerCase() && grade.id === id);
  }, [grades]);

  useEffect(() => {
    const existingEntry = checkForExistingEntry(name, id);
    if (existingEntry) {
      setGrades(existingEntry.grades);
      setGpa(existingEntry.gpa);
      setDeansList(existingEntry.deansList);
      setRemarks(existingEntry.remarks);
    }
  }, [name, id, checkForExistingEntry]);

  const addGrade = () => {
    if (course.trim() === '' || grade.trim() === '') {
      Swal.fire('Error', 'Input fields should not be empty!', 'error');
      return;
    }

    const newGrades = [...grades, { course, grade }];
    setGrades(newGrades);
    setCourse('');
    setGrade('');
  };

  const saveData = async () => {
    const existingEntry = checkForExistingEntry(name, id);

    const dataToSave = {
      name,
      id,
      password, // Include password in the data
      grades,
      gpa,
      deansList,
      remarks
    };

    try {
      if (existingEntry) {
        // Update the existing entry
        const entryRef = ref(db, `grades/${existingEntry.key}`);
        await set(entryRef, dataToSave);
        Swal.fire('Success', 'Data updated successfully!', 'success');
      } else {
        // Create a new entry
        const newDataRef = ref(db, 'grades');
        const newGradeRef = push(newDataRef);
        await set(newGradeRef, dataToSave);
        Swal.fire('Success', 'Data saved successfully!', 'success');
      }

      setTotalCredits(0);
      setTotalGradePoints(0);
      setGpa(0);
    } catch (error) {
      Swal.fire('Error', 'Failed to save data.', 'error');
      console.error('Error saving data:', error);
    }
  };

  const calculateGPA = () => {
    if (grades.length === 0) {
      Swal.fire('Error', 'Please add at least one grade.', 'error');
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

    if (gpa >= 1.0 && gpa <= 1.75) {
      setDeansList('Yes');
    } else {
      setDeansList('No');
    }

    if (gpa >= 1.0 && gpa <= 3.0) {
      setRemarks('Passed');
    } else {
      setRemarks('Failed');
    }

    const filteredGrades = grades.filter((grade) => parseFloat(grade.grade) === 0);
    setGrades(filteredGrades);
  };

  const handleGradeChange = (e) => {
    const value = e.target.value;
    if (isNaN(value)) {
      Swal.fire('Error', 'Invalid Input', 'error');
      e.target.style.borderColor = 'red';
    } else {
      e.target.style.borderColor = '';
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

        <Form.Select aria-label="Default select example">
          <option>Choose Year Level</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </Form.Select>

        <Form.Select aria-label="Default select example">
          <option>Select Academic Term</option>
          <option value="1">First Semester</option>
          <option value="2">Second Semester</option>
        </Form.Select>

        <input type="text" value={acad} onChange={(e) => setAcad(e.target.value)} placeholder='Academic Year' style={{ padding: '8px', boxSizing: 'border-box' }} />
      </div>
      <div className="input-columns">
        <div className="column">
          <div className="input-container">
            <label style={{ color: 'white' }}>Name: </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="input-container">
            <label style={{ color: 'white' }}>ID Number: </label>
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
          </div>
          <div className="input-container">
            <label style={{ color: 'white' }}>Password: </label> {/* New password input */}
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        <div className="column">
          <div className="input-container">
            <label style={{ color: 'white' }}>Course: </label>
            <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} />
          </div>
          <div className="input-container">
            <label style={{ color: 'white' }}>Grade: </label>
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
              <td style={{ color: 'white' }}>{grade.course}</td>
              <td style={{ color: 'white' }}>{grade.grade}</td>
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
          <p style={{ color: 'white' }}>Dean's List: {deansList}</p>
          <p style={{ color: 'white' }}>Remarks: {remarks}</p>
        </div>
      )}
      <div className="container" style={{ border: '2px solid white' }}>
      <h2 style={{ color: 'white' }}>Developers</h2>
        <div>
          <span style={{ color: 'White' }}>Catindig, Ronan Reil S.</span>
        </div>
        <div>
          <span style={{ color: 'White' }}>Pabillore, Justin P.</span>
        </div>
        <div>
          <span style={{ color: 'White' }}>Salas, Nhed Ardy B.</span>
        </div>
        <div>
          <span style={{ color: 'White' }}>Saburnido, Nov Flowyn S.</span>
        </div>
      </div>
      <div className="container" style={{ border: '2px solid white' }}>
        <div>
          <span style={{ color: 'White' }}>BSIT 3R4</span>
        </div>
      </div>
    </div>
  );
};

export default App;
