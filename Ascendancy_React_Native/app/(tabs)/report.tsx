import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CyberBackground } from '@/components/CyberBackground';
import { HUDCard } from '@/components/HUDCard';

export default function ReportScreen() {
    return (
        <View className="flex-1 bg-background relative">
            <CyberBackground />
            <SafeAreaView className="flex-1 p-4">
                <HUDCard title="Analysis Report">
                    <Text className="text-foreground">Report content coming soon...</Text>
                </HUDCard>
            </SafeAreaView>
        </View>
    );
}
