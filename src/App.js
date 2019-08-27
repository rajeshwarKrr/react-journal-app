import React, { Component } from "react";
import axios from "axios";
import "./styles.css";

const urlFor = endpoint =>
  `https://express-journal-app.herokuapp.com/${endpoint}`;

class App extends Component {
  render() {
    return <Notes />;
  }
}


class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      note: {}
    };
  }
  componentDidMount() {
    this.getNotes();
  }

  getNotes = () => {
    axios
      .get(urlFor("notes"))
      .then(res => this.setState({ notes: res.data }))
      .catch(console.error);
  };

  addNote = note => {
    axios
      .post(urlFor("notes"), note)
      .then(response => {
        this.getNotes();
      })
      .catch(err => {
        console.log(err, "not added try again");
      });
  };

  editNote = note => {
    this.setState({ note });
  };
  deleteNote = noteId => {
    axios
      .delete(urlFor(`notes/${noteId}`))
      .then(this.getNotes)
      .catch(err => console.log(err));
  };
  updateNote = ({ id, title, content }) => {
    axios
      .put(urlFor(`notes/${id}`), { title, content })
      .then(this.getNotes)
      .then(this.setState({ note: {} }))
      .catch(err => console.log(err));
  };

  render() {
    const { note, notes } = this.state;

    return (
      <div className="App">
        <div className="container ">
          <h1>React Notes App</h1>
          <div className="row ">
            <div className="col-sm col-md col-lg col left-scroll float-left">
              {notes.map((note, id) => (
                <Note
                  note={note}
                  key={note._id}
                  editNote={this.editNote}
                  deleteNote={this.deleteNote}
                />
              ))}
            </div>
            <div className="col-sm col-md col-lg col float-right">
              <NoteForm
                key={note && note._id}
                note={note}
                addNote={this.addNote}
                updateNote={this.updateNote}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function Note({ deleteNote, editNote, note }) {
  const { _id: noteId, title, content } = note;

  const handleDelete = () => deleteNote(noteId);
  const handleEdit = () => editNote(note);

  return (
    <div className="card p-3 m-3   box-shadow">
      <div className="card-header">
        <h5 className="card-title">{title}</h5>
      </div>
      <div className="card-body">
        <p className="card-text">{content}</p>
      </div>
      <div className="card-footer text-muted">
        <button className="btn btn-default float-none" onClick={handleEdit}>
          <i className="fa fa-edit" />
        </button>

        <button className="btn btn-danger float-none" onClick={handleDelete}>
          <i className="fa fa-trash" />
        </button>
      </div>
    </div>
  );
}

class NoteForm extends Component {
  state = {
    id: this.props.note._id || "",
    content: this.props.note.content || "",
    title: this.props.note.title || ""
  };
  handleInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.props.note._id) {
      this.props.updateNote(this.state);
    } else {
      this.props.addNote(this.state);
    }
    this.setState({ content: "", title: "" });
  };

  render() {
    const { title, content } = this.state;

    return (
      <div className="p-3 m-3 jumbotron ">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group row">
            <label className=" font-weight-bold col-sm-2 col-form-label">
              Title
            </label>
            <input
              type="text"
              name="title"
              className="form-control m-2"
              placeholder="Enter Note Title"
              value={title}
              onChange={this.handleInput}
              required
            />
          </div>
          <div className="form-group row">
            <label className="font-weight-bold col-sm-2 col-form-label">
              Content
            </label>
            <textarea
              className="form-control m-2"
              name="content"
              rows="3"
              placeholder="Enter Note Content"
              value={content}
              onChange={this.handleInput}
              required
            />
          </div>
          <button className=" font-weight-bold btn btn-outline-primary form-group row m-4">
            Save Note
          </button>
        </form>
      </div>
    );
  }
}

export default App;
