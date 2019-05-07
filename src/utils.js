class Utils {
  getDateString(dateObj){
    var month = dateObj.getUTCMonth() + 1 < 10 ? '0' + (dateObj.getUTCMonth() + 1) : dateObj.getUTCMonth() + 1
    var day = dateObj.getUTCDate() < 10 ? '0'+dateObj.getUTCDate():dateObj.getUTCDate()
    var year = dateObj.getUTCFullYear()
    return year+'-'+month+'-'+day
  }

  sanitizeTrips(tripData){
    var filtered = tripData.filter((trip) => {
      return trip.route.code === "Ok"
    })

    return filtered
  }

  getDate(dateString){
    return new Date(dateString.replace(/-/g,'/'))
  }
}

export const utils = new Utils()
