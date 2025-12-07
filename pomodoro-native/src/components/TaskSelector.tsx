import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Plus, Check, Trash2, Circle, CheckCircle } from 'lucide-react-native';
import { useTasks } from '../context/TaskContext';

const TaskSelector: React.FC = () => {
    const { tasks, activeTaskId, addTask, toggleTask, deleteTask, setActiveTask } = useTasks();
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = () => {
        if (newTaskTitle.trim()) {
            addTask(newTaskTitle.trim());
            setNewTaskTitle('');
            setIsAdding(false);
        }
    };

    const activeTask = tasks.find(t => t.id === activeTaskId);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Görevler</Text>
                <TouchableOpacity onPress={() => setIsAdding(!isAdding)} style={styles.addBtn}>
                    <Plus size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {activeTask && (
                <View style={styles.activeTaskBanner}>
                    <Text style={styles.activeLabel}>Şu an odaklanılan:</Text>
                    <Text style={styles.activeTitle}>{activeTask.title}</Text>
                </View>
            )}

            {isAdding && (
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Yeni görev adı..."
                        placeholderTextColor="#94a3b8"
                        value={newTaskTitle}
                        onChangeText={setNewTaskTitle}
                        autoFocus
                        onSubmitEditing={handleAdd}
                        returnKeyType="done"
                    />
                    <TouchableOpacity onPress={handleAdd} style={styles.confirmBtn}>
                        <Check size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}

            <ScrollView style={styles.list} nestedScrollEnabled>
                {tasks.length === 0 && !isAdding && (
                    <Text style={styles.emptyText}>Henüz görev yok. Bir tane ekle!</Text>
                )}
                {tasks.map(task => (
                    <TouchableOpacity
                        key={task.id}
                        style={[styles.taskItem, activeTaskId === task.id && styles.activeItem]}
                        onPress={() => setActiveTask(task.id)}
                    >
                        <TouchableOpacity onPress={(e) => { e.preventDefault && e.preventDefault(); toggleTask(task.id); }}>
                            {task.completed ?
                                <CheckCircle size={20} color="#10b981" /> :
                                <Circle size={20} color="#94a3b8" />
                            }
                        </TouchableOpacity>

                        <Text style={[
                            styles.taskTitle,
                            task.completed && styles.completedText,
                            activeTaskId === task.id && styles.activeText
                        ]}>
                            {task.title}
                        </Text>

                        <TouchableOpacity onPress={(e) => { e.preventDefault && e.preventDefault(); deleteTask(task.id); }}>
                            <Trash2 size={18} color="#ef4444" style={{ opacity: 0.6 }} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        maxHeight: 300,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addBtn: {
        padding: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
    },
    activeTaskBanner: {
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#6366f1',
    },
    activeLabel: {
        color: '#a5b4fc',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    activeTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        gap: 8,
    },
    input: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 8,
        color: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    confirmBtn: {
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    list: {
        maxHeight: 200,
    },
    emptyText: {
        color: '#94a3b8',
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 6,
        gap: 10,
    },
    activeItem: {
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderColor: '#6366f1',
        borderWidth: 1,
    },
    taskTitle: {
        flex: 1,
        color: '#e2e8f0',
        fontSize: 14,
    },
    activeText: {
        color: '#fff',
        fontWeight: '600',
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#64748b',
    },
});

export default TaskSelector;
