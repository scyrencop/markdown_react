import React from 'react';
import './App.css';

import { Remarkable } from 'remarkable';

import {markdown} from './components/markdown';

class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      id: localStorage["notes"] ? JSON.parse(localStorage["notes"])[0].id : 1,
      title: localStorage["notes"] ? JSON.parse(localStorage["notes"])[0].title : 'Presentation',
      value: localStorage["notes"] ? JSON.parse(localStorage["notes"])[0].value : markdown,
      notes : localStorage["notes"] ? JSON.parse(localStorage["notes"]) : [{id:1,title:"Presentation", value:markdown}] ,
    };

    this.handleSelectNote = this.handleSelectNote.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleNewNote = this.handleNewNote.bind(this);
  }

  componentDidMount(){
    console.log('this.state.notes', this.state.notes[0])
    let obj = this.state.notes[0];
    console.log('obj.value',obj.value)
    this.fillValues(obj)
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
    this.handleSave();
  }

  handleSelectNote(e) {

    let notes = this.state.notes;
    let data_id = e.target.getAttribute('data-id');
    console.log('notes', notes)
    console.log('data_id', data_id)
    let obj = notes.filter(o => o.id == data_id);

    console.log(' -> obj ', obj[0])
    let content = obj[0].value;
    this.setState({
      obj: obj[0].id,
      value: content
    })

    this.addActiveClass(data_id)

    this.fillValues(obj[0])
  }

  handleNewNote() {
    this.setState({ value: '' })

    let notes = this.state.notes;

    let last_id = notes.reduce((prev, current) => (prev.id > current.id) ? prev : current).id
    let new_id = last_id + 1;
    let new_obj = { id: new_id , title:"Untitled", value:"." }
    notes.push(new_obj);
    
    this.setState({
      id: new_id,
      value: new_obj.value,
      notes: notes
    })

    console.log(' new_obj',new_obj);
    this.fillValues(new_obj);
    this.addActiveClass(new_obj.id)
  }

  fillValues(obj){
      document.getElementById('markdown-content').value = obj.value;
      document.getElementById('markdown-title').value = obj.title;
      document.getElementById('markdown-id').value = obj.id;
  }

  addActiveClass(data_id){
    for (var item of document.querySelectorAll('[data-id]')) {
      item.classList.remove('active');
    }
    
    let element_active = document.querySelector('[data-id="'+data_id+'"]');
    if(element_active){
      element_active.classList.add('active');
    }
  }

  handleSave(){

    let id = document.getElementById('markdown-id').value;
    let title = document.getElementById('markdown-title').value;
    let content = document.getElementById('markdown-content').value;
    let notes = this.state.notes;
    let objIndex = notes.findIndex((obj => obj.id == id));

    notes[objIndex].title = title
    notes[objIndex].value = content

    localStorage.setItem('notes', JSON.stringify(notes) );
    this.setState({ notes: notes })
  }
  
  getRawMarkup() {
    const md = new Remarkable();
    return { __html: md.render(this.state.value) };
  }

  render() {
    return (
      <div className="MarkdownEditor">
        <div className="container">
          <div className="sidebar-list">
            <h3>My Files</h3>

            {
              this.state.notes.map((item, i) => {
                return <div className={ this.state.id == item.id ? "md_file active" : "md_file"  } data-id={item.id} key={i} onClick={this.handleSelectNote} >
                  {item.title+'.md' || <span> Untitled </span> }                 
                 </div>
              })
            }
            <div className="md_file new_file" onClick={this.handleNewNote}>New File </div>

          </div>

          <div className="editor">
            <h3>Input</h3>
            <input type="text" id="markdown-id" style={{ display:"none"}}/>
            <input type="text" id="markdown-title" className="editable" placeholder="Title"/>
            <textarea
              id="markdown-content"
              className="editable"
              onChange={this.handleChange}
              defaultValue={this.state.value}
            />
          </div>

          <div className="preview">
            <h3>Output</h3>
            <div
              className="content"
              dangerouslySetInnerHTML={this.getRawMarkup()}
            />
          </div>

        </div>
      </div>
    );
  }
}

export default MarkdownEditor;
