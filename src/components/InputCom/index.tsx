import React, { useState } from 'react';
import { Modal, View, Text } from 'react-native';
import { Button, Card, Checkbox, IconButton, TextInput, HelperText } from 'react-native-paper';

const TextInputComponent = ({ label, onChange }: { label: string; onChange: (value: string) => void }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [error, setError] = useState<string | undefined>(undefined);

    const handleInputChange = (text: string) => {
        if (text.trim() === '') {
            setError('This field is required');
        } else {
            setError(undefined);
        }
        setInputValue(text);
        onChange(text);
    };

    return (
        <>
            <TextInput label={label} value={inputValue} onChangeText={handleInputChange} />
            <HelperText type="error" visible={!!error}>
                {error}
            </HelperText>
        </>
    );
};

const NumberInputComponent = ({ label, onChange }: { label: string; onChange: (value: number) => void }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [error, setError] = useState<string | undefined>(undefined);

    const handleInputChange = (text: string) => {
        const numericValue = Number(text);
        if (isNaN(numericValue)) {
            setError('Please enter a valid number');
        } else if (text.trim() === '') {
            setError('This field is required');
        } else {
            setError(undefined);
        }
        setInputValue(text);
        onChange(numericValue);
    };

    return (
        <>
            <TextInput label={label} keyboardType="numeric" value={inputValue} onChangeText={handleInputChange} />
            <HelperText type="error" visible={!!error}>
                {error}
            </HelperText>
        </>
    );
};

const CheckboxInputComponent = ({ label, onChange }: { label: string; onChange: (value: string) => void }) => {
    const [selectedValue, setSelectedValue] = useState<string>('');

    const handleYesButtonPress = () => {
        setSelectedValue('Yes');
        onChange('Yes');
    };

    const handleNoButtonPress = () => {
        setSelectedValue('No');
        onChange('No');
    };

    return (
        <View>
            <Text>{label}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconButton
                    icon="thumb-up"
                    iconColor={selectedValue === 'Yes' ? 'green' : 'grey'}
                    size={20}
                    onPress={handleYesButtonPress}
                />
                <IconButton
                    icon="thumb-down"
                    iconColor={selectedValue === 'No' ? 'red' : 'grey'}
                    size={20}
                    onPress={handleNoButtonPress}
                />
            </View>
        </View>
    );
};

export { TextInputComponent, NumberInputComponent, CheckboxInputComponent };
