import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react-native';

interface ControlsProps {
    isRunning: boolean;
    onToggle: () => void;
    onReset: () => void;
    onSkip: () => void;
}

const Controls: React.FC<ControlsProps> = ({ isRunning, onToggle, onReset, onSkip }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onReset} style={styles.secondaryBtn}>
                <RotateCcw size={24} color="#94a3b8" />
            </TouchableOpacity>

            <TouchableOpacity onPress={onToggle} style={styles.primaryBtn} activeOpacity={0.8}>
                {isRunning ? (
                    <Pause size={32} color="#fff" fill="#fff" />
                ) : (
                    <Play size={32} color="#fff" fill="#fff" style={{ marginLeft: 4 }} />
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={onSkip} style={styles.secondaryBtn}>
                <SkipForward size={24} color="#94a3b8" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
        marginTop: 20,
    },
    primaryBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    secondaryBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
});

export default Controls;
