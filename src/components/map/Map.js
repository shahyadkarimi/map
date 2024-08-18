import React, { useCallback } from "react";
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
} from "@nextui-org/react";

export default function Map() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const position = [51.505, -0.09];

  const columns = [
    { name: "ID", uid: "id" },
    { name: "x", uid: "x" },
    { name: "y", uid: "y" },
    { name: "z", uid: "z" },
    { name: "time", uid: "time" },
    { name: "", uid: "action" },
  ];

  const users = [
    {
      id: 1,
      name: "Tony Reichert",
      role: "359",
      team: "261",
      status: "12:40:12",
      age: "127",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      email: "tony.reichert@example.com",
    },
    {
      id: 2,
      name: "Zoey Lang",
      role: "785",
      team: "103",
      status: "12:40:12",
      age: "312",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      email: "zoey.lang@example.com",
    },
    {
      id: 3,
      name: "Jane Fisher",
      role: "453",
      team: "452",
      status: "12:40:12",
      age: "736",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
      email: "jane.fisher@example.com",
    },
    {
      id: 4,
      name: "William Howard",
      role: "789",
      team: "238",
      status: "12:40:12",
      age: "123",
      avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
      email: "william.howard@example.com",
    },
    {
      id: 5,
      name: "Kristen Copper",
      role: "456",
      team: "123",
      status: "12:40:12",
      age: "457",
      avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
      email: "kristen.cooper@example.com",
    },
  ];

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "id":
        return <span>{user.id}</span>;
      case "x":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-gray-700">
              {user.team}
            </p>
          </div>
        );
      case "y":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-gray-700">
              {user.role}
            </p>
          </div>
        );
      case "z":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-gray-700">
              {user.age}
            </p>
          </div>
        );

      case "time":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-gray-700">
              {user.status}
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
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
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
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

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
                    label="Frequency"
                    labelPlacement="outside"
                    placeholder="Enter point frequency"
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
                    label="Status"
                    labelPlacement="outside"
                    placeholder="Enter point status"
                    // className="max-w-xs"
                  />

                  <Input
                    isRequired
                    label="Point name"
                    labelPlacement="outside"
                    placeholder="Enter point name"
                    // className="max-w-xs"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="w-full flex justify-center gap-4">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button variant="shadow" className="bg-green-600 text-white shadow-green-200" onPress={onClose}>
                    Add point
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="w-full relative h-[60%]">
        <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}></Marker>
        </MapContainer>
      </div>

      <div className="w-full flex flex-col mt-3 max-h-[40%]">
        <div className="w-full px-4">
          <Button
            onPress={onOpen}
            className="bg-indigo-600 shadow-indigo-200 text-white"
            variant="shadow"
          >
            + New Point
          </Button>
        </div>

        <Table
          classNames={{ wrapper: "bg-transparent shadow-none rounded-none" }}
          className="max-h-fit"
          aria-label="Example table with custom cells"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                // align={column.uid === "actions" ? "center" : "start"}
                align="center"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={users}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
