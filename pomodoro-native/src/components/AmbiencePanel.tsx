import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import Slider from '@react-native-community/slider';
import { CloudRain, Trees, Wind, Volume2, VolumeX, Music } from 'lucide-react-native';
import { useAudio, SoundType } from '../context/AudioContext';

const AmbiencePanel: React.FC = () => {
    const { activeAmbience, volume, setActiveAmbience, setVolume } = useAudio();

    const openSpotify = () => {
        Linking.openURL('https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM');
    };

    const renderSoundBtn = (type: SoundType, Icon: any, label: string) => (
        <TouchableOpacity
            style={[styles.soundBtn, activeAmbience === type && styles.activeSoundBtn]}
            onPress={() => setActiveAmbience(activeAmbience === type ? 'none' : type)}
        >
            <Icon size={24} color={activeAmbience === type ? '#fff' : '#94a3b8'} />
            <Text style={[styles.soundLabel, activeAmbience === type && styles.activeSoundLabel]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.soundsRow}>
                {renderSoundBtn('rain', CloudRain, 'Yağmur')}
                {renderSoundBtn('forest', Trees, 'Orman')}
                {renderSoundBtn('wind', Wind, 'Rüzgar')}
            </View>

            <View style={styles.volumeRow}>
                {volume === 0 ? <VolumeX size={20} color="#94a3b8" /> : <Volume2 size={20} color="#94a3b8" />}
                <Slider
                    style={{ flex: 1, marginHorizontal: 10, height: 40 }}
                    minimumValue={0}
                    maximumValue={1}
                    value={volume}
                    onValueChange={setVolume}
                    minimumTrackTintColor="#6366f1"
                    maximumTrackTintColor="rgba(255,255,255,0.2)"
                    thumbTintColor="#fff"
                />
            </View>

            <TouchableOpacity style={styles.spotifyBtn} onPress={openSpotify}>
                <Music size={18} color="#1DB954" style={{ marginRight: 8 }} />
                <Text style={styles.spotifyText}>Spotify Lo-Fi Listesi</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 16,
        marginTop: 20,
        width: '90%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    soundsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    soundBtn: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
        width: '30%',
    },
    activeSoundBtn: {
        backgroundColor: '#6366f1',
    },
    soundLabel: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 4,
    },
    activeSoundLabel: {
        color: '#fff',
        fontWeight: 'bold',
    },
    volumeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    spotifyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    spotifyText: {
        color: '#fff',
        fontSize: 14,
    },
});

export default AmbiencePanel;
