import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';
import { X, Trash2, Calendar, Clock } from 'lucide-react-native';
import { useHistory } from '../context/HistoryContext';

interface HistoryViewProps {
    isOpen: boolean;
    onClose: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ isOpen, onClose }) => {
    const { history, clearHistory } = useHistory();

    const formatDate = (ts: number) => new Date(ts).toLocaleDateString();
    const formatTime = (ts: number) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.historyItem}>
            <View style={styles.itemHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} color="#94a3b8" />
                    <Text style={styles.dateText}>{formatDate(item.startTime)}</Text>
                    <Clock size={14} color="#94a3b8" style={{ marginLeft: 8 }} />
                    <Text style={styles.dateText}>{formatTime(item.startTime)} - {formatTime(item.endTime)}</Text>
                </View>
                <Text style={styles.durationText}>{item.duration} dk</Text>
            </View>

            {item.note && <Text style={styles.note}>{item.note}</Text>}
            {item.commitment && (
                <Text style={styles.commitment}>🎯 {item.commitment}</Text>
            )}
        </View>
    );

    return (
        <Modal visible={isOpen} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Geçmiş</Text>
                        <View style={{ flexDirection: 'row', gap: 16 }}>
                            {history.length > 0 && (
                                <TouchableOpacity onPress={clearHistory}>
                                    <Trash2 size={24} color="#ef4444" />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={onClose}>
                                <X size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <FlatList
                        data={history}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>Henüz tamamlanmış oturum yok.</Text>
                        }
                    />
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
    listContent: {
        paddingBottom: 40,
    },
    historyItem: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    dateText: {
        color: '#94a3b8',
        fontSize: 12,
    },
    durationText: {
        color: '#6366f1',
        fontWeight: 'bold',
    },
    note: {
        color: '#e2e8f0',
        fontSize: 14,
        marginBottom: 4,
    },
    commitment: {
        color: '#10b981',
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 4,
    },
    emptyText: {
        color: '#94a3b8',
        textAlign: 'center',
        marginTop: 40,
    }
});

export default HistoryView;
