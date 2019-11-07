import React from 'react';
import './App.css';

import { Remarkable } from 'remarkable';

class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: ' # Title \n \n Hello, **world**!  \n \n Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequuntur deleniti accusamus non illum in asperiores   ad pariatur sapiente maiores voluptatibus, eligendi quam, placeat facere sequi, consequatur laudantium quidem assumenda rem.',
      notes: [{ id: 1, title: 'First Note', value: ' This is a big note' }, { id: 2, title: 'Second Note', value: ' # Second Note \n \n **test** ' }]
    };
    this.handleSelectNote = this.handleSelectNote.bind(this);
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleSelectNote(e) {
    console.log('e', e);
    console.log('e.target.getAttribute', e.target.getAttribute('data-id'));

    let notes = this.state.notes;
    let data_id = e.target.getAttribute('data-id');
    console.log('notes', notes)
    let obj = notes.filter(o => o.id == data_id);

    console.log('obj', obj)
    this.setState({
      value: obj[0].value
    })
    document.getElementById('markdown-content').value = obj[0].value;
  }

  handleNewNote() {
    this.setState({
      value: ''
    })
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
            <h3>My Notes</h3>

            <div className="md_file">Title Note 1</div>
            <div className="md_file">Ce titre n'est pas un jeu vid</div>
            {
              this.state.notes.map((item, i) => {
                return <div className="md_file" data-id={item.id} key={i} onClick={this.handleSelectNote} > {item.title} </div>
              })
            }

          </div>

          <div className="editor">
            <h3>Input</h3>

            <textarea
              id="markdown-content"
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
