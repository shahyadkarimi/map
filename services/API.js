import axios from "axios";

const servicesApi = axios.create({
  withCredentials: false,
  // baseURL: "http://localhost:3000",
  timeout: 60000,
  headers: {
    common: {
      Accept: "application/json",
    },
  },
});

// post method
const postData = async (param, data, withToken = false) => {
  if (withToken) {
    let token = localStorage.getItem("token");
    const res = await servicesApi.post(param, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res;
  }

  const res = await servicesApi.post(param, data);
  return res;
};

// get method
const getData = async (param, data, withToken = false) => {
  if (withToken) {
    let token = localStorage.getItem("token");
    const res = await servicesApi.get(param, {
      params: data,
      headers: { Authorization: `Bearer ${token}` },
    });

    return res;
  }

  const res = await servicesApi.get(param, { params: data });
  return res;
};

// delete method
const deleteData = async (param, data, withToken = false) => {
  if (withToken) {
    let token = localStorage.getItem("token");
    const res = await servicesApi.delete(param, {
      headers: { Authorization: `Bearer ${token}` },
      data: data,
    });

    return res;
  }

  const res = await servicesApi.delete(param, { data: data });
  return res;
};

export { postData, getData, deleteData};
