import React, { useCallback, useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
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
  useDisclosure,
  Input,
  Spinner,
  Chip,
} from "@nextui-org/react";
import { deleteData, getData, postData } from "@/services/API";
import { PointIcon } from "./PointIcon";
import { useForm } from "react-hook-form";

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

export default function Map() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      lat: "",
      lng: "",
      frequency: "",
    },
  });

  const [position, setPosition] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rotateIcon, setRotateIcon] = useState(false);
  const [points, setPoints] = useState([]);
  const [addPointModal, setAddPointModal] = useState(false);
  const [addPointLoading, setAddPointLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pointId, setPointId] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // get all points
  const getAllPoints = () => {
    setLoading(true);
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
    getAllPoints();
  }, []);

  const renderCell = (point, columnKey, id) => {
    const cellValue = point[columnKey];

    switch (columnKey) {
      case "id":
        return <span>{id}</span>;
      case "name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-gray-700">
              {point.name}
            </p>
          </div>
        );

      case "lat":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-gray-700">
              {point.lat}
            </p>
          </div>
        );
      case "lng":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-gray-700">
              {point.lng}
            </p>
          </div>
        );
      case "z":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-gray-700">
              {point.frequency}
            </p>
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
                <svg
                  aria-hidden="true"
                  fill="none"
                  focusable="false"
                  height="1em"
                  role="presentation"
                  viewBox="0 0 20 20"
                  width="1em"
                >
                  <path
                    d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit={10}
                    strokeWidth={1.5}
                  />
                  <path
                    d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit={10}
                    strokeWidth={1.5}
                  />
                  <path
                    d="M2.5 18.3333H17.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit={10}
                    strokeWidth={1.5}
                  />
                </svg>
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
                <svg
                  aria-hidden="true"
                  fill="none"
                  focusable="false"
                  height="1em"
                  role="presentation"
                  viewBox="0 0 20 20"
                  width="1em"
                >
                  <path
                    d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                  <path
                    d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                  <path
                    d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                  <path
                    d="M8.60834 13.75H11.3833"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                  <path
                    d="M7.91669 10.4167H12.0834"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                </svg>
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
      }
    );
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

      <div className="w-full relative h-[60%]">
        {loading ? (
          <div className="flex justify-center items-center bg-gray-50 w-full h-full">
            <Spinner label="please wait..." />
          </div>
        ) : (
          <MapContainer
            center={[35.694523130867424, 51.40922197948697]}
            zoom={13}
            scrollWheelZoom={false}
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
                    ></Marker>
                  )
              )}
          </MapContainer>
        )}
      </div>

      <div className="w-full flex flex-col mt-3 max-h-[40%]">
        <div className="w-full flex items-center justify-between px-4">
          {/* add new point & refresh data */}
          <div className="w-full flex items-center gap-4">
            <Button
              onPress={() => setAddPointModal(true)}
              className="bg-indigo-600 shadow-indigo-200 text-white"
              variant="shadow"
            >
              + New Point
            </Button>

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

          {/* settings */}
          <button className="bg-red-600 active:scale-95 transition-all duration-300 w-10 h-10 rounded-xl shadow-lg flex justify-center items-center shadow-red-200 text-white">
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
          </button>
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
            items={points}
            emptyContent="doesn't exist any point  !"
          >
            {(item) => (
              <TableRow key={item._id}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(
                      item,
                      columnKey,
                      points.findIndex((p) => p._id === item._id) + 1
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
