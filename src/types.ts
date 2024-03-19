export interface RawData {
  type: string;
  features: {
      type: string;
      id: string;
      properties: {
          name: string;
          [otherProperties: string]: string
      };
      geometry: {
          type: string;
          coordinates: [number, number];
      } 
  }[];
}

export interface RefinedData {
  name: string;
  x: number;
  y: number;
}