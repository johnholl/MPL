import React, { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import { Text, View, TouchableOpacity } from 'react-native';

export default function CameraScreen({route, navigation}) {

    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    let camera = null;

    const snap = async () => {
        if (camera) {
            let photo = await camera.takePictureAsync();
            console.log(photo);
        }
    };

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

return(
    <View style={{flex: 1}}>
        <Camera style={{ flex: 1 }} type={type}
                ref={ref => {
                    camera = ref;
                }}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                }}>
                <TouchableOpacity
                    style={{
                        flex: 0.2,
                        alignSelf: 'flex-end',
                        alignItems: 'center',
                    }}
                    onPress={snap}>
                    <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Take </Text>
                </TouchableOpacity>
            </View>
        </Camera>
    </View>
)

}