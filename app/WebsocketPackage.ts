
export enum PackageTypes {
    Notification = 'notification',
    Message = 'message',
    Echo = 'echo',
}

interface WSPackage {
    type: PackageTypes,
    id: string,
    payload: unknown
}

export function createPackage( type: PackageTypes, payload: unknown ) : WSPackage {
    return {
        type,
        id: (+new Date()).toString(16),
        payload,
    }
}