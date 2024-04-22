import React, { useEffect, useState } from 'react';
import { ref, onValue } from "firebase/database";
import { db } from './firebaseConfig';
import './App.css'; // Import CSS file for styling

const App = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const databaseRef = ref(db);

    const unsubscribe = onValue(databaseRef, (snapshot) => {
      const data = snapshot.val();
      setData(data || {});
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const renderData = (data) => {
    if (typeof data === 'object' && data !== null) {
      return Object.entries(data).map(([key, value]) => (
        <div className="item" key={key}>
          <h3>{key}</h3>
          {renderData(value)}
        </div>
      ));
    } else {
      return <p>{data}</p>;
    }
  };

  return (
    <div className="container">
      {renderData(data)}
    </div>
  );
};

export default App;
