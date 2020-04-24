import React, { useState, useEffect } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";


const initialColor = {
  color: "",
  code: { hex: "" }
};
const initialNewColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors, editing, setEditing }) => {
  console.log(colors);
  // const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [newColor, setNewColor] = useState(initialNewColor)


  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);

  };
  const saveEdit = e => {
    e.preventDefault();
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is is saved right now?
    axiosWithAuth()
      .put(`/api/colors/${colorToEdit.id}`, colorToEdit)
      .then(res => {
        console.log({ res })
        // updateColors([...colors, res.data])
        setEditing(false);
        // window.location.reload(false);
      })
      .catch(err => console.log(err))
  };

  const deleteColor = color => {
    // make a delete request to delete this color
    axiosWithAuth()
      .delete(`/api/colors/${color.id}`, color)
      .then(res => {
        console.log({ res })
        const deleteColor = colors.filter(item => item.id !== color.id)
        updateColors(deleteColor)
      })
      .catch(err => console.log(err))

  };

  const newColorChange = e => {
    setNewColor({
      ...newColor,
      [e.target.name]: e.target.value
    })
  }

  const addColor = () => {
    axiosWithAuth()
      .post(`/api/colors/${colorToEdit.id}`, newColor)
      .then(res => {
        console.log({ res })
        // updateColors([...colors, res.data])
      })
      .catch(err => console.log(err))
  };
  

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={e => {
                e.stopPropagation();
                deleteColor(color)
              }
              }>
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer" />
      {/* stretch - build another form here to add a color */}
      <p>Please enter a new color:</p>
      <form onSubmit={addColor}>
        <input
          label="Color"
          type="text"
          name="newColor.color"
          placeholder="username"
          value={newColor.color}
          onChange={newColorChange}
        />
        <br />
        <input
          label="Hex Value"
          type="text"
          name="newColor.code.hex"
          placeholder="Hex Value"
          value={newColor.code.hex}
          onChange={newColorChange}
        />
        <button>Log In</button>
      </form>
    </div>
  );
};

export default ColorList;

