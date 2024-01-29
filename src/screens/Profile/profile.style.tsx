import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
    },
    containView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 30,
    },
    containLabel: {
        marginLeft: 12,
    },
    containSecondView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    textPrimary: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    textSecondary: {
        fontSize: 14,
        color: 'gray',
        fontWeight: '400',
    },
    icon: {
        backgroundColor: 'transparent',
        marginRight: 4,
    },
    retryContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    retryText: {
        fontSize: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    headerLabel: {
        fontSize: 24,
        color: '#000',
        textAlign: 'center',
        flex: 1,
        marginLeft: -24,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatListContainer: {
        paddingHorizontal: 16,
    },
    card: {
        marginTop: 8,
        marginBottom: 5,
        backgroundColor: '#FFF',
        borderRadius: 20,
    },
    row: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 10,
        alignItems: 'center',
    },
});
