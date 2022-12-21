
import {
    getCurrentPositionAsync,
    LocationObject,
    requestForegroundPermissionsAsync,
} from 'expo-location';
import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function Location({
    navigation,
}: RootTabScreenProps<'LocationTab'>) {
    const [location, setLocation] = useState<LocationObject>();
    const [errorMsg, setErrorMsg] = useState<string>('');

    useEffect(() => {
        (async () => {
            let { status } = await requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <View style={styles.container}>
            <View style={[styles.container, { paddingHorizontal: 30 }]}>
                <View style={[styles.center, { marginBottom: 20 }]}>
                    <Text style={styles.title}>Accuracy</Text>
                    <Text style={styles.text}>
                        {location?.coords.accuracy?.toPrecision(3)}m
                    </Text>
                </View>
                <View style={[styles.row, styles.center]}>
                    <View style={[styles.center]}>
                        <Text style={styles.title}>Latitude</Text>
                        <Text style={styles.text}>
                            {location?.coords.latitude.toPrecision(6)}
                        </Text>
                    </View>
                    <View
                        style={styles.vSeparator}
                        lightColor="#eee"
                        darkColor="rgba(255,255,255,0.4)"
                    />
                    <View style={[styles.center]}>
                        <Text style={styles.title}>Longitude</Text>
                        <Text style={styles.text}>
                            {location?.coords.longitude.toPrecision(6)}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 20,
    },
    hSeparator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    vSeparator: {
        marginHorizontal: 30,
        width: 2,
        height: '80%',
    },
    flex: {
        display: 'flex',
    },
    center: {
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
    },
});
