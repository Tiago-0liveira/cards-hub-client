import { apiCreateUserId, apiGetUserId } from '@/api/general';
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import CreateUserDialog, { FormData } from '@/components/custom/dialogs/create-user-dialog';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';


// Create a Socket Context
type SocketProviderProps = {
	socket: Socket | null,
	rooms: Array<Room>,
	setRooms: React.Dispatch<React.SetStateAction<Room[]>>,
	user: User | null
}
const SocketContext = createContext<SocketProviderProps>({ socket: null, rooms: [], user: null, setRooms: () => { } });

// Create a provider component
export const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [rooms, setRooms] = useState<Array<Room>>([])
	const [user, setUser] = useState<User>(null)
	const [dialogOpen, setDialogOpen] = useState(false);
	const navigate = useNavigate()

	const handleFormData = (formData: FormData) => {
		console.log(formData)
		apiCreateUserId(socket as Socket, formData.username)
	}

	useEffect(() => {
		const socketInstance = io(import.meta.env.VITE_SERVER_ENDPOINT);
		
		socketInstance.on("userUpdate", ({ user }) => {
			setUser(user)
			localStorage.setItem("user", JSON.stringify(user))
		})
		socketInstance.on("error", (err) => {
			console.error(err)// Todo: add errors in toasts
			toast("Error", {
				description: err,
				action: {
					label: "Dismiss",
					onClick: () => {},
				},
			})
		})
		socketInstance.on("rooms", (roomsArg: RoomCollection) => {
			setRooms(Object.values(roomsArg))
		});
		socketInstance.on("roomCreated", (newRoom: Room) => {
			setRooms((prev) => ([...prev, newRoom]));
		})
		socketInstance.on("roomDeleted", (deletedRoomName: string) => {
			setRooms((prev) => prev.filter((val) => val.name !== deletedRoomName));
		})
		socketInstance.on("playerJoinedRoom", (arg: {rooms: RoomCollection}) => {
			console.log("playerJoinedRoom", arg.rooms)
			setRooms(Object.values(arg.rooms))
		})
		socketInstance.on("playerLeftRoom", (arg: { rooms: RoomCollection }) => {
			console.log("playerLeftRoom", arg.rooms)
			setRooms(Object.values(arg.rooms))
		})
		
		setSocket(socketInstance);

		const localUser = localStorage.getItem("user")
		if (localUser !== null) {
			apiGetUserId(socketInstance, (JSON.parse(localUser) as User).id)
		} else {
			setDialogOpen(true)
		}

		return () => {
			socketInstance.off("userUpdate")
			socketInstance.off("error")
			socketInstance.off("rooms")
			socketInstance.off("roomCreated")
			socketInstance.off("roomDeleted")
			socketInstance.off("playerJoinedRoom")
			socketInstance.off("playerLeftRoom")
			socketInstance.off("enterRoom")
			socketInstance.off("goToLobby")
			socketInstance.off("disconnect")
			socketInstance.disconnect();
		};
	}, []);

	useEffect(() => {
		if (!socket || !socket.connected) {
			navigate("/")
			setRooms([])
			return
		};
		socket.on("enterRoom", (arg: { room: Room }) => {
			navigate(`/room/${arg.room.type}/${arg.room.id}`)
		})
		socket.on("goToLobby", () => {
			navigate("/")
		})
		socket.on("disconnect", () => {
			navigate("/")
		})
		return () => {
			socket.off("enterRoom");
			socket.off("goToLobby");
			socket.off("disconnect");
		}
	}, [socket, socket?.connected, navigate])

	return (
		<SocketContext.Provider value={{ socket, rooms, setRooms, user }}>
			<Toaster />
			<CreateUserDialog onSubmit={handleFormData} setOpen={setDialogOpen} open={dialogOpen} user={user} socket={socket} />
			{children}
		</SocketContext.Provider>
	);
};

// Hook to use the socket in any component
export const useSocketContext = () => {
	const socket = useContext(SocketContext);
	if (!socket) {
		throw new Error("useSocket must be used within a SocketProvider");
	}
	return socket;
};
