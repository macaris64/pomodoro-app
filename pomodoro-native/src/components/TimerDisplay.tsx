import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import type { TimerMode } from '../utils/TimerEngine';
import ForestDisplay from './ForestDisplay';

const { width } = Dimensions.get('window');
const SIZE = width * 0.8;
const RADIUS = SIZE / 2;
const STROKE_WIDTH = 15;
const CIRCLE_LENGTH = 2 * Math.PI * (RADIUS - STROKE_WIDTH / 2);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface TimerDisplayProps {
    remainingSeconds: number;
    totalSeconds: number;
    mode: TimerMode;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ remainingSeconds, totalSeconds, mode }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;

        // Animate to new progress
        Animated.timing(animatedValue, {
            toValue: progress,
            duration: 950, // Slightly less than 1s to ensure it completes
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    }, [remainingSeconds, totalSeconds]);

    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [CIRCLE_LENGTH, 0]
    });

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const modeLabels: Record<TimerMode, string> = {
        work: 'ODAKLAN',
        shortBreak: 'KISA MOLA',
        longBreak: 'UZUN MOLA'
    };

    return (
        <View style={styles.container}>
            <View style={{ width: SIZE, height: SIZE, justifyContent: 'center', alignItems: 'center' }}>
                <Svg width={SIZE} height={SIZE} style={{ position: 'absolute' }}>
                    <Defs>
                        <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                            <Stop offset="0" stopColor="#6366f1" stopOpacity="1" />
                            <Stop offset="1" stopColor="#ec4899" stopOpacity="1" />
                        </LinearGradient>
                    </Defs>

                    {/* Background Circle */}
                    <Circle
                        cx={RADIUS}
                        cy={RADIUS}
                        r={RADIUS - STROKE_WIDTH / 2}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth={STROKE_WIDTH}
                        fill="transparent"
                    />

                    {/* Progress Circle */}
                    <AnimatedCircle
                        cx={RADIUS}
                        cy={RADIUS}
                        r={RADIUS - STROKE_WIDTH / 2}
                        stroke="url(#grad)"
                        strokeWidth={STROKE_WIDTH}
                        fill="transparent"
                        strokeDasharray={CIRCLE_LENGTH}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        rotation="-90"
                        origin={`${RADIUS}, ${RADIUS}`}
                    />
                </Svg>

                {mode === 'work' && (
                    <ForestDisplay
                        progress={totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0}
                    />
                )}

                <View style={styles.textContainer}>
                    <Text style={styles.timeText}>{formatTime(remainingSeconds)}</Text>
                    <Text style={styles.modeText}>{modeLabels[mode]}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 40,
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    timeText: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#fff',
        fontVariant: ['tabular-nums'],
    },
    modeText: {
        fontSize: 14,
        color: '#94a3b8',
        letterSpacing: 2,
        marginTop: 5,
    },
});

export default TimerDisplay;
