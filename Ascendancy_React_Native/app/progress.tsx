import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { CyberBackground } from '@/components/CyberBackground';
import { HUDCard } from '@/components/HUDCard';
import { Colors } from '@/constants/Colors';
import { Clock, Calendar, ChevronLeft, Camera, Image as ImageIcon } from 'lucide-react-native';

export default function ProgressScreen() {
    const [frequency, setFrequency] = useState<'bi-weekly' | 'monthly'>('bi-weekly');

    return (
        <View className="flex-1 bg-background relative">
            <CyberBackground />
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView className="flex-1">
                <View className="px-4 py-4 flex-row items-center justify-between border-b border-primary/20 bg-background/80">
                    <TouchableOpacity onPress={() => router.back()} className="p-2">
                        <ChevronLeft size={24} color={Colors.primary} />
                    </TouchableOpacity>
                    <Text className="text-white font-display text-lg uppercase tracking-wider">Progress Tracker</Text>
                    <View className="w-10" />
                </View>

                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    <Text className="text-center text-muted-foreground font-mono text-xs mb-8">
                        Track your transformation over time
                    </Text>

                    {/* Photo Frequency */}
                    <HUDCard className="mb-8 p-5">
                        <View className="flex-row items-center gap-2 mb-4">
                            <Clock size={18} color={Colors.primary} />
                            <Text className="text-white font-display text-sm">Photo Frequency</Text>
                        </View>

                        <View className="flex-row bg-muted/20 p-1 rounded-md border border-border">
                            <TouchableOpacity
                                onPress={() => setFrequency('bi-weekly')}
                                className={`flex-1 py-3 px-2 rounded-sm items-center ${frequency === 'bi-weekly' ? 'bg-primary' : 'bg-transparent'}`}
                            >
                                <Text className={`font-bold font-mono text-xs ${frequency === 'bi-weekly' ? 'text-black' : 'text-muted-foreground'}`}>
                                    BI-WEEKLY (14 DAYS)
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setFrequency('monthly')}
                                className={`flex-1 py-3 px-2 rounded-sm items-center ${frequency === 'monthly' ? 'bg-white/10' : 'bg-transparent'}`}
                            >
                                <Text className={`font-bold font-mono text-xs ${frequency === 'monthly' ? 'text-white' : 'text-muted-foreground'}`}>
                                    Monthly (30 days)
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </HUDCard>

                    {/* Status Grid */}
                    <View className="flex-row gap-4 mb-8">
                        <View className="flex-1 border border-primary/30 bg-card/30 rounded-lg p-6 items-center justify-center relative overlow-hidden">
                            <View className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary" />
                            <View className="mb-2">
                                <ImageIcon size={24} color={Colors.primary} />
                            </View>
                            <Text className="text-4xl font-display text-white mb-1">0</Text>
                            <Text className="text-muted-foreground font-mono text-[10px] uppercase">Total Photos</Text>
                        </View>

                        <View className="flex-1 border border-primary/30 bg-card/30 rounded-lg p-6 items-center justify-center relative overlow-hidden">
                            <View className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary" />
                            <View className="mb-2">
                                <Calendar size={24} color={Colors.primary} />
                            </View>
                            <Text className="text-3xl font-display text-white mb-1">Now!</Text>
                            <Text className="text-muted-foreground font-mono text-[10px] uppercase">Photo Due</Text>
                        </View>
                    </View>

                    {/* Camera CTA */}
                    <HUDCard className="p-0 overflow-hidden min-h-[250px] justify-center items-center border border-dashed border-primary/30 bg-black/40">
                        <View className="items-center gap-4 px-8">
                            <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center border border-primary animate-pulse">
                                <Camera size={32} color={Colors.primary} />
                            </View>
                            <Text className="text-white font-display text-lg text-center">Take Your First Progress Photo</Text>
                            <Text className="text-muted-foreground font-mono text-xs text-center leading-5">
                                Consistent lighting and angles are key for accurate analysis.
                            </Text>
                        </View>

                        {/* Frame markers */}
                        <View className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary/50" />
                        <View className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/50" />
                        <View className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary/50" />
                        <View className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary/50" />
                    </HUDCard>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
