import React from 'react';
import { Modal, View, Text } from 'react-native';
import { Button, Card, Checkbox, IconButton, TextInput } from 'react-native-paper';
const TextInputComponent = ({ label, onChange }: { label: string; onChange: (value: string) => void }) => {
    return <TextInput label={label} onChangeText={(text) => onChange(text)} />;
};

const NumberInputComponent = ({ label, onChange }: { label: string; onChange: (value: number) => void }) => {
    return <TextInput label={label} keyboardType="numeric" onChangeText={(text) => onChange(Number(text))} />;
};

const CheckboxInputComponent = ({ label, onChange }: { label: string; onChange: (value: string) => void }) => {
    const [selectedValue, setSelectedValue] = React.useState<string>('');
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
