import { useState, useEffect } from "react";

import {
  Authenticator,
  Button,
  Text,
  TextField,
  Heading,
  Flex,
  View,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import NavBar from './components/NavBar';
/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

export default function App() {

  const getCurrentDateTime = () => {
    const now = new Date();
    // Format: YYYY-MM-DDThh:mm
    return now.toISOString().slice(0, 16);
  };

  const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());

  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    client.models.Sensor.observeQuery().subscribe({
      next: (data) => setSensors([...data.items]),
    });
  }, []);

  async function createSensor(event) {
    event.preventDefault();
    const form = new FormData(event.target);

    const installDateTime = new Date(form.get("install_datetime")).toISOString();

    console.log('Form data being submitted:', {
      form: Object.fromEntries(form),
      install_datetime: installDateTime});

    await client.models.Sensor.create({
      sensor_id: form.get("sensor_id"),
      sensor_model: form.get("sensor_model"),
      wireless_device_id: form.get("wireless_device_id"),
      wireless_device_eui: form.get("wireless_device_eui"),
      location_id: form.get("location_id"),
      install_datetime: installDateTime
    });

    event.target.reset();
  }

  async function deleteSensor({ id }) {
    const toBeDeletedSensor = {
      id,
    };

    await client.models.Sensor.delete(toBeDeletedSensor);
  }

  return (
    <Authenticator>
      {({ signOut }) => (
        <>
        <NavBar signOut={signOut} />
        <Flex
          className="App"
          justifyContent="center"
          alignItems="center"
          direction="column"
          width="70%"
          margin="0 auto"
        >
          <Heading level={1}>Sensor Manager</Heading>
          <View as="form" margin="3rem 0" onSubmit={createSensor}>
            <Flex
              direction="column"
              justifyContent="center"
              gap="2rem"
              padding="2rem"
            >
              <TextField
                name="sensor_id"
                placeholder="Sensor ID"
                label="Sensor ID"
                type="string"
                labelHidden
                variation="quiet"
                required
              />
              <TextField
                name="sensor_model"
                placeholder="Sensor Model Name"
                label="Sensor Model Name"
                type="string"
                labelHidden
                variation="quiet"
                required
              />
              <TextField
                name="wireless_device_id"
                placeholder="Wireless Device ID"
                label="Wireless Device ID"
                type="string"
                labelHidden
                variation="quiet"
                required
              />
              <TextField
                name="wireless_device_eui"
                placeholder="Wireless Device EUI"
                label="Wireless Device EUI"
                type="string"
                labelHidden
                variation="quiet"
                required
              />
              <TextField
                name="location_id"
                placeholder="Location ID"
                label="Location ID Amount"
                type="string"
                labelHidden
                variation="quiet"
                required
              />
              <TextField
                name="install_datetime"
                placeholder="Date and time of Install"
                label="Installation Datetime"
                type="datetime-local"
                step="1800"
                value={currentDateTime}
                onChange={(e) => setCurrentDateTime(e.target.value)}
                labelHidden
                variation="quiet"
                required
              />
              <Button type="submit" variation="primary">
                Create Sensor
              </Button>
            </Flex>
          </View>
          <Divider />
          <Heading level={2}>Sensors</Heading>
          <Grid
            margin="3rem 0"
            autoFlow="column"
            justifyContent="center"
            gap="2rem"
            alignContent="center"
          >
            {sensors.map((sensor) => (
              <Flex
                key={sensor.id || sensor.name}
                direction="column"
                justifyContent="center"
                alignItems="center"
                gap="2rem"
                border="1px solid #ccc"
                padding="2rem"
                borderRadius="5%"
                className="box"
              >
                <View>
                  <Heading level="3">{sensor.sensor_id}</Heading>
                </View>
                <Text fontStyle="italic">{sensor.sensor_model}</Text>
                <Text fontStyle="italic">{sensor.wireless_device_id}</Text>
                <Text fontStyle="italic">{sensor.wireless_device_eui}</Text>
                <Text fontStyle="italic">{sensor.location_id}</Text>
                <Text fontStyle="italic">{sensor.install_datetime}</Text>
                <Button
                  variation="destructive"
                  onClick={() => deleteSensor(sensor)}
                >
                  Delete sensor
                </Button>
              </Flex>
            ))}
          </Grid>
        </Flex>
        </>
      )}
    </Authenticator>
  );
}