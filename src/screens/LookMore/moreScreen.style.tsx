import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    mainLayout: {
        flex: 1,
        paddingHorizontal: 16,
        marginVertical: 20,
    },
    walletContainer: {
        shadowColor: '#919EAB',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        backgroundColor: '#FFF',
        borderRadius: 20,
        flexDirection: 'column',
    },
    otherIconsContainer: {
        alignItems: 'center',
        paddingHorizontal: 26,
        paddingVertical: 8,
    },
    iconText: {
        fontSize: 14,
        color: 'gray',
        marginTop: 8,
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
    rowContainer: {
        flexDirection: 'row',
        width: '100%',
    },
    BorderIcon: {
        borderWidth: 0.7,
        borderRadius: 8,
        padding: 8,
        borderColor: '#a6a6a6',
    },
});
