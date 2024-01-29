import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatListContainer: {
        paddingHorizontal: 16,
    },
    linearGradient: {
        flex: 1,
    },
    card: {
        marginTop: 8,
        marginBottom: 5,
        backgroundColor: '#FFF',
        borderRadius: 20,
    },
    retryContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    retryText: {
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#1abc9c',
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
    line: {
        height: 0.7,
        backgroundColor: 'gray',
        marginVertical: 4,
        marginHorizontal: 20,
    },
    rightContentContainer: {
        backgroundColor: '#a2ded0',
        borderRadius: 8,
        margin: 8,
    },
    iconTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: '10%',
    },
    iconButton: {
        marginLeft: -5,
    },
    checkout: {
        fontSize: 24,
        color: '#881111',
        textAlign: 'center',
        flex: 1,
        fontWeight: '500',
    },
    checkoutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderColor: '#881111',
        borderWidth: 1,
        backgroundColor: '#F4F6F8',
        borderTopStartRadius: 20,
        borderTopRightRadius: 20,
        borderBottomStartRadius: 20,
        borderBottomRightRadius: 20,
    },
});
