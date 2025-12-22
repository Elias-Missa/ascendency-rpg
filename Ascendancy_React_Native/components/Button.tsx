import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, View, ActivityIndicator } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    label: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    className?: string;
}

export function Button({
    label,
    variant = 'primary',
    size = 'md',
    loading = false,
    className = '',
    disabled,
    ...props
}: ButtonProps) {

    const baseStyles = "flex-row items-center justify-center rounded-md";

    const variantStyles = {
        primary: "bg-primary border border-primary",
        secondary: "bg-secondary border border-secondary",
        outline: "bg-transparent border border-primary",
        ghost: "bg-transparent",
        destructive: "bg-destructive border border-destructive",
    };

    const textStyles = {
        primary: "text-background font-bold uppercase tracking-wider",
        secondary: "text-secondary-foreground font-semibold",
        outline: "text-primary font-bold uppercase tracking-wider",
        ghost: "text-primary font-semibold",
        destructive: "text-destructive-foreground font-bold",
    };

    const sizeStyles = {
        sm: "px-3 py-1.5",
        md: "px-4 py-3",
        lg: "px-6 py-4",
    };

    const textSizeStyles = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
    };

    return (
        <TouchableOpacity
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled || loading ? 'opacity-50' : ''} ${className}`}
            disabled={disabled || loading}
            activeOpacity={0.7}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? 'black' : '#00e5ff'} className="mr-2" />
            ) : null}
            <Text className={`${textStyles[variant]} ${textSizeStyles[size]} font-mono`}>
                {label}
            </Text>

            {/* Decorative glow for primary/outline */}
            {(variant === 'primary' || variant === 'outline') && !disabled && (
                <View className="absolute inset-0 shadow-sm shadow-primary/30 rounded-md pointer-events-none" />
            )}
        </TouchableOpacity>
    );
}
