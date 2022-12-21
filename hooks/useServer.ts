import { getCurrentPositionAsync, LocationObject, requestForegroundPermissionsAsync } from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";

export type UseServerProps = {
    baseUrl: string;
    client: string
}

export function useServer({ baseUrl, client }: UseServerProps) {
    const [hasConnection, setConnection] = useState(false);
    const [time, setTime] = useState<String>("");
    const [location, setLocation] = useState<LocationObject>();
    const [errorMsg, setErrorMsg] = useState<string>('');

    const getLocation = async () => {
        let { status } = await requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        let location = await getCurrentPositionAsync({});
        setLocation(location);
    };
    //console.log(location);


    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    const socket = io(baseUrl, {
        transports: ["websocket"],
    });

    useEffect(function didMount() {
        socket.io.on("open", () => {
            // either with send()
            socket.emit("data", `client register ${client}`);
            setConnection(true);
        });
        socket.io.on("close", () => setConnection(false));

        socket.on("time-msg", (data) => {
            setTime(new Date(data.time).toISOString());
        });

        return function didUnmount() {
            socket.disconnect();
            socket.removeAllListeners();
        };
    }, []);

    const emitData = () => {
        return socket.emit("data", "location " + JSON.stringify([client, { location }]));
    };


    return { location, hasConnection, time, errorMsg, fn: { emitData, getLocation } };
}
