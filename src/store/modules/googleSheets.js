import { createAction, handleActions } from 'redux-actions';
import * as api from 'lib/api/googleSheets';
import produce from 'immer';

// 액션 타입
const GET_DATA_SUCCESS = 'googleSheets/GET_DATA_SUCCESS';

// 액션 생성 함수
// export const update = createAction(UPDATE_DATA);

export const getConferenceList = () => (dispatch, getState) => {

  return api.getConferenceData('2019.06!S14').then((response) => {
  const { data } = response;
    console.log('response', response);
    return response;
  }).catch(error => {
    // error 를 throw 하여, 이 함수가 실행 된 다음에 다시한번 catch 를 할 수 있게 합니다.
    throw(error);
  });
}

// 리듀서의 초깃값
const initialState = {
  data: {
    list:[]
  }
};

// 리듀서
export default handleActions({
  [GET_DATA_SUCCESS]: (state, action) => {

    console.log('리듀서', state, action);
    return {data: {
      list:[]
    }};
  }
}, initialState);
