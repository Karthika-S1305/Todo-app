import React, { useState, useEffect, useMemo } from 'react';
// import type { FormProps } from 'antd';
import { Input, Button, List, Flex, Form } from 'antd';
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
  const [search, setSearch] = useState('');

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));  
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));  
    }
  }, [tasks]);

  const memoizedTasks = useMemo(() => {
    return tasks.filter(
      (task, index, self) =>
        index === self.findIndex((t) => t.title === task.title)
    );
  }, [tasks]);

  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, isComplete: !task.isComplete } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filterTasks = memoizedTasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();

    if (title.trim() === '') return;

    const isDuplicate = tasks.some(task => task.title.toLowerCase() === title.toLowerCase());

    if (isDuplicate) {
      alert('Task with this title already exists!');
      return; 
    }

    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      isComplete: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);

    await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify(newTask),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
      })
      .catch((error) => console.error('Error:', error));

    setTitle('');
    setDescription('');
  };

  return (

    <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 900 }}
    initialValues={{ remember: true }}
    onFinish={handleSubmit}
    autoComplete="off"
  >
    <div>
      <Form.Item<Task>>
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
      </Form.Item>

      <div style={{ marginBottom: '10px' }}>
        <Input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      <List
        header={<b>Task List</b>}
        bordered
        dataSource={filterTasks} // Use filtered tasks here
        renderItem={(task) => (
          <List.Item key={task.id}>
            <Flex vertical>
              <div>
                <b>{task.title}</b>
                <p>{task.description}</p>
              </div>
              <div>
                <Flex gap="middle">
                  <Button
                    type="primary"
                    onClick={() => toggleTaskCompletion(task.id)}
                  >
                    {task.isComplete ? 'Mark as Incomplete' : 'Complete'}
                  </Button>
                  <Button danger onClick={() => deleteTask(task.id)}>
                    Delete
                  </Button>
                </Flex>
              </div>
            </Flex>
          </List.Item>
        )}
      />
    </div>
    </Form>
  );
};

export default TaskForm;
