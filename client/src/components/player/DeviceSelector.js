import { useEffect, useState, useRef } from "react";
import { fetchDevices, switchDevice } from "./playerHelper";

const DeviceSelector = (props) => {
  const [currDevice, setCurrDevice] = useState("");
  const [devices, setDevices] = useState("");
  const devicePoll = useRef();
  const devicesRef = useRef(devices);
  const handleDevices = (data) => {
    devicesRef.current = data;
    setDevices(data);
  };
  const changeDevice = (event) => {
    setCurrDevice(event.currentTarget.value);
    switchDevice(event.currentTarget.value);
  };
  const getDevices = () => {
    fetchDevices().then((res) => {
      handleDevices(res.devices);
    });
  };
  useEffect(() => {
    console.log(props.currDevice);
    setCurrDevice(props.currDevice);
    fetchDevices().then((res) => {
      handleDevices(res.devices);
    });
  }, [props.currDevice]);

  useEffect(() => {
    // devicePoll.current = setInterval(() => {
    //   fetchDevices().then((res) => {
    //     handleDevices(res.devices);
    //   });
    // }, 2000);

    return clearInterval(devicePoll.current);
  }, []);

  return devices !== "" ? (
    <select
      className="max-w-auto text-wrap"
      onChange={changeDevice}
      onClick={getDevices}
      value={currDevice.id}
    >
      {
        /* {typeof devices !== "undefined"
        ? devices.map((device) => {
            <option value={device.id}></option>;
          })
        : ""} */
        devices !== "" ? (
          Object.entries(devices).map((device, index) => (
            <option
              className="text-center"
              key={index}
              value={device[1].id}
              //selected={device[1].is_active}
            >
              {device[1].name}
            </option>
          ))
        ) : (
          <option value="none">no device selected</option>
        )
      }
    </select>
  ) : (
    <div></div>
  );
};

export default DeviceSelector;
