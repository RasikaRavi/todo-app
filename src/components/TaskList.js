import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {v4 as uuid} from "uuid";
import Modal from 'react-modal' 

Modal.setAppElement('#root')

const itemsFromBackend = [
//   { id: uuid(), content: "Buy Milk" },
//   { id: uuid(), content: "Wash Clothes" },

];

const columnsFromBackend = {  
  [uuid()]: {
    name: "Not Started",
    items: itemsFromBackend
  },
  [uuid()]: {
    name: "In Progress",
    items: []
  },
  [uuid()]: {
    name: "Completed",
    items: []
  }
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
};

function TaskList() {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [columns, setColumns] = useState(columnsFromBackend);
//   const[allTodos, setAllTodos]=useState([])
  const[addTask, setAddTask]=useState("")

  const handleAddTask = (e) => {
    e.preventDefault()
    setModalIsOpen(false)
    let newItem = {
      id: uuid(),
      content:addTask,
    }

    // let updatedTodo=[...allTodos]
    // updatedTodo.push(newItem)
    // setAllTodos(updatedTodo)

    itemsFromBackend.push(newItem)
    console.log(itemsFromBackend)
    // columnsFromBackend.items.push(itemsFromBackend)
    // console.log(columnsFromBackend)
}

  return (
    <React.Fragment>
    <div>
        <h1> To Do List Application </h1>
        <button className='add-btn' onClick={() => setModalIsOpen(true)}> New Task +</button>
    </div>
    <div className='modal-bg'>
        <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
            opacity:0.7,
            overlay:{
            backgroundColor:'black',
            position: 'absolute',
            border: '2px solid',
            height:250,
            width: 400,
            margin: 'auto'
            }
        }}
      >
        <div className="modal-div>">
        <h4  style={{textAlign:'center'}}>Add an item</h4>
        <form>
        <input type='text' value={addTask} onChange={(e)=>setAddTask(e.target.value)} placeholder='Type a task'/>
        <button className="modal-add" onClick={handleAddTask} > Add </button>
        </form>
        </div>
        
      </Modal>
    </div>
   
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <DragDropContext
        onDragEnd={result => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div className="container1" key={columnId}>
             <div className='not-start'><strong>{column.name}</strong></div>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div className="notstart-list"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
   
    </React.Fragment>
  );
}

export default TaskList;
