import React, { useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CyberBackground } from '@/components/CyberBackground';
import { HUDCard } from '@/components/HUDCard';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';

export default function AuthScreen() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, signUp } = useAuth();

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            if (isLogin) {
                const { error } = await signIn(email, password);
                if (error) throw error;
                router.replace('/(tabs)');
            } else {
                const { error } = await signUp(email, password, username);
                if (error) throw error;
                Alert.alert('Success', 'Check your email for confirmation!');
                setIsLogin(true);
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-background relative">
            <CyberBackground />
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView className="flex-1">
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
                    <View className="items-center mb-8">
                        <View className="w-24 h-24 rounded-full border-2 border-primary items-center justifyContent-center mb-4 bg-primary/10 shadow-lg shadow-primary">
                            <Text className="text-4xl">🧬</Text>
                        </View>
                        <Text className="text-primary font-display text-3xl font-bold tracking-widest text-center shadow-primary/50">
                            ASCENDENCY
                        </Text>
                        <Text className="text-muted-foreground font-mono text-xs tracking-[0.2em] mt-2">
                            SYSTEM INITIALIZATION
                        </Text>
                    </View>

                    <HUDCard className="p-6">
                        <Text className="text-foreground font-display text-xl mb-6 text-center">
                            {isLogin ? 'HUNTER LOGIN' : 'NEW REGISTRATION'}
                        </Text>

                        <View className="gap-4">
                            {!isLogin && (
                                <Input
                                    label="Codename"
                                    placeholder="Enter username"
                                    value={username}
                                    onChangeText={setUsername}
                                    autoCapitalize="none"
                                />
                            )}

                            <Input
                                label="Identifier"
                                placeholder="Enter email"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />

                            <Input
                                label="Passcode"
                                placeholder="Enter password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />

                            <Button
                                label={isLogin ? 'ACCESS SYSTEM' : 'INITIALIZE PROFILE'}
                                onPress={handleAuth}
                                loading={loading}
                                className="mt-4"
                            />

                            <Button
                                label={isLogin ? 'Create Access ID' : 'Return to Login'}
                                variant="ghost"
                                onPress={() => setIsLogin(!isLogin)}
                                size="sm"
                            />
                        </View>
                    </HUDCard>

                    <View className="mt-8 flex-row justify-center gap-8 opacity-50">
                        <View className="items-center">
                            <Text className="text-primary text-xs font-mono">AI ANALYSIS</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-primary text-xs font-mono">SECURE DATA</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-primary text-xs font-mono">GAMIFIED XP</Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
