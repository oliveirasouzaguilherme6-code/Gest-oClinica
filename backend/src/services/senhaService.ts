import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

export async function criarSenhaHash(senha: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(senha, salt, 64) as Buffer;

  return `${salt}:${hash.toString("hex")}`;
}

export async function verificarSenha(senha: string, senhaHash: string): Promise<boolean> {
  const [salt, hashSalvo] = senhaHash.split(":");

  if (!salt || !hashSalvo) {
    return false;
  }

  const hashSalvoBuffer = Buffer.from(hashSalvo, "hex");

  if (hashSalvoBuffer.length === 0) {
    return false;
  }

  const hashInformado = await scrypt(senha, salt, hashSalvoBuffer.length) as Buffer;

  return timingSafeEqual(hashSalvoBuffer, hashInformado);
}

