import { InteractionManager, Keyboard } from 'react-native';
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
export const Base64 = {
    btoa: (input: string = '') => {
        let str = input;
        let output = '';

        for (
            let block = 0, charCode, i = 0, map = chars;
            str.charAt(i | 0) || ((map = '='), i % 1);
            output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
        ) {
            charCode = str.charCodeAt((i += 3 / 4));

            if (charCode > 0xff) {
                throw new Error(
                    "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.",
                );
            }

            block = (block << 8) | charCode;
        }

        return output;
    },

    atob: (input: string = '') => {
        let str = input.replace(/[=]+$/, '');
        let output = '';

        if (str.length % 4 == 1) {
            throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
        }
        for (
            let bc = 0, bs = 0, buffer, i = 0;
            (buffer = str.charAt(i++));
            ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
                ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
                : 0
        ) {
            buffer = chars.indexOf(buffer);
        }

        return output;
    },
};
export const Auth_header = (api_key: string, api_secret: string) => {
    return {
        Authorization: `Basic ${Base64.btoa(api_key + ':' + api_secret)}`,
        'content-type': 'application/json',
    };
};
export const Header_Image = (api_key: string, api_secret: string) => {
    return {
        Authorization: `Basic ${Base64.btoa(api_key + ':' + api_secret)}`,
        'Content-Type': 'multipart/form-data',
    };
};
export const dismissKeyboard = async (func: () => void) => {
    await Keyboard.dismiss();
    await sleep(100);
    InteractionManager.runAfterInteractions(() => {
        if (typeof func === 'function') {
            func();
        }
    });
};
export const renderRandomDocName = (prefix: string) => {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 10) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return `${prefix}-${result}`;
};
