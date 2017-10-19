export const dateToFormatStr = (date, needTime = true) => {
  let Y = date.getFullYear()+'';
  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)+'';
  let D = (date.getDate() < 10 ? '0'+ date.getDate() : date.getDate()) + '';
  let h = '_' + (date.getHours() < 10 ? '0'+ date.getHours() : date.getHours()) + ':';
  let m = (date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes());

  if (needTime) {
    return Y+M+D+h+m;
  } else {
    return Y + '.' + M + '.' + D;
  }
};

export const formatDateToTime = str => {
  if(str){
    return str.slice(9,14);
  }else{
    return str;
  }
};