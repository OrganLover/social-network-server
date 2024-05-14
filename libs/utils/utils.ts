import fs from 'fs/promises';
import util from 'util';
import { pipeline } from 'stream';

export const parseCookie = (cookieString: string) => {
  const cookies: Record<string, string> = {};

  const replacedSpace = cookieString.replace(/\s/g, '');
  for (const record of replacedSpace.split(';')) {
    const [key, value] = record.split('=');
    cookies[key] = value;
  }

  return cookies;
};

export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const isPathExists = async (path: string | URL) => {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
};

export const checkDirectory = async (
  directory: string | URL,
  needCreateDirectory: boolean = false,
): Promise<boolean> => {
  try {
    let directoryExists = await isPathExists(directory);
    if (!directoryExists && needCreateDirectory) {
      await fs.mkdir(directory, { recursive: true });
      directoryExists = true;
    }

    return directoryExists;
  } catch {
    return false;
  }
};

export const generateRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

export const jsonParse = (input: string) => {
  try {
    return JSON.parse(input);
  } catch (error) {
    return false;
  }
};

/**
 * Отправка сообщения родительскому процессу
 * @param msg сообщение для отправки
 * @returns
 * Не вызывать в родительском процессе
 */
export const sendMessageToParentProcess = <T>(msg: T): Promise<void> => {
  return new Promise((resolve, reject) => {
    process.send?.(msg, (err: Error | null) => {
      if (err) {
        return reject(err);
      } else {
        return resolve();
      }
    });
  });
};

export const pump = util.promisify(pipeline);

export function hsbToRgb(hsb: { h: number; s: number; b: number }) {
  let h = Math.round(hsb.h);
  const rgb = {} as { r: number; g: number; b: number };
  const s = Math.round((hsb.s * 255) / 100);
  const v = Math.round((hsb.b * 255) / 100);

  if (s === 0) {
    rgb.r = rgb.g = rgb.b = v;
  } else {
    const t1 = v;
    const t2 = ((255 - s) * v) / 255;
    const t3 = ((t1 - t2) * (h % 60)) / 60;

    if (h === 360) h = 0;

    if (h < 60) {
      rgb.r = t1;
      rgb.b = t2;
      rgb.g = t2 + t3;
    } else if (h < 120) {
      rgb.g = t1;
      rgb.b = t2;
      rgb.r = t1 - t3;
    } else if (h < 180) {
      rgb.g = t1;
      rgb.r = t2;
      rgb.b = t2 + t3;
    } else if (h < 240) {
      rgb.b = t1;
      rgb.r = t2;
      rgb.g = t1 - t3;
    } else if (h < 300) {
      rgb.b = t1;
      rgb.g = t2;
      rgb.r = t2 + t3;
    } else if (h < 360) {
      rgb.r = t1;
      rgb.g = t2;
      rgb.b = t1 - t3;
    } else {
      rgb.r = 0;
      rgb.g = 0;
      rgb.b = 0;
    }
  }

  return {
    r: Math.round(rgb.r),
    g: Math.round(rgb.g),
    b: Math.round(rgb.b),
  };
}
