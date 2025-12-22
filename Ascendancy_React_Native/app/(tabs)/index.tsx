import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CyberBackground } from '@/components/CyberBackground';
import { HUDCard } from '@/components/HUDCard';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/Colors';
import { Flag, Zap } from 'lucide-react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background relative" style={{ flex: 1 }}>
      <CyberBackground />
      <SafeAreaView className="flex-1 z-10" edges={['top']} style={{ flex: 1 }}>
        <ScrollView className="flex-1 px-4 py-6">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-8">
            <View>
              <Text className="text-primary font-mono text-xs mb-1 tracking-widest">WELCOME BACK</Text>
              <Text className="text-foreground font-display text-2xl">ZAKA MISSA</Text>
            </View>
            <View className="flex-row items-center border border-primary/30 rounded-full px-3 py-1 bg-background/50">
              <Zap size={14} color={Colors.primary} fill={Colors.primary} />
              <Text className="text-primary font-mono ml-2 font-bold">167 XP</Text>
            </View>
          </View>

          {/* Level Progress */}
          <View className="mb-8">
            <View className="flex-row justify-between mb-2">
              <Text className="text-muted-foreground font-mono text-xs">LEVEL 2</Text>
              <Text className="text-muted-foreground font-mono text-xs">LEVEL 3</Text>
            </View>
            <View className="h-2 bg-muted rounded-full overflow-hidden border border-border">
              <View className="h-full bg-primary w-[67%]" />
            </View>
          </View>

          {/* Stats Grid */}
          <View className="flex-row gap-4 mb-8">
            <View className="flex-1">
              <HUDCard className="items-center py-6">
                <Text className="text-4xl font-display text-primary mb-1">2</Text>
                <Text className="text-muted-foreground font-mono text-xs uppercase">Level</Text>
              </HUDCard>
            </View>
            <View className="flex-1">
              <HUDCard className="items-center py-6">
                <Text className="text-4xl font-display text-foreground mb-1">72</Text>
                <Text className="text-muted-foreground font-mono text-xs uppercase">Face Score</Text>
              </HUDCard>
            </View>
            <View className="flex-1">
              <HUDCard className="items-center py-6">
                <Text className="text-4xl font-display text-foreground mb-1">0/0</Text>
                <Text className="text-muted-foreground font-mono text-xs uppercase">Tasks</Text>
              </HUDCard>
            </View>
          </View>

          {/* Quick Actions */}
          <Text className="text-muted-foreground font-mono text-xs tracking-widest mb-4">QUICK ACTIONS</Text>
          <View className="flex-row flex-wrap gap-4">
            <Button label="View Report" variant="primary" className="flex-1 min-w-[45%]" />
            <Button label="Daily Tasks" variant="outline" className="flex-1 min-w-[45%]" />
            <Button label="Guide" variant="outline" className="flex-1 min-w-[45%]" />
            <Button label="New Scan" variant="outline" className="flex-1 min-w-[45%]" />
          </View>

          <View className="mt-12 items-center">
            <View className="flex-row items-center gap-2">
              <View className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <Text className="text-green-500/80 font-mono text-xs tracking-widest">SYSTEM OPERATIONAL</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
