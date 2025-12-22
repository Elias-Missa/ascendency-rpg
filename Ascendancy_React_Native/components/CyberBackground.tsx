import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Line, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

export function CyberBackground() {
    const scanLineY = useSharedValue(0);

    useEffect(() => {
        scanLineY.value = withRepeat(
            withTiming(height, {
                duration: 3000,
                easing: Easing.linear,
            }),
            -1,
            false
        );
    }, []);

    const animatedScanLineStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: scanLineY.value }],
    }));

    return (
        <View className="absolute inset-0 bg-background z-0">
            {/* Grid Pattern */}
            <Svg height="100%" width="100%" style={{ opacity: 0.15 }}>
                <Defs>
                    <LinearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor={Colors.primary} stopOpacity="0.2" />
                        <Stop offset="1" stopColor={Colors.primary} stopOpacity="0" />
                    </LinearGradient>
                </Defs>
                {/* Draw vertical lines */}
                {Array.from({ length: Math.floor(width / 40) }).map((_, i) => (
                    <Line
                        key={`v-${i}`}
                        x1={i * 40}
                        y1="0"
                        x2={i * 40}
                        y2={height}
                        stroke={Colors.primary}
                        strokeWidth="1"
                    />
                ))}
                {/* Draw horizontal lines */}
                {Array.from({ length: Math.floor(height / 40) }).map((_, i) => (
                    <Line
                        key={`h-${i}`}
                        x1="0"
                        y1={i * 40}
                        x2={width}
                        y2={i * 40}
                        stroke={Colors.primary}
                        strokeWidth="1"
                    />
                ))}
            </Svg>

            {/* Scanline Effect */}
            <Animated.View
                style={[
                    { position: 'absolute', width: '100%', height: 2, backgroundColor: Colors.primary, opacity: 0.3, shadowColor: Colors.primary, shadowRadius: 10, shadowOpacity: 0.8 },
                    animatedScanLineStyle
                ]}
            />

            {/* Vignette Overlay (Dark edges) */}
            <View className="absolute inset-0 bg-transparent"
                style={{
                    backgroundColor: 'transparent',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 100,
                    // Note: React Native shadow is for elevation, this is a hacky vignette substitute or we use a radial gradient image/svg
                }}
            >
                {/* Using a radial gradient here would be better but requires expo-linear-gradient limited to linear usually, or react-native-svg radial gradient */}
                <Svg height="100%" width="100%" className="absolute inset-0">
                    <Defs>
                        <LinearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="#0a0a0a" stopOpacity="0.8" />
                            <Stop offset="0.5" stopColor="#0a0a0a" stopOpacity="0" />
                            <Stop offset="1" stopColor="#0a0a0a" stopOpacity="0.8" />
                        </LinearGradient>
                    </Defs>
                    <Rect x="0" y="0" width="100%" height="100%" fill="url(#vignette)" />
                </Svg>
            </View>
        </View>
    );
}
