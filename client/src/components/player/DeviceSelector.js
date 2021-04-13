import { useEffect, useState, useRef } from "react";
import { fetchCurrentDevice, switchDevice } from "./playerHelper";

const DeviceSelector = (props) => {
  const [currDevice, setCurrDevice] = useState(props.currDevice);
  const [devices, setDevices] = useState(undefined);
  const devicesRef = useRef(devices);
  const handleDevices = (data) => {
    devicesRef.current = data;
    setDevices(data);
  };
  const changeDevice = (event) => {
    setCurrDevice(event.currentTarget.value);
    switchDevice(event.currentTarget.value);
  };
  const fetchDevices = () => {
    fetchCurrentDevice().then((res) => {
      handleDevices(res.devices);
    });
  };
  useEffect(() => {
    setCurrDevice(props.currDevice);
  }, [props.currDevice]);

  useEffect(() => {
    fetchCurrentDevice().then((res) => {
      handleDevices(res.devices);
    });
  }, [currDevice]);

  return (
    <select
      className="max-w-auto text-wrap"
      onChange={changeDevice}
      onClick={fetchDevices}
      value={typeof currDevice !== "undefined" ? currDevice.id : ""}
    >
      {
        /* {typeof devices !== "undefined"
        ? devices.map((device) => {
            <option value={device.id}></option>;
          })
        : ""} */
        typeof devices !== "undefined" ? (
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
  );
};

export default DeviceSelector;
