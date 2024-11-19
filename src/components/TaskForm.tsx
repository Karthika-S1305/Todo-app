import React, { useState, useEffect } from 'react';
import { Input, Button, List, Flex } from 'antd';
const { TextArea } = Input;

type Task = {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
};

const TaskForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks)); 
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') return; 

    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      isComplete: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);

    setTitle('');
    setDescription('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <div style={{ marginBottom: '10px' }}>
          <Input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <TextArea
            placeholder="Task Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button type="primary" htmlType="submit">
          Add Task
        </Button>
      </form>

      {/* Display tasks */}
      <List
        header={<b>Task List</b>}
        bordered
        dataSource={tasks}
        renderItem={(task) => (
          <List.Item key={task.id}>
             <Flex vertical>
            <div>
              <b>{task.title}</b>
              <p>{task.description}</p>
            </div>
            <div>
            <Button type='primary'>Complete</Button>
            <Button danger>Delete</Button>
            </div>
            </Flex>
          </List.Item>
        )}
      />
    </div>
  );
};

export default TaskForm;
