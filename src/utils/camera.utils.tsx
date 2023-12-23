import { flingGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/FlingGestureHandler';
import { ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';

export const openImagePickerCamera = (callBack: (uri: string) => void) => {
    const options: ImageLibraryOptions = {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 2000,
        maxWidth: 2000,
        // quality: 1,
        presentationStyle: 'fullScreen',
    };

    launchCamera(options, (response) => {
        if (response.didCancel) {
            console.log('User cancelled camera picker');
        } else {
            // @ts-ignore
            if (response.error) {
                // @ts-ignore
                console.log('camera picker error: ', response.error);
            } else {
                // @ts-ignore
                const imageUri = response.uri || (response.assets && response.assets[0]?.uri) || '';
                callBack(imageUri);
            }
        }
    }).finally();
};

export const openImagePicker = (callBack: () => void, isUri?: boolean) => {
    const options: ImageLibraryOptions = {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 2000,
        maxWidth: 2000,
        presentationStyle: 'fullScreen',
    };

    launchImageLibrary(options, (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else {
            // @ts-ignore
            if (response.error) {
                // @ts-ignore
                console.log('Image picker error: ', response.error);
            } else {
                callBack(
                    // @ts-ignore
                    isUri ? response.assets?.[0]?.base64 : response.assets?.[0]?.uri,
                );
            }
        }
    }).finally();
};
