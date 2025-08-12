import bcryptjs from "bcryptjs";

const SALT_ROUNDS = 10;

export const getPasswordHash = async (rawPassword: string) => {
  return await bcryptjs.hash(rawPassword, SALT_ROUNDS);
};

export const isPasswordMatch = async (
  rawPassword: string,
  passwordHash: string
) => {
  return await bcryptjs.compare(rawPassword, passwordHash);
};
