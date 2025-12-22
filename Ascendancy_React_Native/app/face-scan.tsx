import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Stack, router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/Button';
import { Scan, Circle, X } from 'lucide-react-native';

export default function FaceScanScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [step, setStep] = useState<'front' | 'smile' | 'side'>('front');
    const [cameraRef, setCameraRef] = useState<CameraView | null>(null);

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View className="flex-1 justify-center items-center bg-background p-8">
                <Text className="text-foreground text-center mb-4">We need your permission to show the camera</Text>
                <Button onPress={requestPermission} label="Grant Permission" />
            </View>
        );
    }

    const handleCapture = () => {
        // Mock capture
        if (step === 'front') setStep('smile');
        else if (step === 'smile') setStep('side');
        else {
            // Complete
            Alert.alert('Scan Complete', 'Analyzing your data...');
            setTimeout(() => {
                router.replace('/(tabs)/report');
            }, 1500);
        }
    };

    return (
        <View className="flex-1 bg-black relative">
            <Stack.Screen options={{ headerShown: false }} />
            <CameraView
                style={{ flex: 1 }}
                facing="front"
                ref={(ref) => setCameraRef(ref)}
            >
                <SafeAreaView className="flex-1 justify-between p-6">
                    <View className="flex-row justify-between items-center">
                        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center bg-black/50 rounded-full">
                            <X color="white" size={24} />
                        </TouchableOpacity>
                        <View className="bg-black/50 px-4 py-2 rounded-full border border-primary/50">
                            <Text className="text-primary font-mono font-bold uppercase">{step.toUpperCase()} SCAN</Text>
                        </View>
                        <View className="w-10" />
                    </View>

                    <View className="items-center justify-center flex-1">
                        <View className="w-[80vw] h-[50vh] border-2 border-primary/30 rounded-[100px] border-dashed justify-center items-center relative">
                            {/* Corner brackets */}
                            <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary" />
                            <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary" />
                            <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary" />
                            <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary" />

                            <Scan size={48} color={Colors.primary} style={{ opacity: 0.5 }} />
                        </View>
                        <Text className="text-white font-display mt-8 text-center bg-black/50 px-4 py-1">
                            {step === 'front' && 'Position face in frame'}
                            {step === 'smile' && 'Give a natural smile'}
                            {step === 'side' && 'Turn slightly to the side'}
                        </Text>
                    </View>

                    <View className="flex-row justify-center items-center mb-8">
                        <TouchableOpacity
                            onPress={handleCapture}
                            className="w-20 h-20 rounded-full border-4 border-primary items-center justify-center bg-white/10"
                        >
                            <View className="w-16 h-16 bg-primary rounded-full items-center justify-center">
                                <Circle fill="white" color="white" size={64} style={{ opacity: 0 }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </CameraView>
        </View>
    );
}
