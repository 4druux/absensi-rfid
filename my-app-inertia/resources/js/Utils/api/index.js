import axios from "axios";

export const fetcher = (url) => axios.get(url).then((res) => res.data);

export * from "./jurusan";
export * from "./kelas";
export * from "./tahunAjaran";
export * from "./siswa";
export * from "./users";
export * from "./attendance";
