import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

interface ForestDisplayProps {
    progress: number; // 0 to 1
    isWithered?: boolean;
}

const ForestDisplay: React.FC<ForestDisplayProps> = ({ progress, isWithered = false }) => {
    // Clamp progress between 0 and 1
    const growth = Math.min(Math.max(progress, 0), 1);
    const scale = 0.3 + (growth * 0.7); // Start at 30% size, grow to 100%

    return (
        <View style={[styles.container, isWithered && styles.witheredContainer]}>
            <View style={{ transform: [{ scale }] }}>
                <Svg height="200" width="200" viewBox="0 0 100 100">
                    {/* Trunk */}
                    <Path
                        d="M45,100 L55,100 L50,80 Z"
                        fill={isWithered ? "#5D4037" : "#5D4037"}
                        stroke={isWithered ? "#3E2723" : "none"}
                    />
                    <Path
                        d="M50,85 L50,100"
                        stroke="#3E2723"
                        strokeWidth="2"
                    />

                    {/* Foliage Layers */}
                    <G opacity={growth > 0.1 ? 1 : 0.3}>
                        <Path d="M50,85 L20,85 L50,45 L80,85 Z" fill={isWithered ? "#5D4037" : "#2E7D32"} />
                    </G>

                    <G
                        opacity={growth > 0.4 ? 1 : 0}
                        y="-15"
                        scale="0.9"
                        origin="50, 65"
                    >
                        <Path d="M50,85 L20,85 L50,45 L80,85 Z" fill={isWithered ? "#5D4037" : "#388E3C"} />
                    </G>

                    <G
                        opacity={growth > 0.7 ? 1 : 0}
                        y="-30"
                        scale="0.8"
                        origin="50, 65"
                    >
                        <Path d="M50,85 L20,85 L50,45 L80,85 Z" fill={isWithered ? "#5D4037" : "#43A047"} />
                    </G>
                </Svg>
            </View>
            {isWithered && <Text style={styles.witherText}>SOLDU</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.6,
        zIndex: -1,
    },
    witheredContainer: {
        opacity: 0.8,
    },
    witherText: {
        position: 'absolute',
        color: '#ef4444',
        fontWeight: 'bold',
        fontSize: 24,
        textTransform: 'uppercase',
    },
});

export default ForestDisplay;
