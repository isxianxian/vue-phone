let formatTime = (time, pattern) => {
  time = new Date(time);
  let obj = {
    'y+': time.getFullYear(),
    'M+': time.getMonth() + 1,
    'd+': time.getDate() + 1,
    'h+': time.getHours(),
    'm+': time.getMinutes(),
    's+': time.getSeconds()
  }

  for (let attr in obj) {
    let reg = new RegExp(attr),
      val = obj[attr];
    pattern = pattern.replace(reg, (...arr) => {
      let length = arr[0].length;
      val = val.toString().padStart(length, '0');
      return val;
    })
  }

  return pattern;
}

export default {
  formatTime
}