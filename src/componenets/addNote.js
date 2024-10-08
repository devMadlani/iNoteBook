import React, { useContext, useState } from 'react'
import noteContext from '../context/notes/noteContext';

function AddNote(props) {
    const context = useContext(noteContext);
    const { addNote } = context;
    const [note, setNote] = useState({ title: "", description: "", tag: "" })
    const handleClick = (e) => {
        e.preventDefault();
        if (note.description.length >= 5) {
            addNote(note.title, note.description, note.tag);
            props.showAlert("Note Added Successfully", "success");
            setNote({ title: "", description: "", tag: "" })
            // Reset the form after adding the note
        } else {
            props.showAlert("Description must be at least 5 characters long", "warning");
        }

    };
    const onchange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }
    return (
        <div>

            <div className="container">

                <h1>Add Note</h1>
                <form>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" value={note.title} id="title" name="title" aria-describedby="emailHelp" onChange={onchange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" value={note.description} id="description" name="description" minLength="5" onChange={onchange} />
                    </div>
                    <div className="mb-3">
                        <label  htmlFor="tag" className="form-label">Tag</label>
                        <input type="text" className="form-control" value={note.tag} id="tag" name="tag"  onChange={onchange} />
                    </div>
                    <button type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
                </form>
            </div>
        </div>
    )
}

export default AddNote