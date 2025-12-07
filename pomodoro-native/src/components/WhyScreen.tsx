import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Target } from 'lucide-react-native';

interface WhyScreenProps {
    isOpen: boolean;
    taskTitle?: string;
    onCommit: (reason: string) => void;
    onCancel: () => void;
}

const WhyScreen: React.FC<WhyScreenProps> = ({ isOpen, taskTitle, onCommit, onCancel }) => {
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        if (reason.trim()) {
            onCommit(reason.trim());
            setReason('');
        }
    };

    return (
        <Modal
            visible={isOpen}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.modal}>
                    <View style={styles.iconContainer}>
                        <Target size={32} color="#6366f1" />
                    </View>

                    <Text style={styles.title}>Niyet Belirle</Text>

                    {taskTitle && (
                        <Text style={styles.subtitle}>
                            Görev: <Text style={{ fontWeight: 'bold', color: '#fff' }}>{taskTitle}</Text>
                        </Text>
                    )}

                    <Text style={styles.question}>
                        Bu oturumda bunu başarmak neden önemli?
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Örn: Projeyi bitirmek için kritik, kendime söz verdim..."
                        placeholderTextColor="#64748b"
                        value={reason}
                        onChangeText={setReason}
                        multiline
                        numberOfLines={3}
                        autoFocus
                    />

                    <View style={styles.actions}>
                        <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
                            <Text style={styles.cancelText}>İptal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            style={[styles.commitBtn, !reason.trim() && styles.disabledBtn]}
                            disabled={!reason.trim()}
                        >
                            <Text style={styles.commitText}>Başla</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modal: {
        backgroundColor: '#0f172a',
        width: '100%',
        maxWidth: 400,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#94a3b8',
        marginBottom: 20,
        textAlign: 'center',
    },
    question: {
        fontSize: 16,
        color: '#e2e8f0',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: 24,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    cancelBtn: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
    },
    commitBtn: {
        flex: 2,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#6366f1',
        alignItems: 'center',
    },
    disabledBtn: {
        opacity: 0.5,
    },
    cancelText: {
        color: '#fff',
        fontWeight: '600',
    },
    commitText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default WhyScreen;
