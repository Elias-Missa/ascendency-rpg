import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { cn } from '../lib/utils'; // Assuming we create a utils for cn, or just use standard style array

// Simple utility for now if not existing
function classNames(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

interface HUDCardProps extends ViewProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export function HUDCard({ children, className, title, ...props }: HUDCardProps) {
    return (
        <View
            className={classNames(
                "bg-card border border-border/50 p-4 relative overflow-hidden rounded-md",
                className
            )}
            {...props}
        >
            {/* Corner Accents */}
            <View className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary" />
            <View className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary" />
            <View className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary" />
            <View className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary" />

            {title && (
                <Text className="text-primary font-display mb-2 text-lg uppercase tracking-wider shadow-primary/50 shadow-sm">
                    {title}
                </Text>
            )}

            {children}
        </View>
    );
}
