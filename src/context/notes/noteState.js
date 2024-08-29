import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000"
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);
//Get all notes
const getNote = async() => {
  const url = `${host}/api/notes/fetchallnotes`
  
  const response = await fetch(url, {
    method: "GET", 
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("token")
    },
  });
  const json = await response.json()

 setNotes(json)
}
  //Add a note
  const addNote = async(title,description,tag) => {
    // API call
    const url = `${host}/api/notes/addnote`
    const response = await fetch(url, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify({title,description,tag}), 

    });
    // Logic to edit in client
    // const note = {
      //   _id: "666c46f252b9ccdbdedc73e9",
      //   user: "666be7f343debc8860dc5570",
      //   title: title,
      //   description: description,
      //   tag: tag,
      //   date: "2024-06-14T13:34:42.624Z",
      //   __v: 0,
      // };
      const json = await response.json()
      console.log(json)
      setNotes([...notes,json])
  }
  //Delete a note
  const deleteNote = async (id) => {
    // API call
    const url = `${host}/api/notes/deletenote/${id}`
    const response = await fetch(url, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
       "auth-token": localStorage.getItem("token")
      }, 
    });
    console.log(response)
    const newNotes = notes.filter((note)=>{return note._id !== id})
    setNotes(newNotes) 
  }
  //Edit a note
  const editNote = async (id,title,description,tag) => {
    const url = `${host}/api/notes/updatenote/${id}`
   
    const response = await fetch(url, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify({title,description,tag}), 
    });

    const json =  response.json(); 
    let newNotes = JSON.parse(JSON.stringify(notes))
    // Logic to edit in client
    for (let i = 0; i < newNotes.length; i++) {
      const element = notes[i];
      if (element._id === id ){
        newNotes[i].title = title;
        newNotes[i].description = description;
        newNotes[i].tag = tag;
        break; 
      }
    }
    setNotes(newNotes)
  }
  return (
    <NoteContext.Provider value={{ notes, setNotes, addNote, deleteNote, editNote, getNote }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
