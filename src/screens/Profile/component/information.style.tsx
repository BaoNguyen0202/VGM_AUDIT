import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
    },
    headerLabel: {
        fontSize: 24,
        color: '#000',
        textAlign: 'center',
        flex: 1,
        marginLeft: -24,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    editButtons: {
        flexDirection: 'row',
        marginTop: 10,
    },
    containerInput: {
        width: '98%',
        padding: 16,
        justifyContent: 'space-between',
    },
    countInput: {
        width: '100%',
        height: 50,
        marginVertical: 8,
        backgroundColor: '#f4f6f8',
    },
    saveButtonContainer: {
        marginTop: 8,
        paddingHorizontal: 10,
        alignSelf: 'flex-end',
        bottom: 15,
    },
    takeButton: {
        width: '100%',
        height: 40,
        margin: 8,
        borderColor: '#4697e8',
        backgroundColor: '#22c55e',
    },
    modalContent: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        position: 'absolute',
        bottom: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    line: {
        height: 0.7,
        backgroundColor: 'gray',
        marginVertical: 12,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
