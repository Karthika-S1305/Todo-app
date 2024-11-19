import React from 'react';
import { Task } from '../types';
import { Button, Flex } from 'antd';



type TaskListProps = {
  tasks: Task[];
  onToggleCompletion: (id: number) => void;
  onDeleteTask: (id: number) => void;
};

const boxStyle: React.CSSProperties ={
  width: '100%',
  height: 30,
  borderRadius: 6,
  
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleCompletion, onDeleteTask }) => {
  return (
    <Flex gap='middle' style={boxStyle} vertical>
      {tasks.length === 0 ? (
        <p className="text-center text-muted">No tasks added yet.</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className={`card mb-3 ${task.isComplete ? 'border-success' : ''}`}>
            <div className="card-body">
              <h5 className={`card-title ${task.isComplete ? 'text-decoration-line-through' : ''}`}>
                {task.title}
              </h5>
              <p className="card-text">{task.description}</p>
              <Button
              type={task.isComplete ? 'default' : 'primary'}
                className= "me-2"
                onClick={() => onToggleCompletion(task.id)}
              >
                {task.isComplete ? 'Mark as Pending' : 'Complete'}
              </Button>
              <Button danger onClick={() => onDeleteTask(task.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))
      )}
    </Flex>
  );
};

export default TaskList;
