class Utils {
  getDateString(dateObj){
    var month = dateObj.getUTCMonth() + 1 < 10 ? '0' + (dateObj.getUTCMonth() + 1) : dateObj.getUTCMonth() + 1
    var day = dateObj.getUTCDate() < 10 ? '0'+dateObj.getUTCDate():dateObj.getUTCDate()
    var year = dateObj.getUTCFullYear()
    return year+'-'+month+'-'+day
  }
}

export const utils = new Utils()
