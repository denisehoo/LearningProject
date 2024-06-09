import { Alert } from "react-native";
import { useEffect, useState } from "react";
import { Models } from "react-native-appwrite";


interface UseAppwriteProps {
  fn: (...args: any[]) => Promise<any>;
}

const useAppwrite = ({ fn }: UseAppwriteProps, ...params: any[]) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {

    setLoading(true);
    try {
      const res = await fn(...params);
      setData(res);
    } catch (error:any) {
      Alert.alert("FN Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, loading, refetch };
};

export default useAppwrite;
