import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { CheckCircle } from 'lucide-react-native';

interface SessionCompleteModalProps {
    isOpen: boolean;
    duration: number;
    onSave: (note: string) => void;
    onDiscard: () => void;
}

const SessionCompleteModal: React.FC<SessionCompleteModalProps> = ({ isOpen, duration, onSave, onDiscard }) => {
    const [note, setNote] = useState('');

    const handleSave = () => {
        onSave(note);
        setNote('');
    };

    const handleDiscard = () => {
        onDiscard();
        setNote('');
    };

    return (
        <Modal
            visible={isOpen}
            transparent
            animationType="fade"
            onRequestClose={handleDiscard}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.modal}>
                    <View style={styles.iconContainer}>
                        <CheckCircle size={48} color="#10b981" />
                    </View>

                    <Text style={styles.title}>Oturum Tamamlandı!</Text>
                    <Text style={styles.subtitle}>{duration} dakika odaklandın.</Text>

                    <Text style={styles.label}>Neler yaptın?</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Kısa bir not ekle..."
                        placeholderTextColor="#64748b"
                        value={note}
                        onChangeText={setNote}
                        multiline
                        numberOfLines={3}
                        autoFocus
                    />

                    <View style={styles.actions}>
                        <TouchableOpacity onPress={handleDiscard} style={styles.discardBtn}>
                            <Text style={styles.discardText}>Kaydetme</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                            <Text style={styles.saveText}>Kaydet</Text>
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
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    iconContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#94a3b8',
        marginBottom: 24,
    },
    label: {
        width: '100%',
        color: '#e2e8f0',
        marginBottom: 8,
        fontSize: 14,
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
    discardBtn: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
    },
    saveBtn: {
        flex: 2,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#10b981',
        alignItems: 'center',
    },
    discardText: {
        color: '#94a3b8',
        fontWeight: '600',
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default SessionCompleteModal;
