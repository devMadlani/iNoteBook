import {
  BrowserRouter as Router,
  Routes,
  Route,
 
} from "react-router-dom";
import Home from "./componenets/Home";
import About from "./componenets/About";
import "./App.css";
import Navbar from "./componenets/Navbar";
import NoteState from "./context/notes/noteState";
import Alert from "./componenets/Alert";
import Login from "./componenets/Login";
import Register from "./componenets/register";
import { useState } from "react";



function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type)=>{
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
        setAlert(null);
    }, 2500);
}
  return (
    <>
      <NoteState>
        <Router>
          <Navbar />
          <Alert alert={alert}/>
          <div className="container">

          <Routes>
            <Route excat path="/" element={<Home showAlert={showAlert}/>}></Route>
            <Route excat path="/about" element={<About />}></Route>
            <Route excat path="/login" element={<Login showAlert={showAlert}/>}></Route>
            <Route excat path="/signup" element={<Register showAlert={showAlert}/>}></Route>
          </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
