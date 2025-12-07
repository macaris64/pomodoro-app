import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Plus, Trash2, CheckCircle, Circle, Target } from 'lucide-react';
import './TaskSelector.css';

const TaskSelector: React.FC = () => {
    const { tasks, addTask, toggleTask, deleteTask, activeTaskId, setActiveTask } = useTasks();
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isAdding && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isAdding]);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            addTask(newTaskTitle);
            setNewTaskTitle('');
            setIsAdding(false);
        }
    };

    const activeTask = tasks.find(t => t.id === activeTaskId);

    return (
        <div className="task-section glass-panel">
            <div className="task-header">
                <h3><Target size={18} /> Görevler</h3>
                {!isAdding && (
                    <button className="btn-icon" onClick={() => setIsAdding(true)}>
                        <Plus size={18} />
                    </button>
                )}
            </div>

            {activeTask && (
                <div className="active-task-display">
                    <span className="active-label">Şu an odaklanılan:</span>
                    <p className="active-title">{activeTask.title}</p>
                </div>
            )}

            {isAdding && (
                <form onSubmit={handleAddTask} className="add-task-form">
                    <input
                        ref={inputRef}
                        className="task-input"
                        placeholder="Ne üzerinde çalışacaksın?"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                    <button type="submit" className="btn-small-primary">Ekle</button>
                </form>
            )}

            <div className="task-list">
                {tasks.length === 0 && !isAdding && <p className="empty-tasks">Henüz görev yok.</p>}
                {tasks.map(task => (
                    <div
                        key={task.id}
                        className={`task-item ${activeTaskId === task.id ? 'active' : ''}`}
                        onClick={() => setActiveTask(task.id)}
                    >
                        <button
                            className="btn-reset check-btn"
                            onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                        >
                            {task.completed ? <CheckCircle size={18} color="#10b981" /> : <Circle size={18} />}
                        </button>

                        <span className={`task-title ${task.completed ? 'completed' : ''}`}>
                            {task.title}
                        </span>

                        <button
                            className="btn-reset delete-btn"
                            onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskSelector;
