import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        shadowColor: '#919EAB',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 12,
        marginTop: 8,
        marginBottom: 5,
        backgroundColor: '#FFF',
        borderRadius: 20,
    },
    line: {
        height: 0.7,
        backgroundColor: 'gray',
        marginVertical: 4,
        marginHorizontal: 20,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    flatListContainer: {
        paddingHorizontal: 16,
    },
    linearGradient: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    headerLabel: {
        fontSize: 24,
        color: '#000',
        marginLeft: 8,
        alignSelf: 'center',
    },
    rightContentContainerGreen: {
        backgroundColor: 'rgba(34, 197, 94, 0.08)',
        borderRadius: 10,
        margin: 8,
    },
    rightContentContainerRed: {
        backgroundColor: 'rgba(255, 171, 0, 0.08)',
        borderRadius: 10,
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
});
