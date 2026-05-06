export function toUserSafeDto(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    deviceId: user.deviceId,
    isDeviceVerified: user.isDeviceVerified,
    createdAt: user.createdAt,
  };
}

