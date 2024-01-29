import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFF',
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    containerIfU: {
        marginLeft: 16,
    },
    greetingText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    userName: {
        fontSize: 16,
        color: '#000',
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        borderRadius: 20,
        paddingVertical: 28,
    },
    otherIconsContainer: {
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    iconText: {
        fontSize: 14,
        color: '#000',
        marginTop: 8,
    },
    BorderIcon: {
        borderWidth: 0.7,
        borderRadius: 8,
        padding: 8,
        borderColor: '#a6a6a6',
    },
    shadow: {
        shadowColor: '#919EAB',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 12,
    } as ViewStyle,
    containerTimekeep: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#FFF',
    } as ViewStyle,
    flex: {
        flexDirection: 'row',
        alignItems: 'center',
    } as ViewStyle,
    btnTimekeep: {
        width: 48,
        height: 48,
        backgroundColor: '#12a364',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    } as ViewStyle,
    iconBtnTk: {
        width: 32,
        height: 32,
        tintColor: '#FFF',
    },
    flexSpace: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    } as ViewStyle,
    tilteSection: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: '500',
        color: '#919EAB',
        marginVertical: 8,
    } as TextStyle,
    containProgressView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    } as ViewStyle,
    itemWorkSheet: {
        shadowColor: '#919EAB',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 12,
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 16,
        marginBottom: 16,
    } as ViewStyle,
    worksheetLb: {
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 18,
        color: '#212B36',
    } as TextStyle,
    worksheetBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingVertical: 4,
    } as ViewStyle,
    worksheetDt: {
        fontSize: 18,
        lineHeight: 27,
        fontWeight: '500',
        marginLeft: 8,
    } as TextStyle,
    containerCheckin: {
        shadowColor: '#919EAB',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 12,
        marginBottom: 8,
        flex: 1,
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#FFF',
    } as ViewStyle,
    textProcess: {
        fontSize: 24,
        lineHeight: 28,
        fontWeight: '700',
        color: '#212B36',
    } as TextStyle,
    textProcessDesc: {
        fontSize: 12,
        lineHeight: 21,
        fontWeight: '400',
        color: 'rgba(0, 167, 111, 1)',
    } as TextStyle,
    checkinDesc: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: '500',
        marginTop: 12,
        color: '#637381',
    } as TextStyle,
    rowContainer: {
        flexDirection: 'row',
        width: '100%',
    },
    map: {
        width: '100%',
        height: 360,
        borderRadius: 20,
        // backgroundColor:theme.colors.bg_default,
        // borderWidth:1
        // backgroundColor:'red',
        alignContent: 'center',
        alignItems: 'center',
        // marginHorizontal:16

        // ...StyleSheet.absoluteFill
    } as ViewStyle,
});
