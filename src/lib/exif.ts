/**
 * Pure TypeScript Client & Server EXIF GPS Metadata Extractor for Watershed360
 * Parses standard JPEG APP1 / TIFF header tags without external dependencies.
 */

export interface ExifExtractionResult {
  hasGps: boolean;
  latitude?: number;
  longitude?: number;
  altitudeMeters?: number;
  bearingDeg?: number;
  compassDirection?: string;
  dateTime?: string;
  cameraMake?: string;
  cameraModel?: string;
  rawExifFound: boolean;
  statusMessage: string;
}

export async function extractExifFromBlob(blob: Blob): Promise<ExifExtractionResult> {
  try {
    const buffer = await blob.arrayBuffer();
    return parseExifFromBuffer(buffer);
  } catch (err: any) {
    return {
      hasGps: false,
      rawExifFound: false,
      statusMessage: `EXIF extraction error: ${err?.message || 'Unsupported format'}`
    };
  }
}

export function parseExifFromBuffer(buffer: ArrayBuffer): ExifExtractionResult {
  const view = new DataView(buffer);
  
  // Verify JPEG SOI marker (0xFFD8)
  if (view.byteLength < 4 || view.getUint16(0, false) !== 0xFFD8) {
    return {
      hasGps: false,
      rawExifFound: false,
      statusMessage: 'Non-JPEG or raw stream: EXIF marker not present. Manual coordinate assignment required.'
    };
  }

  let offset = 2;
  const length = view.byteLength;

  while (offset < length) {
    if (offset + 2 > length) break;
    const marker = view.getUint16(offset, false);
    offset += 2;

    // Check for APP1 Marker (0xFFE1) which contains EXIF
    if (marker === 0xFFE1) {
      if (offset + 2 > length) break;
      const app1Length = view.getUint16(offset, false);
      const app1Offset = offset + 2;

      // Check for 'Exif\0\0' (0x457869660000)
      if (app1Offset + 6 <= length) {
        const header = String.fromCharCode(
          view.getUint8(app1Offset),
          view.getUint8(app1Offset + 1),
          view.getUint8(app1Offset + 2),
          view.getUint8(app1Offset + 3)
        );

        if (header === 'Exif') {
          const tiffOffset = app1Offset + 6;
          return parseTiffHeader(view, tiffOffset);
        }
      }
      offset += app1Length;
    } else if ((marker & 0xFF00) === 0xFF00) {
      // Skip other JPEG markers
      if (offset + 2 > length) break;
      const sectionLength = view.getUint16(offset, false);
      offset += sectionLength;
    } else {
      break;
    }
  }

  return {
    hasGps: false,
    rawExifFound: false,
    statusMessage: 'No GPS EXIF tags detected in this photograph. Location required via map placement.'
  };
}

function parseTiffHeader(view: DataView, tiffOffset: number): ExifExtractionResult {
  if (tiffOffset + 8 > view.byteLength) {
    return { hasGps: false, rawExifFound: false, statusMessage: 'Corrupt EXIF segment' };
  }

  // Byte alignment: 0x4949 = II (Little Endian), 0x4D4D = MM (Big Endian)
  const byteOrder = view.getUint16(tiffOffset, false);
  const isLittleEndian = byteOrder === 0x4949;

  // 0th IFD offset
  const firstIfdOffset = view.getUint32(tiffOffset + 4, isLittleEndian);
  let ifdOffset = tiffOffset + firstIfdOffset;

  let gpsIfdPointer: number | null = null;
  let cameraMake: string | undefined;
  let cameraModel: string | undefined;
  let dateTime: string | undefined;

  // Read IFD0 tags
  if (ifdOffset + 2 <= view.byteLength) {
    const numEntries = view.getUint16(ifdOffset, isLittleEndian);
    let entryOffset = ifdOffset + 2;

    for (let i = 0; i < numEntries; i++) {
      if (entryOffset + 12 > view.byteLength) break;
      const tag = view.getUint16(entryOffset, isLittleEndian);

      // GPS IFD Pointer Tag = 0x8825
      if (tag === 0x8825) {
        gpsIfdPointer = view.getUint32(entryOffset + 8, isLittleEndian);
      } else if (tag === 0x010F) { // Make
        cameraMake = readAsciiString(view, tiffOffset, entryOffset, isLittleEndian);
      } else if (tag === 0x0110) { // Model
        cameraModel = readAsciiString(view, tiffOffset, entryOffset, isLittleEndian);
      } else if (tag === 0x0132) { // DateTime
        dateTime = readAsciiString(view, tiffOffset, entryOffset, isLittleEndian);
      }

      entryOffset += 12;
    }
  }

  // If GPS IFD pointer exists, parse GPS sub-IFD
  if (gpsIfdPointer !== null) {
    const gpsOffset = tiffOffset + gpsIfdPointer;
    if (gpsOffset + 2 <= view.byteLength) {
      const numGpsEntries = view.getUint16(gpsOffset, isLittleEndian);
      let entryOffset = gpsOffset + 2;

      let latRef = 'N';
      let lngRef = 'E';
      let latComponents: number[] | null = null;
      let lngComponents: number[] | null = null;
      let altitude: number | undefined;
      let imgDirection: number | undefined;

      for (let i = 0; i < numGpsEntries; i++) {
        if (entryOffset + 12 > view.byteLength) break;
        const tag = view.getUint16(entryOffset, isLittleEndian);

        if (tag === 0x0001) { // GPSLatitudeRef
          latRef = String.fromCharCode(view.getUint8(entryOffset + 8));
        } else if (tag === 0x0002) { // GPSLatitude (3 rationals: deg, min, sec)
          latComponents = readRationals(view, tiffOffset, entryOffset, 3, isLittleEndian);
        } else if (tag === 0x0003) { // GPSLongitudeRef
          lngRef = String.fromCharCode(view.getUint8(entryOffset + 8));
        } else if (tag === 0x0004) { // GPSLongitude (3 rationals: deg, min, sec)
          lngComponents = readRationals(view, tiffOffset, entryOffset, 3, isLittleEndian);
        } else if (tag === 0x0006) { // GPSAltitude
          const altRationals = readRationals(view, tiffOffset, entryOffset, 1, isLittleEndian);
          if (altRationals && altRationals.length > 0) {
            altitude = Math.round(altRationals[0] * 10) / 10;
          }
        } else if (tag === 0x0011) { // GPSImgDirection
          const dirRationals = readRationals(view, tiffOffset, entryOffset, 1, isLittleEndian);
          if (dirRationals && dirRationals.length > 0) {
            imgDirection = Math.round(dirRationals[0]);
          }
        }

        entryOffset += 12;
      }

      if (latComponents && lngComponents) {
        let lat = latComponents[0] + latComponents[1] / 60 + latComponents[2] / 3600;
        let lng = lngComponents[0] + lngComponents[1] / 60 + lngComponents[2] / 3600;

        if (latRef === 'S') lat = -lat;
        if (lngRef === 'W') lng = -lng;

        const compass = imgDirection !== undefined ? degToCompass(imgDirection) : 'SE';

        return {
          hasGps: true,
          latitude: parseFloat(lat.toFixed(6)),
          longitude: parseFloat(lng.toFixed(6)),
          altitudeMeters: altitude,
          bearingDeg: imgDirection,
          compassDirection: compass,
          dateTime: dateTime || new Date().toISOString(),
          cameraMake,
          cameraModel,
          rawExifFound: true,
          statusMessage: 'EXIF GNSS Geotag Extracted Successfully'
        };
      }
    }
  }

  return {
    hasGps: false,
    dateTime,
    cameraMake,
    cameraModel,
    rawExifFound: true,
    statusMessage: 'Image contains device EXIF metadata, but lacks embedded GPS coordinates. Location required.'
  };
}

function readRationals(
  view: DataView, 
  tiffOffset: number, 
  entryOffset: number, 
  count: number, 
  isLittleEndian: boolean
): number[] | null {
  const valueOffset = view.getUint32(entryOffset + 8, isLittleEndian);
  let pos = tiffOffset + valueOffset;

  if (pos + count * 8 > view.byteLength) return null;

  const results: number[] = [];
  for (let i = 0; i < count; i++) {
    const numerator = view.getUint32(pos, isLittleEndian);
    const denominator = view.getUint32(pos + 4, isLittleEndian);
    results.push(denominator === 0 ? 0 : numerator / denominator);
    pos += 8;
  }
  return results;
}

function readAsciiString(
  view: DataView,
  tiffOffset: number,
  entryOffset: number,
  isLittleEndian: boolean
): string | undefined {
  const count = view.getUint32(entryOffset + 4, isLittleEndian);
  if (count <= 4) {
    let str = '';
    for (let i = 0; i < count; i++) {
      const charCode = view.getUint8(entryOffset + 8 + i);
      if (charCode === 0) break;
      str += String.fromCharCode(charCode);
    }
    return str.trim();
  }

  const valueOffset = view.getUint32(entryOffset + 8, isLittleEndian);
  const pos = tiffOffset + valueOffset;
  if (pos + count > view.byteLength) return undefined;

  let str = '';
  for (let i = 0; i < count; i++) {
    const charCode = view.getUint8(pos + i);
    if (charCode === 0) break;
    str += String.fromCharCode(charCode);
  }
  return str.trim();
}

function degToCompass(deg: number): string {
  const val = Math.floor((deg / 22.5) + 0.5);
  const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return arr[val % 16];
}
