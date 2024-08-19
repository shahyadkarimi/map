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

// table columns
const columns = [
  { name: "ID", uid: "id" },
  { name: "x", uid: "x" },
  { name: "y", uid: "y" },
  { name: "z", uid: "z" },
  { name: "status", uid: "status" },
  { name: "time", uid: "time" },
  { name: "", uid: "action" },
];

const statusColorMap = {
  active: "success",
  disable: "danger",
};

export default function Map() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [position, setPosition] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rotateIcon, setRotateIcon] = useState(false);
  const [points, setPoints] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pointId, setPointId] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

  // get all points
  const getAllPoints = () => {
    setLoading(true);
    setDeleteLoading(false);
    setDeleteModal(false);
    setStatusLoading(false);

    getData("/api/map", {})
      .then((res) => {
        setPoints(res.data);
        setPosition([res.data[0].lat, res.data[0].lng]);
        setLoading(false);
        setRotateIcon(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllPoints();
  }, []);

  const renderCell = useCallback((point, columnKey, id) => {
    const cellValue = point[columnKey];

    switch (columnKey) {
      case "id":
        return <span>{id}</span>;
      case "x":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-gray-700">
              {point.lat}
            </p>
          </div>
        );
      case "y":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-gray-700">
              {point.lng}
            </p>
          </div>
        );
      case "z":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-gray-700">z</p>
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
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-gray-700">
              {new Date(point.date).toLocaleString()}
            </p>
          </div>
        );
      case "action":
        return (
          <div className="relative flex items-center gap-4">
            <Tooltip content="edit point">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
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
              </span>
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
  }, []);

  // delete single point
  const deletePointHandler = () => {
    setDeleteLoading(true);

    deleteData("/api/map", { id: pointId }).then((res) => {
      getAllPoints();
    });
  };

  const changeStatusHandler = (id) => {
    setStatusLoading(true);

    postData("/api/map/change-status", { id }).then((res) => {
      getAllPoints();
    });
  };

  return (
    <div className="w-full flex flex-col h-full">
      {/* add new point modal */}
      <Modal
        classNames={{ backdrop: "z-[999]", wrapper: "z-[9999]" }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
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
                    label="Point name"
                    labelPlacement="outside"
                    placeholder="Enter point name"
                    // className="max-w-xs"
                  />

                  <Input
                    isRequired
                    label="Lat"
                    labelPlacement="outside"
                    placeholder="Enter point lat"
                    // className="max-w-xs"
                  />

                  <Input
                    isRequired
                    label="Lng"
                    labelPlacement="outside"
                    placeholder="Enter point lng"
                    // className="max-w-xs"
                  />

                  <Input
                    isRequired
                    label="Frequency"
                    labelPlacement="outside"
                    placeholder="Enter point frequency"
                    // className="max-w-xs"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="w-full flex justify-center gap-4">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    variant="shadow"
                    className="bg-green-600 text-white shadow-green-200"
                    onPress={onClose}
                  >
                    Add point
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
          <MapContainer center={[35.694523130867424,51.40922197948697]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {points.length > 0 &&
              points.map(
                (point) =>
                  point.status === "active" && (
                    <Marker
                      icon={PointIcon}
                      position={[point.lat, point.lng]}
                    ></Marker>
                  )
              )}
          </MapContainer>
        )}
      </div>

      <div className="w-full flex flex-col mt-3 max-h-[40%]">
        <div className="w-full flex items-center gap-4 px-4">
          <Button
            onPress={onOpen}
            className="bg-indigo-600 shadow-indigo-200 text-white"
            variant="shadow"
          >
            + New Point
          </Button>

          <button
            onClick={() => {
              getAllPoints();
              setRotateIcon(true);
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
