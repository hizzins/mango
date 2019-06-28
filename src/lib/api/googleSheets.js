// https://github.com/axios/axios
import axios from 'axios';
/**
 * 회의 목록 조회
 * @returns {AxiosPromise}
 */
export function getConferenceData(params) {
  console.log('api params', params);
  return axios.get('/getData/'+ params);
}

