import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import './Home.css'

function Home() {
 
  return (
    <div>
      <h1>Main Page</h1>
      <Link to="/tikets" className="link">Tikets</Link>
      <Link to="/bank" className="link">Bank</Link>
    </div>
  )
}



export default Home;
