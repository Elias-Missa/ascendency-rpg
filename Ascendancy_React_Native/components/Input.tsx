import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';
import { Colors } from '@/constants/Colors';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    className?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
    return (
        <View className={`w-full ${className}`}>
            {label && (
                <Text className="text-muted-foreground font-mono text-xs uppercase mb-1.5 ml-1">
                    {label}
                </Text>
            )}
            <View className={`
        bg-input/50 border rounded-md overflow-hidden relative
        ${error ? 'border-destructive' : 'border-border focus:border-primary'}
      `}>
                <TextInput
                    placeholderTextColor={Colors.mutedForeground}
                    className="px-4 py-3 text-foreground font-body text-base"
                    style={{ fontFamily: 'Inter_400Regular' }} // Ensure font is applied
                    {...props}
                />
                {/* Focus indicator could go here if we used state for focus */}
            </View>
            {error && (
                <Text className="text-destructive text-xs mt-1 ml-1 font-mono">
                    {error}
                </Text>
            )}
        </View>
    );
}
