import React from 'react';
import { FAB, Portal } from 'react-native-paper';

const Notify = () => {
    const [state, setState] = React.useState({ open: false });

    const onStateChange = ({ open }: any) => setState({ open });

    const { open } = state;
    return (
        <Portal>
            <FAB.Group
                style={{ marginBottom: 80 }}
                open={open}
                visible
                icon={open ? 'calendar-today' : 'plus'}
                actions={[
                    { icon: 'plus', onPress: () => console.log('Pressed add') },
                    {
                        icon: 'star',
                        label: 'Star',
                        onPress: () => console.log('Pressed star'),
                    },
                    {
                        icon: 'email',
                        label: 'Email',
                        onPress: () => console.log('Pressed email'),
                    },
                    {
                        icon: 'bell',
                        label: 'Remind',
                        onPress: () => console.log('Pressed notifications'),
                    },
                ]}
                onStateChange={onStateChange}
                onPress={() => {
                    if (open) {
                    }
                }}
            />
        </Portal>
    );
};

export default Notify;
