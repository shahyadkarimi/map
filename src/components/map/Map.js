/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet.offline";
import "leaflet/dist/leaflet.css";
import {
  Table,
  TableBody,
  TableCell,
  Tooltip,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Spinner,
  Chip,
} from "@nextui-org/react";
import { deleteData, getData, postData } from "@/services/API";
import { PointIcon } from "./PointIcon";
import { useForm } from "react-hook-form";
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";

// table columns
const columns = [
  { name: "id", uid: "id" },
  { name: "name", uid: "name" },
  { name: "lat", uid: "lat" },
  { name: "lng", uid: "lng" },
  { name: "frequency", uid: "frequency" },
  { name: "status", uid: "status" },
  { name: "time", uid: "time" },
  { name: "", uid: "action" },
];

const statusColorMap = {
  active: "success",
  disable: "danger",
};

export default function Map({
  addPointModal,
  setAddPointModal,
  showPointList,
  setShowPointList,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      lat: "",
      lng: "",
      frequency: "",
      lat_settings: "",
      lng_settings: "",
      zoom: "",
      search: "",
    },
  });

  const [position, setPosition] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rotateIcon, setRotateIcon] = useState(false);
  const [points, setPoints] = useState([]);
  const [pointsList, setPointsList] = useState([]);
  const [addPointLoading, setAddPointLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pointId, setPointId] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [settings, setSettings] = useState({});
  const [settingsModal, setSettingsModal] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsUpdateLoading, setSettingsUpdateLoading] = useState(false);
  const [pointLabel, setPointLabel] = useState({});
  const [once, setOnce] = useState(true);
  const [map, setMap] = useState();
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchVal = watch("search");

  // get all points
  const getSettings = () => {
    getData("/api/settings", {})
      .then((res) => {
        setSettings(res.data);
        setSettingsLoading(false);

        // action after update
        setSettingsModal(false);
        setSettingsUpdateLoading(false);
      })
      .catch((err) => {
        setSettingsLoading(false);
      });
  };

  // get all points
  const getAllPoints = () => {
    setLoading(true);

    // action after updates(add, edit, change status & delete points)
    setDeleteLoading(false);
    setDeleteModal(false);
    setStatusLoading(false);
    setAddPointModal(false);
    setAddPointLoading(false);
    setEditModal(false);
    setEditLoading(false);

    getData("/api/points", {})
      .then((res) => {
        setPoints(res.data);
        setPointsList(res.data);
        res.data.length > 0 && setPosition([res.data[0].lat, res.data[0].lng]);
        setLoading(false);
        setRotateIcon(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (once) {
      setOnce(false);
      // get all points
      getAllPoints();

      // get settings data
      getSettings();
    }

    if (map) {
      const tileLayerOffline = L.tileLayer.offline(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          subdomains: "abc",
          minZoom: 11,
          maxZoom: 16,
        }
      );

      tileLayerOffline.addTo(map);

      const controlSaveTiles = L.control.savetiles(tileLayerOffline, {
        zoomlevels: [11, 12, 13, 14, 15, 16], // optional zoomlevels to save, default current zoomlevel
        confirm(layer, succescallback) {
          // eslint-disable-next-line no-alert
          if (
            window.confirm(
              `Are you shure you want download ${layer._tilesforSave.length} tiles ?`
            )
          ) {
            succescallback();
          }
        },
        confirmRemoval(layer, successCallback) {
          // eslint-disable-next-line no-alert
          if (window.confirm("Are you shure you want remove all the tiles?")) {
            successCallback();
          }
        },
        saveText: `<div class="w-full h-full flex justify-center items-center">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        </div>`,
        rmText: `<div class="w-full h-full flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </div>`,
      });

      let progress;
      tileLayerOffline.on("savestart", (e) => {
        progress = 0;
        setTotal(e._tilesforSave.length);
      });
      tileLayerOffline.on("savetileend", () => {
        progress += 1;
        setProgress(progress);
      });
    }
  }, [map]);

  // data table custom cell
  const renderCell = (point, columnKey, id) => {
    const cellValue = point[columnKey];

    switch (columnKey) {
      case "id":
        return <span>{id}</span>;
      case "name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm text-gray-700">{point.name}</p>
          </div>
        );

      case "lat":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm text-gray-700">{point.lat}</p>
          </div>
        );
      case "lng":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm text-gray-700">{point.lng}</p>
          </div>
        );
      case "z":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm text-gray-700">{point.frequency}</p>
          </div>
        );

      case "status":
        return (
          <button onClick={() => changeStatusHandler(point._id)}>
            <Chip
              className="capitalize"
              color={statusColorMap[point.status]}
              size="sm"
              variant="flat"
            >
              {statusLoading ? "wait..." : cellValue}
            </Chip>
          </button>
        );

      case "time":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-gray-700">
              {new Date(point.date).toLocaleString()}
            </p>
          </div>
        );
      case "action":
        return (
          <div className="relative flex items-center gap-4">
            <Tooltip content="edit point">
              <button
                onClick={() => setPointEditableData(point)}
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
              >
                <EditIcon />
              </button>
            </Tooltip>

            <Tooltip color="danger" content="delete point">
              <button
                onClick={() => {
                  setDeleteModal(true);
                  setPointId(point._id);
                }}
                className="text-lg text-danger cursor-pointer active:opacity-50"
              >
                <DeleteIcon />
              </button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  // add point handler
  const addPointHandler = (data) => {
    setAddPointLoading(true);

    postData("/api/points", { ...data }).then((res) => {
      // refresh point data table
      getAllPoints();
      reset({ name: "", lat: "", lng: "", frequency: "" });
    });
  };

  // delete single point
  const deletePointHandler = () => {
    setDeleteLoading(true);

    deleteData("/api/points", { id: pointId }).then((res) => {
      // refresh point data table
      getAllPoints();
    });
  };

  // change point status, show in map or not
  const changeStatusHandler = (id) => {
    setStatusLoading(true);

    postData("/api/points/change-status", { id }).then((res) => {
      // refresh point data table
      getAllPoints();
    });
  };

  // set current data in inputes
  const setPointEditableData = (point) => {
    setEditModal(true);

    setPointId(point._id);
    setValue("name", point.name);
    setValue("lat", point.lat);
    setValue("lng", point.lng);
    setValue("frequency", point.frequency);
  };

  // close edit modal & clear inputes
  const closeEditModalHandler = () => {
    setEditModal(false);
    setPointId("");
    reset({ name: "", lat: "", lng: "", frequency: "" });
  };

  // edit point handler
  const editPointHandler = (data) => {
    setEditLoading(true);

    postData("/api/points/update-point", { ...data, id: pointId }).then(
      (res) => {
        // refresh point data table
        getAllPoints();

        // close modal & clear inputes
        closeEditModalHandler();
      }
    );
  };

  //open settings modal & set defualt data in settings input
  const openSettingsModal = () => {
    setSettingsModal(true);
    setValue("lat_settings", settings.lat);
    setValue("lng_settings", settings.lng);
    setValue("zoom", settings.zoom);
  };

  // update settings data handler
  const updateSettingsHandler = (data) => {
    setSettingsUpdateLoading(true);

    postData("/api/settings", {
      lat: data.lat_settings,
      lng: data.lng_settings,
      zoom: data.zoom,
    })
      .then((res) => {
        setSettingsUpdateLoading(false);
        window.location.reload();
        getSettings();
      })
      .catch((err) => {
        setSettingsLoading(false);
      });
  };

  // search points
  const searchPointsHandler = () => {
    const filteredPoints = points.filter((data) =>
      data.name.toLowerCase().includes(searchVal?.toLowerCase())
    );

    setPointsList(filteredPoints);
  };

  return (
    <div className="w-full flex flex-col h-full">
      {/* add new point modal */}
      <Modal
        classNames={{ backdrop: "z-[999]", wrapper: "z-[9999]" }}
        isOpen={addPointModal}
        onClose={() => setAddPointModal(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add new point
              </ModalHeader>
              <ModalBody>
                <div className="w-full flex flex-col gap-4">
                  <Input
                    isRequired
                    label="Name"
                    labelPlacement="outside"
                    placeholder="Enter point name"
                    isInvalid={errors.name ? true : false}
                    errorMessage="name is required"
                    {...register("name", { required: true })}
                  />

                  <Input
                    isRequired
                    label="Lat"
                    labelPlacement="outside"
                    placeholder="Enter point lat"
                    isInvalid={errors.lat ? true : false}
                    errorMessage="lat is required"
                    {...register("lat", { required: true })}
                  />

                  <Input
                    isRequired
                    label="Lng"
                    labelPlacement="outside"
                    placeholder="Enter point lng"
                    isInvalid={errors.lng ? true : false}
                    errorMessage="lng is required"
                    {...register("lng", { required: true })}
                  />

                  <Input
                    isRequired
                    label="Frequency"
                    labelPlacement="outside"
                    placeholder="Enter point frequency"
                    isInvalid={errors.frequency ? true : false}
                    errorMessage="frequency is required"
                    {...register("frequency", { required: true })}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="w-full flex justify-center gap-4">
                  <Button
                    color="danger"
                    variant="light"
                    onClick={() => setAddPointModal(false)}
                  >
                    Close
                  </Button>
                  <Button
                    isLoading={addPointLoading}
                    variant="shadow"
                    className="bg-green-600 text-white shadow-green-200"
                    onClick={handleSubmit(addPointHandler)}
                  >
                    Add point
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* edit point modal */}
      <Modal
        classNames={{ backdrop: "z-[999]", wrapper: "z-[9999]" }}
        isOpen={editModal}
        onClose={closeEditModalHandler}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Point
              </ModalHeader>
              <ModalBody>
                <div className="w-full flex flex-col gap-4">
                  <Input
                    isRequired
                    label="Name"
                    labelPlacement="outside"
                    placeholder="Enter point name"
                    isInvalid={errors.name ? true : false}
                    errorMessage="name is required"
                    {...register("name", { required: true })}
                  />

                  <Input
                    isRequired
                    label="Lat"
                    labelPlacement="outside"
                    placeholder="Enter point lat"
                    isInvalid={errors.lat ? true : false}
                    errorMessage="lat is required"
                    {...register("lat", { required: true })}
                  />

                  <Input
                    isRequired
                    label="Lng"
                    labelPlacement="outside"
                    placeholder="Enter point lng"
                    isInvalid={errors.lng ? true : false}
                    errorMessage="lng is required"
                    {...register("lng", { required: true })}
                  />

                  <Input
                    isRequired
                    label="Frequency"
                    labelPlacement="outside"
                    placeholder="Enter point frequency"
                    isInvalid={errors.frequency ? true : false}
                    errorMessage="frequency is required"
                    {...register("frequency", { required: true })}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="w-full flex justify-center gap-4">
                  <Button
                    color="danger"
                    variant="light"
                    onClick={closeEditModalHandler}
                  >
                    Close
                  </Button>
                  <Button
                    isLoading={editLoading}
                    variant="shadow"
                    className="bg-green-600 text-white shadow-green-200"
                    onClick={handleSubmit(editPointHandler)}
                  >
                    Edit point
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* delete point modal */}
      <Modal
        classNames={{ backdrop: "z-[999]", wrapper: "z-[9999]" }}
        isOpen={deleteModal}
        size="xs"
        onClose={() => setDeleteModal(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete point
              </ModalHeader>
              <ModalBody>
                <div className="w-full flex gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-7 text-red-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                    />
                  </svg>

                  <span>Are you sure you want to delete this point?</span>
                </div>
              </ModalBody>

              <ModalFooter>
                <div className="w-full flex justify-center gap-4">
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => setDeleteModal(false)}
                  >
                    Close
                  </Button>
                  <Button
                    isLoading={deleteLoading}
                    variant="shadow"
                    className="bg-red-600 text-white shadow-red-200"
                    onPress={deletePointHandler}
                  >
                    Delete point
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* settings modal */}
      <Modal
        classNames={{ backdrop: "z-[999]", wrapper: "z-[9999]" }}
        isOpen={settingsModal}
        onClose={() => setSettingsModal(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Settings
              </ModalHeader>
              <ModalBody>
                <div className="w-full flex flex-col gap-4">
                  <Input
                    isRequired
                    label="Lat"
                    labelPlacement="outside"
                    placeholder="Enter point lat"
                    isInvalid={errors.lat_settings ? true : false}
                    errorMessage="lat is required"
                    {...register("lat_settings", { required: true })}
                  />

                  <Input
                    isRequired
                    label="Lng"
                    labelPlacement="outside"
                    placeholder="Enter point lng"
                    isInvalid={errors.lng_settings ? true : false}
                    errorMessage="lng is required"
                    {...register("lng_settings", { required: true })}
                  />

                  <Input
                    isRequired
                    label="Zoom"
                    labelPlacement="outside"
                    placeholder="Enter map zoom"
                    isInvalid={errors.zoom ? true : false}
                    errorMessage="zoom is required"
                    {...register("zoom", { required: true })}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="w-full flex justify-center gap-4">
                  <Button
                    color="danger"
                    variant="light"
                    onClick={() => setSettingsModal(false)}
                  >
                    Close
                  </Button>
                  <Button
                    isLoading={settingsUpdateLoading}
                    variant="shadow"
                    className="bg-green-600 text-white shadow-green-200"
                    onClick={handleSubmit(updateSettingsHandler)}
                  >
                    Save
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* download tiles modal */}
      <Modal
        classNames={{ backdrop: "z-[999]", wrapper: "z-[9999]" }}
        isOpen={progress > 0 && total > 0}
        onClose={progress === total}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Tiles Downloading
              </ModalHeader>
              <ModalBody>
                <div className="w-full text-sm flex justify-between items-center gap-2">
                  <span>Total Tiles : {total}</span>
                  <span>Downloaded Tiles : {progress}</span>

                  {/* <div className="w-full h-5 rounded-full bg-gray-200">
                    <div
                      style={{ width: `${total / progress}%` }}
                      className="text-xs text-white h-full bg-indigo-600 rounded-full flex justify-center items-center"
                    >
                      {progress}%
                    </div>
                  </div> */}
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="w-full flex justify-center gap-4">
                  <Spinner size="" label="Please wait..." />
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* map & markers */}
      <div className={`w-full relative h-full`}>
        {loading || settingsLoading ? (
          <div className="flex justify-center items-center bg-gray-50 w-full h-full">
            <Spinner label="please wait..." />
          </div>
        ) : (
          <MapContainer
            center={
              settings?.lat
                ? [settings.lat, settings.lng]
                : [35.695246913723636, 51.41011318883557]
            }
            zoom={settings?.zoom ? settings?.zoom : 13}
            scrollWheelZoom={true}
            ref={setMap}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {points.length > 0 &&
              points.map(
                (point) =>
                  point.status === "active" && (
                    <Marker
                      key={point._id}
                      icon={PointIcon}
                      position={[point.lat, point.lng]}
                      eventHandlers={{
                        mouseover: (e) => {
                          setPointLabel(point);
                        },

                        mouseout: (e) => {
                          setPointLabel({});
                        },
                      }}
                    >
                      <Popup>
                        <div className="w-full flex flex-col gap-1">
                          <span>name: {point.name}</span>
                          <span>lat: {point.lat}</span>
                          <span>lng: {point.lng}</span>
                          <span>frequency: {point.frequency}</span>
                          <span>status: {point.status}</span>

                          <div className="w-full flex items-center justify-center mt-2 gap-3">
                            <button
                              onClick={() => setPointEditableData(point)}
                              className="text-lg text-default-400 cursor-pointer active:opacity-50"
                            >
                              <EditIcon />
                            </button>

                            <button
                              onClick={() => {
                                setDeleteModal(true);
                                setPointId(point._id);
                              }}
                              className="text-lg text-danger cursor-pointer active:opacity-50"
                            >
                              <DeleteIcon />
                            </button>

                            <button
                              onClick={() => changeStatusHandler(point._id)}
                              className="text-lg text-warning cursor-pointer active:opacity-50"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="size-5"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  )
              )}
          </MapContainer>
        )}

        {pointLabel?.lat && (
          <div
            className={`transition-all duration-300 flex flex-col gap-1 text-xs absolute bg-white p-2 rounded-lg right-4 bottom-4 z-[999]`}
          >
            <span>lat: {pointLabel?.lat}</span>
            <span>lng: {pointLabel?.lng}</span>
          </div>
        )}
      </div>

      <div
        className={`w-full flex flex-col mt-3 ${
          showPointList ? "h-[40%]" : "h-0 overflow-hidden"
        } transition-all duration-300`}
      >
        {/* toolbar */}
        <div className="w-full flex justify-between items-center px-4">
          <div className="w-80">
            <Input
              isRequired
              labelPlacement="outside"
              placeholder="search point..."
              value={searchVal}
              {...register("search")}
              endContent={
                <div className="flex gap-3">
                  {searchVal?.length > 0 && (
                    <button
                      onClick={() => {
                        setPointsList(points);
                        setValue("search", "");
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-5 text-red-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                  <button onClick={searchPointsHandler}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-5 text-indigo-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                  </button>
                </div>
              }
              size="md"
            />
          </div>

          <div className="flex items-center flex-row-reverse gap-4">
            {/* settings */}
            <button
              onClick={openSettingsModal}
              className="bg-red-600 active:scale-95 outline-none transition-all duration-300 w-10 h-10 rounded-xl shadow-lg flex justify-center items-center shadow-red-200 text-white"
            >
              {settingsLoading ? (
                <Spinner size="sm" color="white" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              )}
            </button>

            {/* refresh data */}
            <button
              onClick={() => {
                setRotateIcon(true);

                getAllPoints();
              }}
              className="bg-gray-100 active:scale-95 transition-all duration-300 w-10 h-10 rounded-xl shadow-lg flex justify-center items-center shadow-gray-200 text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={`size-5 ${rotateIcon && "spinner-anim"}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>
        </div>

        <Table
          classNames={{ wrapper: "bg-transparent shadow-none rounded-none" }}
          className="max-h-fit"
          aria-label="Example table with custom cells"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} align="center">
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            loadingContent={<Spinner label="Loading..." />}
            isLoading={loading}
            items={pointsList}
            emptyContent="doesn't exist any point  !"
          >
            {(item) => (
              <TableRow key={item._id}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(
                      item,
                      columnKey,
                      pointsList.findIndex((p) => p._id === item._id) + 1
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
