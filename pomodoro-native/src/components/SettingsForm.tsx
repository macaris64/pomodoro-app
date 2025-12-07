import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, ScrollView, Alert } from 'react-native';
import { X, Save } from 'lucide-react-native';
import { useSettings, Theme } from '../context/SettingsContext';
import { useHistory } from '../context/HistoryContext';

interface SettingsFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ isOpen, onClose }) => {
    const { settings, updateSettings } = useSettings();
    const { clearHistory } = useHistory();
    const [localSettings, setLocalSettings] = useState(settings);

    const handleChange = (name: string, value: any) => {
        setLocalSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        updateSettings(localSettings);
        onClose();
    };

    const renderInput = (label: string, field: keyof typeof settings, min: number, max: number) => (
        <View style={styles.formGroup}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                value={String(localSettings[field])}
                keyboardType="numeric"
                onChangeText={(text) => handleChange(field as string, Number(text))}
            />
        </View>
    );

    const themes: Theme[] = ['default', 'cyberpunk'];

    return (
        <Modal visible={isOpen} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Ayarlar</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Tema</Text>
                            <View style={styles.themeSelector}>
                                {themes.map(t => (
                                    <TouchableOpacity
                                        key={t}
                                        style={[
                                            styles.themeBtn,
                                            localSettings.theme === t && styles.activeThemeBtn
                                        ]}
                                        onPress={() => handleChange('theme', t)}
                                    >
                                        <Text style={[
                                            styles.themeText,
                                            localSettings.theme === t && styles.activeThemeText
                                        ]}>
                                            {t.charAt(0).toUpperCase() + t.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {renderInput('Odaklanma (dk)', 'workDuration', 1, 60)}
                        {renderInput('Kısa Mola (dk)', 'shortBreakDuration', 1, 30)}
                        {renderInput('Uzun Mola (dk)', 'longBreakDuration', 1, 60)}
                        {renderInput('Günlük Hedef', 'dailyGoal', 1, 20)}

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Kullanıcı Adı</Text>
                            <TextInput
                                style={styles.input}
                                value={localSettings.userName}
                                onChangeText={(text) => handleChange('userName', text)}
                                placeholder="İsim..."
                                placeholderTextColor="#64748b"
                            />
                        </View>

                        <View style={[styles.formGroup, { marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' }]}>
                            <Text style={[styles.label, { color: '#ef4444' }]}>Tehlikeli Bölge</Text>
                            <TouchableOpacity
                                style={[styles.input, { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: '#ef4444', alignItems: 'center' }]}
                                onPress={() => {
                                    Alert.alert(
                                        'Verileri Sil',
                                        'Tüm geçmiş verileriniz kalıcı olarak silinecek. Emin misiniz?',
                                        [
                                            { text: 'İptal', style: 'cancel' },
                                            {
                                                text: 'Sil',
                                                style: 'destructive',
                                                onPress: () => {
                                                    clearHistory();
                                                    Alert.alert('Başarılı', 'Veriler temizlendi.');
                                                }
                                            }
                                        ]
                                    );
                                }}
                            >
                                <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Tüm Verilerimi Sil</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                        <Save size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.saveText}>Kaydet</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: '#0f172a',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        height: '80%',
        borderTopWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        flex: 1,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        color: '#94a3b8',
        marginBottom: 8,
        fontSize: 14,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 12,
        color: '#fff',
        fontSize: 16,
    },
    themeSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    themeBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    activeThemeBtn: {
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
    },
    themeText: {
        color: '#94a3b8',
        fontSize: 12,
    },
    activeThemeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    saveBtn: {
        backgroundColor: '#6366f1',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginTop: 20,
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default SettingsForm;
