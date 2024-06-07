import { useEffect, useState } from "react";
import { ConvertedData } from "../logics/convertData";
import { getData } from "../logics/data";
import { areaHeight, areaWidth } from "../constants";

export const useData = () => {
  const [data, setData] = useState<ConvertedData[]>([]);
  const [location, setLocation] = useState<string>("강남역");
  useEffect(() => {
    setData([]);
    const fetchData = async () => {
      const d: ConvertedData[] = await getData(location, areaWidth, areaHeight);
      setData(d);
    }
    fetchData();
  }, [location]);

  return { data, location, setLocation };
}