import { Button, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { useEffect } from "react";
import { tintColorLight } from "../constants/Colors";
import { useServer } from '../hooks/useServer';

export default function LocationScreen() {
  const baseUrl = "http://192.168.100.5:4000";
  const { location, time, errorMsg, hasConnection, fn } = useServer({
    baseUrl,
    client: "Car1",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      fn.getLocation();
      fn.emitData();
    }, 5000);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <View style={styles.container}>
      {!hasConnection && (
        <>
          <Text style={styles.title}>Connecting to {baseUrl}...</Text>
          <Text style={styles.text}>
            Make sure the backend is started and reachable
          </Text>
        </>
      )}

      {hasConnection && (
        <View
          style={[
            styles.center,
            {
              flex: 1,
              flexDirection: "column",
              padding: 20,
            },
          ]}
        >
          <Text style={[styles.title, { fontWeight: "bold" }]}>
            Server time
          </Text>
          <Text style={styles.text}>{time}</Text>

          <Button
            color={tintColorLight}
            title="Send location"
            onPress={() => fn.emitData()}
          ></Button>
        </View>
      )}

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  text: {
    fontSize: 20,
  },
  hSeparator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  vSeparator: {
    marginHorizontal: 30,
    width: 2,
    height: "80%",
  },
  flex: {
    display: "flex",
  },
  center: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
});
