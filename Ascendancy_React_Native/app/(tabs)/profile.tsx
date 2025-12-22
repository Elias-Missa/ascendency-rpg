import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CyberBackground } from '@/components/CyberBackground';
import { HUDCard } from '@/components/HUDCard';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { User, Zap, Camera, Calendar, ChevronRight, Settings } from 'lucide-react-native';

export default function ProfileScreen() {
    // Mock Data matching screenshot
    const user = {
        name: "Zaka Missa",
        email: "bob@gmail.com",
        level: 2,
        score: 72,
        xp: 167,
        nextLevelXp: 1000,
        progress: 0.167
    };

    return (
        <View className="flex-1 bg-background relative">
            <CyberBackground />
            <SafeAreaView className="flex-1 z-10">
                <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>

                    {/* Header */}
                    <View className="mb-6">
                        <Text className="text-white font-display text-2xl uppercase tracking-wider">Hunter Profile</Text>
                        <Text className="text-muted-foreground font-mono">Your personal dashboard</Text>
                        <View className="h-[1px] bg-primary/30 w-full mt-4" />
                    </View>

                    {/* Main User Card */}
                    <View className="bg-card/50 border border-primary/20 rounded-lg p-6 mb-6 relative overflow-hidden">
                        {/* Corner Accents */}
                        <View className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
                        <View className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
                        <View className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
                        <View className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />

                        <View className="flex-row items-center gap-6">
                            <View className="w-24 h-24 rounded-full border-2 border-primary items-center justify-center shadow-lg shadow-primary/50 relative">
                                <User size={40} color={Colors.primary} />
                                <View className="absolute inset-0 rounded-full border border-primary/30" />
                            </View>
                            <View>
                                <Text className="text-white font-display text-2xl mb-1">{user.name}</Text>
                                <Text className="text-muted-foreground font-mono text-sm mb-3">{user.email}</Text>
                                <View className="flex-row gap-2">
                                    <View className="bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/50">
                                        <Text className="text-yellow-500 text-xs font-bold">Level {user.level}</Text>
                                    </View>
                                    <View className="bg-primary/20 px-3 py-1 rounded-full border border-primary/50">
                                        <Text className="text-primary text-xs font-bold">Score: {user.score}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* XP Bar Section */}
                    <HUDCard className="mb-6 p-5">
                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-muted-foreground font-mono uppercase text-xs">Experience Points</Text>
                            <View className="flex-row items-center gap-1">
                                <Zap size={14} color={Colors.primary} fill={Colors.primary} />
                                <Text className="text-primary font-bold font-mono">{user.xp} XP</Text>
                            </View>
                        </View>

                        {/* Custom Progress Bar */}
                        <View className="h-4 bg-muted/30 rounded-full overflow-hidden border border-border mb-2 relative">
                            <View
                                className="h-full bg-primary shadow-lg shadow-primary"
                                style={{ width: `${(user.xp / 300) * 100}%` }}
                            />
                            {/* Scanline on bar */}
                            <View className="absolute inset-0 bg-white/5" />
                        </View>

                        <Text className="text-right text-muted-foreground font-mono text-[10px]">
                            {user.xp} / {300} XP to Level 3
                        </Text>
                    </HUDCard>

                    {/* Stats Grid */}
                    <View className="flex-row gap-4 mb-6">
                        <View className="flex-1 relative">
                            <HUDCard className="items-center py-6 border-l-4 border-l-yellow-500">
                                <Text className="text-5xl font-display text-yellow-500 mb-2 shadow-sm shadow-yellow-500">{user.level}</Text>
                                <Text className="text-muted-foreground font-mono text-[10px] uppercase tracking-wider">Current Level</Text>
                            </HUDCard>
                            {/* Decorative corner */}
                            <View className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-yellow-500" />
                        </View>

                        <View className="flex-1 relative">
                            <HUDCard className="items-center py-6 border-r-4 border-r-primary">
                                <Text className="text-5xl font-display text-primary mb-2 shadow-sm shadow-primary">{user.score}</Text>
                                <Text className="text-muted-foreground font-mono text-[10px] uppercase tracking-wider">Face Score</Text>
                            </HUDCard>
                            {/* Decorative corner */}
                            <View className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary" />
                        </View>
                    </View>

                    {/* Progress Tracker CTA */}
                    <TouchableOpacity
                        onPress={() => router.push('/progress')}
                        className="bg-card/30 border border-primary/30 rounded-lg p-5 flex-row items-center justify-between mb-4 active:bg-primary/5"
                    >
                        <View className="flex-row items-center gap-4">
                            <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center border border-primary/30">
                                <Camera size={20} color={Colors.primary} />
                            </View>
                            <View>
                                <Text className="text-white font-display uppercase tracking-widest text-sm">Progress Tracker</Text>
                                <Text className="text-muted-foreground text-xs font-mono">Track your transformation</Text>
                            </View>
                        </View>
                        <ChevronRight size={20} color={Colors.primary} />
                    </TouchableOpacity>

                    {/* Settings / Other items */}
                    <TouchableOpacity
                        className="bg-card/30 border border-border rounded-lg p-5 flex-row items-center justify-between active:bg-white/5"
                    >
                        <View className="flex-row items-center gap-4">
                            <View className="w-10 h-10 rounded-lg bg-muted/20 items-center justify-center border border-muted">
                                <Settings size={20} color={Colors.mutedForeground} />
                            </View>
                            <View>
                                <Text className="text-muted-foreground font-display uppercase tracking-widest text-sm">Settings</Text>
                                <Text className="text-muted-foreground/50 text-xs font-mono">App configuration</Text>
                            </View>
                        </View>
                        <ChevronRight size={20} color={Colors.mutedForeground} />
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
